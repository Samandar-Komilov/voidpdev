---

title: "Bytely - URL Shortener"
description: "Scalable URL shortener being built for practicing System Design."
date: 2025-08-26

---

# Bytely - About

This project is only about building a URL shortener, which seems easy. But before considering them easy, we need to understand what this actually is and how it works under the hood, especially in high load scenarios.

!!! info "What is a URL Shortener?"
    The URL Shortener performs basically 2 things: shortening the urls and redirecting the short urls to their original destinations. So, we need two primary issues to solve:  
    
    :scissors: **Shortening URLs:** we need some algorithm to create unique short codes for our long urls. It should be unique even if we need to store 100 million URLs.   
    :material-restart: **Redirecting URLs:** Finding the original URL from short code have to be as fast as possible, `O(1)` is the best. So, we need hashmap-like structure to handle this.  
       
    :chart_with_upwards_trend: **Scalability:** If we analyze the shape of the traffic, we understand that it is read-heavy (90-99% reads), so latency is very sensitive in redirection case. Considering 100 million requests per day, we need to design a system that can handle the load. We might use caching, database indexing techniques, partitioning, etc.  

So, I decided to implement this project step-by-step, with version-based approach. Let's distribute the whole process into 8 stages:

1. A "toy" in-memory service
2. Persistent (database-backed) service with DB sequence as short code
3. Better code generation and deduplication strategy
4. Add Caching to the Hot Path
5. Rate Limiting & Abuse Protections
6. Analytics (without killing the hot path)
7. Vertical scaling (multiple workers behind nginx)
8. Horizontal scaling (multiple app instances behind a load balancer)

This step-by-step ensures we are not rushing nor overcomplicating the problem. We are balancing the learning path and actual project outcome. 

!!! danger

    Overcomplicating the problem is a recipe for failure.

Let's start with the first stage...