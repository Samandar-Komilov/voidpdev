---
title: "Network Programming in Go #1: net/http"
description: "In this post we are gonna explore the standard `net/http` library internals - how it works and why it works the way it works."
date: 2025-10-14
categories:
  - System Programming
tags:
    - go
---


In this post we are gonna explore the standard `net/http` library internals - how it works and why it works the way it works.

<!-- more --> 

!!! abstract "Contents"
    1. HTTP Server Basics
        - `http.Request`, `http.Response` and `http.ResponseWriter`
        - `http.Handle` and `http.HandleFunc`
        - `http.Handler` and `http.HandlerFunc`
        - `http.Serve` and `http.ListenAndServe`
        <!-- - `http.Server` -->
    2. Request Lifecycle: Context
        - `request.Context()`
    3. Routing and Middleware
        - `http.ServeMux`, `http.NewServeMux` and `http.DefaultServeMux`
        - Middleware Composition
    4. HTTP Client and Transport Internals
        - `http.Client`, `http.NewRequest`, `Client.Do`, `http.Get/Post`
        - `http.Transport`


## 1. HTTP Server Basics

### http.Request

The most important construct in building web applications is `Request`, no doubt. When we built our own [Nginx clone](https://github.com/Samandar-Komilov/cserve) in C, we too defined that entity at first. For this reason, I believe it worth examining `http.Request` struct initially which is defined in the standard `net/http` library:
```go title="net/http/server.go"
type Request struct {
    Method string                 // HTTP method (GET, POST, PUT, etc.)
    URL *url.URL                  // URI being requested (for server requests) or the URL to access (for client requests)
    Proto string                  // e.g. "HTTP/1.0"
    Header Header                 // Request headers as map[string][]string.
    Body io.ReadCloser            // The request body as a readable stream
    ContentLength int64           // Length of the body in bytes (or -1 if chunked/unknown)
    Close bool                    // Flag to close the request after receiving the response (true means no keep-alive connection)
    Host string                   // Host header, from which device the request is coming
    Form url.Values               // Parsed form data, including URL query params and PATCH, PUT or POST form data
    MultipartForm *multipart.Form // Parsed multipart form, including file uploads
    Trailer Header                // Headers after body in chunked responses
    TLS *tls.ConnectionState      // TLS details if HTTPS (nil otherwise)
    ctx context.Context           // Request context for cancellation, deadlines, or values
    // ...shortened
}
```
The most striking point is that we don't necessarily need to parse the raw HTTP, create a new instance from struct, it happens automatically. 

### http.ResponseWriter

It's nice that HTTP request is parsed into `http.Request` construct automatically, with all necessary fields available. But how we return the response? I mean, we should somehow build the corresponding `http.Response` construct, isn't it? But how? Before answering the question, let's consider the `http.Response` struct:
```go title="net/http/server.go"
type Response struct {
    Status string             // Response Status, e.g. "200 OK"
	StatusCode int            // Status Code in integer, e.g. 200
	Proto string              // e.g. "HTTP/1.0"
    Header Header             // Request headers as map[string][]string.
    Body io.ReadCloser        // The response body as a readable stream
    ContentLength int64       // Length of the body in bytes (or -1 if chunked/unknown)
    Request *Request          // Associated request instance to this response
    TLS *tls.ConnectionState  // TLS details if HTTPS (nil otherwise)
    // ...shortened
}
```

Perfect, should I build the response by hand? No, Go handles that for us, but partially. It creates the response object with basic fields, but lets us change it - using `http.ResponseWriter` interface. A `http.ResponseWriter` interface is used by an HTTP handler to construct an HTTP response. Let's look at its structure as well:
```go title="net/http/server.go"
type ResponseWriter interface {
    Header() Header
    Write([]byte) (int, error)
    WriteHeader(statusCode int)
}
```
The structure is write-only and the implementations are provided by the built-in HTTP server (uses `*http.Response` internally), so we don't create it manually. Now, let's discuss what we can do with this interface:

* `Header() http.Header`: returns the response headers as an `http.Header` map (which is internally `map[string][]string`). We may use it to set headers like `Content-Type` before writing the body. For example:
    ```go
    w.Header().Set("Content-Type", "application/json")
    ```
* `Write([]byte) (int, error)`: writes the response body as bytes. It implements the `io.Writer` interface, which means you can use `fmt.Fprintf(w, ...)` or such other writers. For example: 
    ```go
    w.Write([]byte("Hello World"))
    ```
* `WriteHeader(statusCode int)`: sets the HTTP status code. We must call it before writing the body, otherwise defaults to 200. For example:
    ```go
    w.WriteHeader(http.StatusNotFound)` or more simply `w.WriteHeader(404)
    ```


### http.Handle and http.HandleFunc

We analyzed the `Request` and `Response` constructs, learned how to send responses with `ResponseWriter` interface, but how we can "glue" them together that result an API handler? At this point, we come across the helper functions that registers HTTP handlers with a default global multiplexer `http.DefaultServeMux` (more about multiplexers in chapter 3):  

1. `http.Handle(pattern string, handler http.Handler)`  
    Registers a handler for the given URL pattern. But what does that **handler** mean? 
    A handler is any type that implements `http.Handler` interface. This interface is a core contract for anything that can handle HTTP requests. Its structure is as follows:
    ```go title="net/http/server.go"
    type Handler interface {
        ServeHTTP(ResponseWriter, *Request)
    }
    ```
    The server calls `ServeHTTP()` method for each incoming request. You can implement it on structs for stateful behaviour, for example:
    ```go title="main.go"
    type MyHandler struct {
        count int
    }

    func (h *MyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
        h.count++
        fmt.Fprintf(w, "Request Count: %d", h.count)
    }

    // ...
    http.Handle("/", &MyHandler{})
    ```
    This handler counts the number of requests sent. Such stateful behaviour is primarily used when working with Middlewares and we'll explore it later on.  
    
    Well, this is one way of building a simple API. But you see, how much work we should perform? **But do we have to? No.**
    
2. `http.HandleFunc(pattern string, handler func(http.ResponseWriter, r *http.Request))`  
    A convenience wrapper around `http.Handle`. It takes a plain function and wraps it in `http.HandlerFunc` to make it satisfy `http.Handler` interface. Wait a second, what is `http.HandlerFunc`? It is a type alias for a function signature that matches `ServeHTTP()` method of the `http.Handler` interface:
    ```go
    type HandlerFunc func(ResponseWriter, *Request)
    ```
    So, if we write a function in this signature, the `HandleFunc()` makes it an API endpoint automatically:
    ```go
    func hello(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello\n")
    }
    // ...
    http.HandleFunc("/hello", hello)
    ```
    Well, now we already know everything we need to create a simple API endpoint. Isn't something missing? Of course.


### http.Serve and http.ListenAndServe

Although, it seems we are done, when we run the code nothing works. Well, it's natural - where does it know which port it is listening to? Every server application should listen at some specific port to accept requests and respond accordingly, but where is that? We have two choices at this point:

1. `http.Serve(l net.Listener, handler http.Handler) error`  
    Starts the HTTP server. This is a lower-level function that uses existing listeners like `net.Listen` or `tls.Listen`. Here is a simple example:
    ```go title="main.go" hl_lines="13"
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		fmt.Println("Error creating listener:", err)
		return
	}
    log.Println("Listening on port 8080...")
	defer listener.Close()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, World!")
	})

	http.Serve(listener, nil)
    ```
    We mostly use it for custom setups like non-TCP, custom ports or Unix sockets. Also we should manually configure TLS with `crypto/tls` (if we need HTTPS), use with `*http.Server` for `Shutdown` method to enable graceful shutdown.
2. `http.ListenAndServe(addr string, handler http.Handler) error`  
    Starts the HTTP server. This is a higher-level function, it automatically creates a `net.Listener` and passes it to `http.Serve`. Here is an example:
    ```go title="main.go" hl_lines="9"
    func hello(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello\n")
    }

    func main() {
        http.HandleFunc("/hello", hello)

        fmt.Println("Listening on port 8090...")
        http.ListenAndServe(":8090", nil)
    }
    ```
    It is very simple, but not recommended for production setups as it lacks timeouts, graceful shutdown, etc. 

    !!! note
        These production-grade topics will be discussed in one of the upcoming posts.

Well, what is happening under the hood of the `http.Serve` and `http.ListenAndServe`? Let's explore the source code of the first one:
```go title="net/http/server.go" hl_lines="2"
func Serve(l net.Listener, handler Handler) error {
	srv := &Server{Handler: handler}
	return srv.Serve(l)
}
```
Wait a second, what is it instantiating? `http.Server`, what is that? Is this the case in the second one, let's see:
```go title="net/http/server.go" hl_lines="2"
func ListenAndServe(addr string, handler Handler) error {
	server := &Server{Addr: addr, Handler: handler}
	return server.ListenAndServe()
}
```
What is happening here? What is `http.Server`?

### http.Server

As its name suggests, this construct represents the base HTTP server for our server applications. Let's look at the structure of this construct:
```go title="net/http/server.go"
type Server struct {
    Addr string                     // optionally specifies the TCP address (host:port) for the server to listen on, default ":http" (port 80)
    Handler Handler                 // handler to invoke when request comes, http.DefaultServeMux if nil
    TLSConfig *tls.Config           // optionally provides TLS configuration for using by ServeTLS or ListenAndServeTLS
    ReadTimeout time.Duration       // maximum duration to read the entire request, including the body
    ReadHeaderTimeout time.Duration // maximum duration to read the request headers
    WriteTimeout time.Duration      // maximum duration to write the response
    IdleTimeout time.Duration       // maximum duration to wait for the next request when keep-alive enabled
    MaxHeaderBytes int              // controls the maximum number of bytes for the request headers' keys and values, including request line
    HTTP2 *HTTP2Config              // HTTP/2 server configurations
    // ...shortened
}
```
We can create a new server application using solely this construct:
```go
srv := &http.Server{
    Addr: ":8001",
}

err := srv.ListenAndServe()
if err != nil {
    log.Fatal(err)
    return
}
```
This server now listens on port 8001, with default multiplexer as handler and this is why when you send request to this server, it responds with 404. We'll discuss multiplexers later, but for now we can conclude that everything actually uses this construct when we write server applications. 


## 2. Request Lifecycle: Context

Servers need a way to handle metadata on individual requests. This metadata falls into two general categories: 

* *metadata that is required to correctly process the request*
* *metadata on when to stop processing the request*

For example, an HTTP server might want to use a tracking ID to identify a chain of requests through a set of microservices. It also might want to set a timer that ends requests to other microservices if they take too long. Go solves this problem with a `Context` construct.

### What is the Context?

The authors decided not to add a new feature to the language, nor change the signature of `http.Handler` functions (due to backward-compatibility promise). Instead, they implemented the `Context` interface inside `context` package and made it another parameter to our functions, as the idiomatic Go encourages this:
```go
func someLogic(ctx context.Context, info string) (string, error){
    // some logic happens here
    return "", nil
}
```
We can explore the structure of the `Context` interface:
```go title="context/context.go"
type Context interface {
    Deadline() (deadline time.Time, ok bool)  // returns the time when work done on behalf of this context should be canceled
    Done() <-chan struct{}                    // returns a channel that's closed when work done on behalf of this context should be canceled
    Err() error                               // if Done() is closed, returns an error explaining why context canceled: e.g. DeadlineExceeded
    Value(key any) any                        // returns the value associated with this context for key or nil
}
```
In addition to the `Context` interface, the `context` package also contains several factory and helper functions:

* `context.TODO()` - returns a new empty context. Use as a placeholder, when you're not sure what values you'll need later.
* `context.Background()` - returns a new empty context that is always canceled at some point. 
* `context.WithValue()` - returns a new context by adding a new key-value pair to the provided parent context.
* `context.WithCancel()` - returns a new context by adding a cancel function to the provided parent context.
* `context.WithDeadline()` - returns a new context by adding a deadline time.
* `context.WithTimeout()` - returns a new context by adding a timeout duration.
* `context.Done()` - returns a boolean value indicating whether the context has been canceled.
* `context.Value()` - returns a value stored in the context.

To conclude, the context is used to efficiently manage the request lifecycle. Overall, the context is used in the following scenarios:

* to gather additional information about the environment they're being executed in. It may seem tempting to put all of your data in a context and use that data in your functions instead of parameters, but that can lead to code that is hard to read and maintain. A good rule of thumb is that any data required for a function to run should be passed as parameters.
* to signal other functions (which are using this context) that this context is ended and should be considered complete. For example, if a user exits the browser before server completes the response, the cancel signal is triggered saving the server's valuable resources.
* for setting a timeout to signal when exactly this context become ended.

We're not going to dive into contexts now, but we'll use them in the upcoming chapters and therefore we need to recall. You can read the complete article about contexts [in this post](https://www.digitalocean.com/community/tutorials/how-to-use-contexts-in-go).


## 3. Routing and Middleware

Typically, we have more than one handler in our HTTP server. When it receives a request, it must decide which handler should process that request based on its path and HTTP method. This decision making process is called **routing** or **request multiplexing**. To achieve this, standard library offers the following constructs:

* `ServeMux`
* `mux.ServeHTTP()`
* `NewServeMux()`
* `DefaultServeMux`
* `mux.Handler()`
* `mux.Handle()`
* `mux.HandleFunc()`

Before going deeper into multiplexers, let's consider a simple example on how we can use them:
```go title="main.go" hl_lines="1"
mux := http.NewServeMux()

mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("hello"))
})

log.Println("Listening on port 8090...")
err := http.ListenAndServe(":8090", mux)
```
As we can see, it is very similar to routers we have seen in FastAPI or aiogram, but we need [chi](https://go-chi.io/) or similar external library to fully achieve that behaviour. At least, we can register handlers into the router and serve all of the handlers registered to it with the server. Now, let's analyze what are these "mux"s deep down and how they work.

### Routing: How Multiplexers Work?

The key construct to achieve this behaviour is `http.ServeMux`. It is an HTTP request multiplexer and it matches the URL of each incoming request against a list of registered patterns and calls the respective handler that most closely matches the pattern. Here is the structure of the construct:

```go title="net/http/server.go"
type ServeMux struct {
    mu sync.RWMutex     
    tree routingNode    
    index routingIndex  
    mux121 serveMux121  // for Go versions below 1.22, due to backward incompatible changes
}
```

Basically, `http.ServeMux` is a struct that implements `http.Handler` interface, and therefore is also considered a handler. This is why when we call `http.ListenAndServe(addr, mux)`, the HTTP server calls `ServeHTTP()` method of the multiplexer. Here is the proof that it implements handler interface:
```go title="net/http/server.go" hl_lines="13 15"
func (mux *ServeMux) ServeHTTP(w ResponseWriter, r *Request) {
	if r.RequestURI == "*" {
		if r.ProtoAtLeast(1, 1) {
			w.Header().Set("Connection", "close")
		}
		w.WriteHeader(StatusBadRequest)
		return
	}
	var h Handler
	if use121 {
		h, _ = mux.mux121.findHandler(r)
	} else {
		h, r.Pattern, r.pat, r.matches = mux.findHandler(r)
	}
	h.ServeHTTP(w, r)
}
```
We can clearly see that the multiplexer simply gets the request, finds the corresponding handler based on the pattern and calls the handler. But this process happens much faster than we think, because they used tree data structure to store patterns as key-value. If it were array or linked-list, it would be `O(n)` to find the pattern and therefore much slower.

Well, the method `http.NewServeMux()` simply creates a new multiplexer. And earlier, we didn't specify the handler while initiating our `http.Server` construct and said that if gets the `DefaultServeMux` automatically. Here is the source code for these:

```go title="net/http/server.go" hl_lines="2 6 7"
func NewServeMux() *ServeMux {
	return &ServeMux{}
}

// DefaultServeMux is the default [ServeMux] used by [Serve].
var DefaultServeMux = &defaultServeMux
var defaultServeMux ServeMux
```

Aha! So, when we create APIs with `http.Handle` and `http.HandleFunc`, they simple are registered to the default mux - empty multiplexer! Here is the source code for this:

```go title="net/http/server.go" hl_lines="6 15"
// Handle registers the handler for the given pattern in [DefaultServeMux].
func Handle(pattern string, handler Handler) {
	if use121 {
		DefaultServeMux.mux121.handle(pattern, handler)
	} else {
		DefaultServeMux.register(pattern, handler)
	}
}

// HandleFunc registers the handler function for the given pattern in [DefaultServeMux].
func HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	if use121 {
		DefaultServeMux.mux121.handleFunc(pattern, handler)
	} else {
		DefaultServeMux.register(pattern, HandlerFunc(handler))
	}
}
```

If we want to use custom multiplexer for our APIs, the `http.ServeMux` struct has matching methods: `mux.Handle()` and `mux.HandleFunc()` which registers to the router we assigned, instead of the default:

```go title="net/http/server.go" hl_lines="6 15"
// Handle registers the handler for the given pattern.
func (mux *ServeMux) Handle(pattern string, handler Handler) {
	if use121 {
		mux.mux121.handle(pattern, handler)
	} else {
		mux.register(pattern, handler)
	}
}

// HandleFunc registers the handler function for the given pattern.
func (mux *ServeMux) HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	if use121 {
		mux.mux121.handleFunc(pattern, handler)
	} else {
		mux.register(pattern, HandlerFunc(handler))
	}
}
```

As a conclusion, we state that multiplexers are one of the most vital element in the `net/http`'s request-response cycle. Even though newer technologies like [chi](https://go-chi.io/) enhanced the default functionality, the core logic stays the same. We can draw the conclusion diagram:
``` mermaid
sequenceDiagram
    participant Client
    participant Server as http.Server
    participant Mux as http.ServeMux
    participant Handler as Your Handler (implements ServeHTTP)

    Client->>Server: sends HTTP request (e.g., GET /hello)
    Server->>Mux: calls ServeHTTP(w, r)
    alt r.RequestURI == "*"
        Mux-->>Client: 400 Bad Request
    else valid request
        Mux->>Mux: findHandler(r)\n(tree traversal / pattern match)
        Mux->>Handler: h.ServeHTTP(w, r)
        Handler-->>Client: writes response via ResponseWriter
    end
```


## 4. HTTP Client and Transport Internals

### HTTP Client

### Transport


---

### Resources & Bibliography

- [Official Go net/http library documentation](https://pkg.go.dev/net/http)
- [Go By Example - HTTP related sections](https://gobyexample.com/http-server)
- [Learning Go - An Idiomatic Approach](https://www.amazon.com/Learning-Go-Idiomatic-Real-World-Programming/dp/1492077216) by Jon Bodner
- [How to Use Contexts in Go by DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-use-contexts-in-go)