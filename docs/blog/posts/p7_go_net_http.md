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
```go
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
```go
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
```go
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
    ```go
    type Handler interface {
        ServeHTTP(ResponseWriter, *Request)
    }
    ```
    The server calls `ServeHTTP()` method for each incoming request. You can implement it on structs for stateful behaviour, for example:
    ```go
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

1. `http.Serve(l net.Listener, handler http.Handler) error`: starts the HTTP server.
    * This is a lower-level function that uses existing listeners like `net.Listen` or `tls.Listen`. We mostly use it for custom setups like non-TCP, custom ports or Unix sockets. Also we should manually configure TLS with `crypto/tls`, use with `*http.Server` for `Shutdown` method to enable graceful shutdown.
    * However, we don't cover this right now. You can read my separate post about `net` library [here](https://voidp.dev/blog/) (soon...).
2. `http.ListenAndServe(addr string, handler http.Handler) error`: starts the HTTP server.
    * This is a higher-level function, it automatically creates a `net.Listener` and passes it to `http.Serve`. It is very simple, but not recommended for production setups as it lacks timeouts, graceful shutdown, etc. But for now, we can use it to continue our journey without focusing too deep on details.
So, now our first API is complete:
```go
func hello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello\n")
}

func main() {
	http.HandleFunc("/hello", hello)

    fmt.Println("Listening on port 8090...")
    http.ListenAndServe(":8090", nil)
}
```


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

### Routing: How Multiplexers Work?


## 4. HTTP Client and Transport Internals

### HTTP Client

### Transport


---

### Resources & Bibliography

- [Official Go net/http library documentation](https://pkg.go.dev/net/http)
- [Go By Example - HTTP related sections](https://gobyexample.com/http-server)
- [Learning Go - An Idiomatic Approach](https://www.amazon.com/Learning-Go-Idiomatic-Real-World-Programming/dp/1492077216) by Jon Bodner
- [How to Use Contexts in Go by DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-use-contexts-in-go)