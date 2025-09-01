---

title: "Bytely - URL Shortener"
description: "Scalable URL shortener being built for practicing System Design."
date: 2025-08-26

---

# Bytely - About

This project is only about building a URL shortener, which seems easy. But before considering them easy, we need to understand what this actually is and how it works under the hood, especially in high load scenarios.

## Step 1: Understand the Problem

System design interview questions are intentionally left open-ended. To design a well-crafted system, it is critical to ask clarification questions.

!!! info "Interview Progress"
    **:writing_hand: Candidate:** Can you give an example of how a URL shortener work?  
    **:microphone2: Interviewer:** The URL Shortener performs basically 2 things: shortening the urls and redirecting the short urls to their original destinations.

    **:writing_hand: Candidate:** What is the Traffic Volume?  
    **:microphone2: Interviewer:** 100 million URLs are generated per day.  

    **:writing_hand: Candidate:** How long is the shortened URL?  
    **:microphone2: Interviewer:** As short as possible.  

    **:writing_hand: Candidate:** What characters are allowed in the shortened URL?  
    **:microphone2: Interviewer** Shortened URL can be a combination of numbers (0-9) and characters (a-z, A-Z).

    **:writing_hand: Candidate:** Can shortened URLs be deleted or updated?  
    **:microphone2: Interviewer:** For simplicity, let us assume shortened URLs cannot be deleted or updated. Here are the basic use cases:  

    - URL shortening: given a long URL => return a much shorter URL  
    - URL redirecting: given a shorter URL => redirect to the original URL  
    - High availability, scalability, and fault tolerance considerations

Now, based on the information we should perform a **Back of The Envelope Estimation**: 

!!! tip "Back of the Envelope Estimation"
    - Write operation: **100 million** URLs are generated per day.
    - Write operation per second: `100 million / 24 /3600 = 1160`
    - Read operation: Assuming ratio of read operation to write operation is **10:1**, read operation per second: `1160 * 10 = 11,600`
    - Assuming the URL shortener service will run for **10 years**, this means we must support `100 million * 365 * 10 = 365 billion` records.
    - Assume average URL length is **100**.
    - Storage requirement over 10 years: `365 billion * 100 bytes * 10 years = 365 TB`

## Step 2: High Level Design

In this section we should focus on overall workflow, how data is stored, transferred and how it is accessed.

### API Endpoints

We'll choose REST-style APIs. There are only 2 APIs:

- Create a new short URL: `POST api/v1/shorten/`
    - request param: `long_url`
    - response: `short_url`
- Redirect short URL: `GET api/v1/{short_url}/`
    - return `long_url` for HTTP redirection

In terms of URL redirection, we have 2 options: 301 or 302 redirect. The 301 redirect is permanent and the 302 redirect is temporary. In this project, we will use 302 redirect because we need analytics data on the number of redirects.

### URL Shortening

The most intuitive way is to use a hash table like `<shortURL:longURL>`. Now, hashtable requires us to find a proper hash function:

- Each `longURL` must be hashed to one `hashValue`
- Each `hashValue` can be mapped to one `shortURL`

## Step 3: Design Deep Dive

From now on, we can dive deeper on low level design, like data model, hash function choices, etc.

### Data Model

In the high-level design, everything is stored in a hash table. This is a good starting point; however, this approach is not feasible for real-world systems as memory resources are limited and expensive. A better option is to store `<shortURL, longURL>` mapping in a relational database. The simplest database model is `Link(id, shortURL, longURL)`.

### Hash Function

Our expected `hashValue` should consist of characters from `[0-9, a-z, A-Z]`, containing 62 possible characters. We are said that the hash value should be as short as possible, so we need to compute the smallest `n` that `62^n >= 365 billion`. The smallest `n` is 7, because `62^7 = ~3.5 trillion`. This means we need to use 7 character long short codes for `hashValue`.

We should consider 2 types of hash functions now: hash + collision resolution and base62 conversion.

**Hash + Collision Resolution**  
To shorten a long URL, we should implement a hash function that hashes a long URL to a 7-character string. A straightforward solution is to use well-known hash functions like CRC32, MD5, or SHA-1. But if we look at the natural lengths of these hash functions, their lengths are way longer than 7. So we need a way: maybe cut 1st 7 characters? But this will cause hash collisions. To resolve collisions we can recursively append a new predefined string until no more collision is discovered. (Soon I'll dive deeper on this).

!!! warning
    In this situation, a **Bloom Filter** is a better solution. However we have another option.

**Base62 Conversion**  
Base conversion helps to convert the same number between its different number representation systems. For example, `11157` becomes `2TX`.

| Hash + Collision Resolution                        | Base62 Conversion                                |
| -------------------------------------------------- | ------------------------------------------------ |
| Fixed short URL length                             | The short URL length is not fixed, depends on ID |
| No need for unique ID generator                    | Depends of unique ID generator                   |
| Collision is possible                              | Collision is impossible                          |
| Impossible to figure out next available short code | Easy to figure out next short URL based on ID    |

### URL Shortening

Well, let's look at the overall flow of the URL shortening process:

1. The `longURL` is the input.
2. The system checks if the `longURL` is in the database.
3. If it is, it means the `longURL` was converted to `shortURL` before. In this case, fetch the `shortURL` from the database and return it to the client.
4. If not, the `longURL` is new. A new unique ID (primary key) is generated by the unique ID generator.
5. Convert the ID to `shortURL` with base 62 conversion.
6. Create a new database row with the `ID`, `shortURL`, and `longURL`.

Now, everything seems complete, until we reach the distributed environment. At this point, we have to discuss a **Unique ID Generator**, as it is a challenging task. You can visit the link about related discussion.

## Step 4: Wrap Up

If there is extra time at the end of the interview, here are a few additional talking points.

!!! note "Additional points"
    - **Rate limiter:** A potential security problem we could face is that malicious users send an overwhelmingly large number of URL shortening requests. Rate limiter helps to filter out requests based on IP address or other filtering rules. We need to focus on chapter 4 for this.
    - **Web server scaling:** Since the web tier is stateless, it is easy to scale the web tier by adding or removing web servers.
    - **Database scaling:** Database replication and sharding are common techniques.
    - **Analytics:** Data is increasingly important for business success. Integrating an analytics solution to the URL shortener could help to answer important questions like how many people click on a link? When do they click the link? etc.
    - **Availability, consistency, and reliability.** We should recall the chapter 1 for this.

## Step 5: Implementation

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

Reference Material: [System Design Interview by Alex Xu](https://www.amazon.co.uk/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)