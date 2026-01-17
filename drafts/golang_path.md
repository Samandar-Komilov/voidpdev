# Path - moving forward

Once we explored the basics of the Go Language for about 1.5 months, using "Learning Go" by Jon Bodner and official documentation, we have now come to the point where a serious decision needs to be made.

As of October 26, 2025, we are exploring Go standard library starting from `net/http`. We published a research post on the server side components of the library 10 days ago, and now before moving on to `net` library, we realized that `io`, `bufio`, `time` and such packages need to be explored first.

So, after a long discussion, we came to the following plan.

!!! success "Overall Plan"
    1. **Standard Library Core (targeted, not exhaustive): io, bufio, time, fmt, errors, os, sync, context.**  
        Reason: these are runtime-level building blocks. Every system project uses them directly. You must read docs, implement exercises, and experiment until internalized. Don’t move on until you can implement simple TCP echo, concurrent file copying, buffered loggers, etc., without reference.
    2. **100 Go Mistakes: Read right after the core stdlib phase.**
        Reason: it hardens your understanding of Go semantics (goroutines, interfaces, slices, maps, error handling). Prevents unlearning later. Use it as a diagnostic manual, not a tutorial.
    3. **System Programming Essentials With Go — Alex Rios**
        Integrate system concepts (processes, signals, IPC, files). Apply the stdlib knowledge you built in step 1.
    4. **Network Programming With Go — Adam Woodbeck**
        Once comfortable with system-level primitives, go deeper into TCP/UDP servers, DNS, HTTP internals, and socket multiplexing. Build real daemons and proxies.
    5. **Learn Go With Pocket Sized Projects**
        Use this parallel to steps 3–4 to apply concepts through small system-oriented builds (CLI tools, loggers, concurrent downloaders, etc.).
    6. **Cloud Native Go — Matthew A. Titmus**
        Final phase: deploy, distribute, orchestrate. Transition from single-node systems to clustered architectures.

I believe this step-by-step path ensures to practice Golang as efficient as possible, and achieving my system programming goals faster.