# Project Ideas and Inspirations

This document lists the system-level projects to build in any programming language, preferably lower level ones like Go. 

!!! example "Networking / Systems"
    1. **HTTP Reverse Proxy (ngrok-like)** — multiplex TCP over single connection, handle TLS termination.
    2. **HTTP/2 and HTTP/3 Server** — implement protocol framing, multiplexing, header compression (HPACK/QPACK).
    3. **In-memory Cache (Redis clone)** — implement eviction (LRU, LFU, ARC), AOF/RDB persistence.
    4. **Traceroute / Ping Utility** — raw sockets, ICMP packet crafting, TTL manipulation.
    5. **VPN/Tunnel Protocol** — implement custom tunneling using UDP, encryption, and NAT traversal.
    6. **Custom Load Balancer** — round-robin, least-connections, consistent hashing.
    7. **DNS Resolver** — parse DNS packets, implement caching and recursion.
    8. **Message Queue (like NATS/Kafka-lite)** — build a broker with pub/sub, ACKs, retention, and partitioning.
    9. **SSH Server** — build your own SSH handling server using crypto primitives and session multiplexing.
    10. **File Sync Tool (rsync-like)** — rolling checksum (Rabin-Karp), delta encoding, and resumable uploads.

!!! abstract "Storage / Databases"
    1. **SQL Engine (SQLite-lite)** — implement tokenizer, parser, query planner, B-Tree storage.
    2. **Key-Value Store (BoltDB or BadgerDB clone)** — implement WAL, MVCC, page management.
    3. **Full-Text Search Engine (like Bleve or Lucene)** — inverted index, tokenization, ranking (TF-IDF).
    4. **Time-Series DB (like Prometheus)** — compression, block storage, LSM tree, query engine.
    5. **Blob Storage Server (S3-like)** — multipart uploads, versioning, metadata indexing.

!!! danger "Concurrency / OS Simulation"
    1. **Goroutine Scheduler Simulator** — simulate preemptive scheduling, work stealing, queues.
    2. **Custom Thread Pool / Worker Pool Framework** — task queue, backpressure, rate limiting.
    3. **Process Supervisor (like systemd)** — spawn, monitor, restart, and isolate processes.
    4. **In-memory File System** — directory tree, inode structure, journaling simulation.
    5. **Container Runtime (Docker-lite)** — use namespaces, cgroups, overlayfs, image layers.

!!! warning "Security / Networking Tools"
    1. **TLS Handshake Implementation** — implement client/server handshake from RFC.
    2. **Packet Sniffer (tcpdump-like)** — use `AF_PACKET`, parse Ethernet/IP/TCP layers.
    3. **Firewall (iptables-like)** — define packet filtering rules, NFQUEUE integration.
    4. **HTTP/3 (QUIC) Implementation** — frame parsing, connection migration, loss recovery.
    5. **Web Application Firewall** — pattern matching, rate limiting, rule-based blocking.

!!! tip "Distributed Systems"
    1. **Raft Consensus Implementation** — leader election, log replication, membership changes.
    2. **Distributed Key-Value Store** — use Raft or Paxos for consensus.
    3. **Service Mesh (Istio-lite)** — sidecar proxy injection, service discovery, tracing.
    4. **Distributed Job Scheduler (like Celery)** — worker coordination, retries, result backend.
    5. **Log Aggregator (like Fluentd)** — tail log files, apply filters, send to multiple outputs.

---

### Sequence

Here is my current plan to build such projects step-by-step:

1. Reverse proxy (jprq-like)
2. In-Memory Cache (Redis-like)
3. SQL engine (SQLite-like)
4. Packet Sniffer (tcpdump-like)
5. Container runtime (docker-like).
