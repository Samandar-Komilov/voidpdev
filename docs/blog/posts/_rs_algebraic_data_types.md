---
title: "Algebraic Data Types: A Systems Engineering Perspective"
description: "Rust has structs and enums just like in C or Go. But did you know they actually are algebraic data types and especially important in Rust?"
date: 2026-01-17
categories:
  - Rust
tags:
    - Rust
    - Systems Thinking
    - AI assisted
---

Rust has structs and enums just like in C or Go. But did you know they actually are algebraic data types and especially important in Rust?

<!-- more -->

- [The Rust Programming Book](https://doc.rust-lang.org/book/ch01-02-hello-world.html)
- [A Tour of Rust](https://tourofrust.com/)

## 1. What are Algebraic Data Types?
Before diving into code, let's understand ADTs as a mathematical concept used to model data. The term "Algebraic" comes from the fact that we can create new types by combining existing types using algebraic operations, primarily **Sum** and **Product**.

Imagine you are designing a system state. You need to define the "universe" of all possible values your data can hold.

#### The Product Type (`AND`)
A product type combines multiple types together. A value of a product type contains a value of type A **`AND`** a value of type B.

- **Mathematical Analogy**: Multiplication ($A \times B$).
- **Cardinality (Total States)**: If Type A has 2 possible states (e.g., bool) and Type B has 4 possible states, the product has $2 \times 4 = 8$ states.
- **Example**: A "Coordinate" is an Integer $X$ **AND** an Integer $Y$.

#### The Sum Type (`OR`)
A sum type represents a choice between multiple types. A value of a sum type holds a value of type A **OR** a value of type B.
- **Mathematical Analogy**: Addition ($A + B$).
- **Cardinality (Total States)**: If Type A has 2 states and Type B has 4 states, the sum has $2 + 4 = 6$ states.
- **Example**: A "Result" is either Success **OR** Failure. It cannot be both.

#### Why does this matter?
Most older languages (C, Java, Python) heavy rely on Product types (Classes, Structs) but struggle with Sum types (often using inheritance or null pointers to fake it). Rust treats both as first-class citizens, allowing you to model data precisely.

## 2. Structs (The Product Type)
In Rust, the Product type is realized primarily through **Structs**.

```rust
struct SensorReading {
    device_id: u8,    // 1 byte (256 states)
    value: u16,       // 2 bytes (65,536 states)
    is_active: bool   // 1 byte (2 states)
}
```

### Memory Layout & Performance
As a systems engineer, you control how bits are laid out in memory.
- **Sequential**: Fields are laid out roughly in order, but the compiler may reorder them to optimize packing (reduce gaps).
- **Alignment**: CPU reads are faster when data is aligned to its size (e.g., a 4-byte integer should start at an address divisible by 4). To achieve this, the compiler adds **Padding** (wasted bytes).

**Example Layout**:
If `SensorReading` kept the order `u8`, `u16`, `bool`:
- `device_id` at offset 0.
- `padding` at offset 1 (to align the next u16 to 2).
- `value` at offset 2.
- `is_active` at offset 4.
- `padding` at offset 5.
- Total Size: 6 bytes.

Rust automatically reorders to: `u16`, `u8`, `bool` (or similar) to remove padding, likely fitting it into 4 bytes.

**Performance**: Accessing struct fields is extremely fast (pointer arithmetic).

## 3. Enums (The Sum Type)
In Rust, the Sum type is the **Enum**. It is much more powerful than C-enums. A Rust enum can hold data.

```rust
enum NetworkEvent {
    Connected,                  // variant 1 (0 bytes data)
    Received(u8),               // variant 2 (1 byte data)
    Error(u32),                 // variant 3 (4 bytes data)
}
```

### Memory Layout (Tagged Union)
How does memory store "A OR B"? It needs to know *which* one is currently stored.
- **Tag (Discriminant)**: An integer (usually 1 byte) stored at the beginning to indicate the current variant.
- **Union**: A reserved space large enough to hold the *largest* variant.

**Layout of `NetworkEvent`**:
- **Tag**: 1 byte.
- **Payload**: 4 bytes (max size is `u32`).
- **Padding**: 3 bytes (to align the `u32`).
- **Total Size**: 1 + 3 (padding) + 4 = 8 bytes.

Every instance of `NetworkEvent` takes 8 bytes, regardless of whether it holds `Connected` (nothing) or `Error` (4 bytes).

## 4. The Option Enum
Safe nullability. Instead of a "null pointer" which crashes billion-dollar systems, Rust uses `Option<T>`.

It is literally defined as:
```rust
enum Option<T> {
    None,
    Some(T),
}
```

- **Usage**: Use it when a value might be missing.
- **Safety**: You *must* check if it is `Some` or `None` before using the data. You cannot accidentally dereference `None`.

**Example**:
```rust
fn find_user(id: i32) -> Option<String> {
    if id == 1 {
        Some("Alice".to_string())
    } else {
        None
    }
}

// Usage
let user = find_user(5);
match user {
    Some(name) => println!("Found: {}", name),
    None => println!("User not found"),
}
```

## 5. The Result Enum
Standardized Error Handling. Instead of throwing exceptions (which secretly break control flow), Rust returns a value indicating success or failure.

Defined as:
```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

- **Usage**: When an operation can fail (I/O, parsing, logic).
- **T**: The type of value if successful.
- **E**: The type of error if failed.

**Example**:
```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}

let outcome = divide(10, 2);
match outcome {
    Ok(val) => println!("Result is {}", val),
    Err(msg) => println!("Error: {}", msg),
}
```

## 6. Control Flow: `if let` and `let else`
`match` is great, but sometimes verbose if you only care about one case.

### `if let`
Use when you only care about one variant and ignore the rest.
```rust
let config = Some("dark_mode");

if let Some(theme) = config {
    println!("Loading theme: {}", theme);
}
// does nothing if None
```

### `let else` (Rust 1.65+)
Use when you want to handle the "bad" case immediately and return early. This reduces nesting.
```rust
fn process_input(input: Option<String>) {
    let Some(text) = input else {
        println!("No input provided!");
        return;
    };
    
    // 'text' is now available here directly
    println!("Processing: {}", text);
}
```

---

## Exercises

#### Exercise 1: The Shape
1. Define an enum `Shape` with variants:
   - `Circle` (radius: f64)
   - `Rectangle` (width: f64, height: f64)
   - `Square` (side: f64)
2. Implement a method `area(&self) -> f64`.
3. **Test**: Check area calculation for all 3 variants.

#### Exercise 2: Direction Navigation
1. Define `Direction` { North, South, East, West }.
2. Define a struct `Point` { x: i32, y: i32 }.
3. Implement `move_point(&mut self, dir: Direction)` on `Point`.
   - North increments Y, South decrements Y, East increments X, West decrements X.
4. **Test**: Start at (0,0), move North then East, assert position is (1,1).

#### Exercise 3: Media Player State
1. Define enum `MediaState`:
   - `Playing(String)`: holds track name.
   - `Paused(String)`: holds track name.
   - `Stopped`
2. Implement method `play(&self) -> String` that returns a message like "Playing [track]" or "Resuming [track]" or "Nothing to play".
3. **Test**: Create states and check messages.

#### Exercise 4: Log Levels
1. Define `LogLevel` { Info, Warning, Error }.
2. Define `LogMessage` struct { level: LogLevel, msg: String }.
3. Write a function `format_log(log: LogMessage) -> String` that formats it "[INFO] msg" etc.
4. **Test**: Verify string format.

#### Exercise 5: Web Event (Data variants)
1. Define `WebEvent`:
   - `PageLoad`
   - `KeyPress(char)`
   - `Click { x: i64, y: i64 }` (struct-like variant)
2. Implement `inspect(&self) -> String` returning a summary string.
3. **Test**: Ensure Click variant summary shows coordinates accurately.

#### Exercise 6: Safe Division
1. Write `fn safe_div(a: i32, b: i32) -> Option<i32>`.
2. Return `None` if `b` is 0.
3. **Test**: Test 10/2 = Some(5) and 10/0 = None.

#### Exercise 7: Username Extractor
1. Write `fn get_username(id: u32) -> Option<String>`.
2. Mock a database: if id is 1 return "Alice", 5 return "Bob", else None.
3. **Test**: Check valid and invalid IDs.

#### Exercise 8: File Parser (Result)
1. Write `fn parse_percentage(input: &str) -> Result<u8, String>`.
2. If input is not a number, return Err.
3. If number < 0 or > 100, return Err.
4. Else Ok(n). (Use `input.parse::<i32>()` then check range).
5. **Test**: "50" -> Ok(50), "150" -> Err, "abc" -> Err.

#### Exercise 9: Login Validator
1. Write `fn validate_login(username: &str, password: &str) -> Result<(), String>`.
2. Rules: Username valid if not empty. Password valid if len >= 8.
3. Return `Ok(())` on success.
4. **Test**: Check short password returns specific error.

#### Exercise 10: Array Element Fetcher
1. Write `fn get_element(arr: &[i32], index: usize) -> Option<i32>`.
2. Use `.get()` or check bounds manually.
3. **Test**: Fetch valid index and out-of-bounds index.

#### Exercise 11: Student Database (Vec + Struct)
1. Struct `Student` { name: String, grade: u8 }.
2. Function `add_student(db: &mut Vec<Student>, name: String, grade: u8)`.
3. Function `find_student(db: &Vec<Student>, name: &str) -> Option<u8>` (returns grade).
4. **Test**: Add two students, find one existing, search for one non-existing.

#### Exercise 12: In-Memory Key-Value Store (HashMap + Enum)
1. `Value` enum { Int(i32), Text(String) }.
2. `Store` struct holding a `HashMap<String, Value>`.
3. Impl methods `set(key, value)` and `get(key) -> Option<&Value>`.
4. **Test**: Store an Int, retrieve it, try to retrieve missing key.

#### Exercise 13: Shopping Cart (Vec + Enum + Option)
1. `Item` enum { Book(f64), TShirt(f64), Laptop(f64) }.
2. `get_price(&self) -> f64`.
3. `fn total_price(cart: &[Item]) -> f64`.
4. **Test**: Cart with 1 Book and 1 Laptop, check sum.

#### Exercise 14: Command Line Parser (Vec + Result)
1. `Command` enum { Help, Version, Echo(String) }.
2. `fn parse_args(args: Vec<String>) -> Result<Command, String>`.
   - "help" -> Help
   - "version" -> Version
   - "echo <msg>" -> Echo(msg)
   - Other -> Err("Unknown command")
3. **Test**: Parse vec!["echo", "hello"] -> Ok(Command::Echo("hello")).

#### Exercise 15: Task Manager (All concepts)
1. `TaskStatus` { Todo, InProgress, Done }.
2. `Task` struct { id: u32, title: String, status: TaskStatus }.
3. Use a `Vec<Task>` as the DB.
4. `fn complete_task(db: &mut Vec<Task>, id: u32) -> Option<&Task>`.
   - Find task by ID. If found, set status to Done and return Some(task). If not, None. (Hint: might need to split into finding index first to satisfy borrow checker, or return bool).
   - Simpler: Return `bool` (true if updated).
5. **Test**: Create 2 tasks, complete 1, verify status changed.
