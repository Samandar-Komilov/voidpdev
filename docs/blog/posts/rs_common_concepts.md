---
title: "Introduction to Rust: Common Concepts"
description: "Rust's common features which can be found in any other language."
date: 2026-01-16
categories:
  - Rust
tags:
    - rust
---

Rust's common features which can be found in any other language.

<!-- more -->

- [The Rust Programming Book](https://doc.rust-lang.org/book/ch01-02-hello-world.html)
- [A Tour of Rust](https://tourofrust.com/)

### Variables  
Variables are immutable by default. But we can mark them as mutable using `mut` keyword. There is a support for constants as well, using `const` keyword:

```rust
const MAX_POINTS: u32 = 100_000;

fn main() {
    let x = 5;
    let mut y = 6;
    y = 7;

    println!("{} {} {}", x, y, MAX_POINTS);
}
```

`let` keyword can be used only inside of some scope, not global. But `const` can be defined in global scope. It behaves similar to `#define` in C/C++. We can compute restricted amount of operations as well, like `const MAX_POINTS 10+10`.

**Type Conversions.** Rust requires explicitness when it comes to numeric types. One cannot use a `u8` for a `u32` casually without error. Luckily Rust makes numeric type conversions very easy with the `as` keyword:
```rust
fn main() {
    let a = 13u8;
    let b = 7u32;
    let c = a as u32 + b;
    println!("{}", c);

    let t = true;
    println!("{}", t as u8);
}

// Output:
// 20
// 1
```

### Shadowing   
Redeclaring a variable with the same name causes to shadowing:
```rust
fn main() {
    let x = 5;
    let x = x + 1; // shadowing

    {
        let x = x * 2; // shadowing
        println!("The value of x in the inner scope is: {x}");
    }

    println!("The value of x is: {x}");
}
```


### Data Types
I'll give all of the standard data types in Rust in one place:
```rust
fn main(){
    // Scalar types
    let a: u32 = 100;
    let b: i32 = -100;
    let c: f32 = 3.14;
    let d: bool = true;
    let e: char = '🔥';

    println!("{a} {b} {c} {d} {e}");

    // Compound types
    let tup: (i32, f64, u8) = (500, 6.4, 1);
    let (f, g, h) = tup;
    let arr1: [u8; 5] = [1,2,3,4,5];
    let arr2 = ["Hello", "Hi"];
    let arr3 = [0; 2]; // = [0, 0];

    println!("{f} {g} {h}");
    println!("{arr1:?} {arr2:?} {arr3:?}");
}

/* Output:
100 -100 3.14 true 🔥
500 6.4 1
[1, 2, 3, 4, 5] ["Hello", "Hi"] [0, 0]
*/
```

### Arrays
An array is a fixed length collection of data elements all of the same type.

>The **data type for an array** is `[T;N]` where `T` is the elements' type, and `N` is the fixed length known at compile-time.

Individual elements can be retrieved with the `[x]` operator where `x` is a `usize` index (starting at 0) of the element you want.



### Functions
A function has zero or more parameters. In this example, the add function takes two arguments of type `i32` (signed integer of 32-bit length):
```rust
fn add(x: i32, y: i32) -> i32 {
    return x + y;
}

fn subtract(x: i32, y: i32) -> i32 {
    x - y
}

fn main() {
    println!("42 + 13 = {}", add(42, 13));
    println!("42 - 13 = {}", subtract(42, 13));
}
```

If you just want to return an expression, you can drop the `return` keyword and the semicolon at the end, as we did in the subtract function. Function names are always in `snake_case`.

### Multiple Return Values
Functions can return tuples, as we do in Python, to return multiple values. Because Rust supports tuple destructuring (or unpacking in Python), we can easily benefit from that:
```rust
fn swap(x: i32, y: i32) -> (i32, i32) {
    return (y, x);
}

fn main() {
    let result = swap(123, 321);
    println!("{} {}", result.0, result.1);

    let (a, b) = swap(result.0, result.1);
    println!("{} {}", a, b);
}
```

### Returning Nothing
In Python, if we don't specify a function returns None. In C, it returns void. It's a bit different story in Rust - unit. Or alternatively, empty tuple:
```rust
fn make_nothing() -> () {
    return ();
}

fn make_nothing2() {
    // return () implicitly
}

fn main() {
    let a = make_nothing();
    let b = make_nothing2();

    // Debug string for a and b (__repr__() in Python)
    println!("The value of a: {:?}", a);
    println!("The value of b: {:?}", b);
}
```


### Control Flow
We already know `if-else`, so we skip it. There is no difference from C, only omitting braces. But...

### Match (Switch)
Matching combined with destructuring is by far one of the most common patterns you will see in all of Rust. `match` is exhaustive so all cases must be handled:
```rust
fn main() {
    let x = 42;

    match x {
        0 => {
            println!("found zero");
        }
        // multiple values
        1 | 2 => {
            println!("found 1 or 2!");
        }
        // ranges
        3..=9 => {
            println!("found a number 3 to 9 inclusively");
        }
        // bind the matched number to a variable
        matched_num @ 10..=100 => {
            println!("found {} number between 10 to 100!", matched_num);
        }
        // default match that must exist if not all cases are handled
        _ => {
            println!("found something else!");
        }
    }
}
```

`if`, `match`, functions, and scope blocks all have a unique way of returning values in Rust. If the last statement in an `if`, `match`, function, or scope block is an expression without a `;`, Rust will return it as a value from the block. This is a great way to create concise logic that returns a value that can be put into a new variable:
```rust
fn example() -> i32 {
    let x = 42;
    // Rust's ternary expression
    let v = if x < 42 { -1 } else { 1 };
    println!("from if: {}", v);

    let food = "hamburger";
    let result = match food {
        "hotdog" => "is hotdog",
        // notice the braces are optional when its just a single return expression
        _ => "is not hotdog",
    };
    println!("identifying food: {}", result);

    let v = {
        // This scope block lets us get a result without polluting function scope
        let a = 1;
        let b = 2;
        a + b
    };
    println!("from block: {}", v);

    // The idiomatic way to return a value in rust from a function at the end
    v + 4
}

fn main() {
    println!("from function: {}", example());
}
```
Notice that it also allows an if statement to operate like a concise ternary expression.

### Loops
Need an infinite loop? Rust makes it easy. `break` will escape a loop when you are ready:
```rust
fn main() {
    let mut x = 0;
    loop {
        x += 1;
        if x == 42 {
            break;
        }
    }
    println!("{}", x);
}
```

The `loop` can break to return a value, that is, it can break and return the value at once:
```rust
fn main() {
    let mut x = 0;
    let v = loop {
        x += 1;
        if x == 13 {
            break "found the 13";
        }
    };
    println!("from loop: {}", v);
}
```

The `while` lets you easily add a condition to a loop:
```rust
fn main() {
    let mut x = 0;
    while x != 42 {
        x += 1;
    }
    println!("x is {}", x);
}
```

Rust's `for` loop is a powerful upgrade. It iterates over values from any expression that evaluates into an **iterator**. What's an iterator? An iterator is an object that you can ask the question "What's the next item you have?" until there are no more items. It allows to take elements of the object one by one.

!!! note
    Recall that, in Python we also had iterators. An object was classified as an **iterator** if it has `__iter__()` and `__next__()` methods defined. 

- The `..` operator creates an iterator that generates numbers from a start number up to but not including an end number. The same as `range()` in Python.

- The `..=` operator creates an iterator that generates numbers from a start number up to and including an end number. Well, `range(x, y)` plus `y` number itself in Python.

```rust
fn main() {
    for x in 0..5 {
        println!("{}", x);
    }

    for x in 0..=5 {
        println!("{}", x);
    }
}
```

As we can see, loops are very similar to other languages', especially for loop is almost the same as Python's `for`. This will benefit us certainly.

---

## Exercises

We learned about variables, scalar and compound data types, functions, comments, if/match expressions, and loops! To practice with the concepts discussed in this chapter, we'll try building programs given below:

1. **Configuration Snapshot**
    * Declare immutable variables for app name and version.
    * Declare mutable variables for runtime state (requests processed, error count).
    * Use `const` for hard limits (max requests, timeout seconds).
    * Shadow a variable to convert user input from `&str` → `i32`.
    * Print a final summary.

2. **Unit Converter**
    * Read a numeric value and a unit selector (`1 = Celsius`, `2 = Fahrenheit`).
    * Use scalar types (`f64`, `u8`).
    * Implement conversion functions.
    * Use `if` and `match` appropriately.
    * Return converted value from function.

3. **Statistics on Fixed Dataset**
    * Given a fixed array of integers.
    * Compute min, max, sum, average.
    * Use a tuple return `(min, max, avg)`.
    * Iterate using `for`.
    * No heap allocation.

4. **Password Strength Checker**
    * Input: fixed string.
    * Count digits, lowercase, uppercase using loop.
    * Use `match` on characters.
    * Return nothing (`()`) but print strength level.
    * Demonstrates mutable counters and control flow.

5. **Simple Menu System**
    * Infinite `loop` showing menu options.
    * `match` on user choice.
    * Use `break` and `continue`.
    * Some options call functions returning values, others return nothing.

6. **Time-Based Greeting**
    * Input hour (`u8`).
    * Use `if / else if / else` for ranges.
    * Shadow input string → parsed integer.
    * Return greeting string from function.

7. **Range Analyzer**
    * Given two integers.
    * Use `while` loop to iterate from start to end.
    * Count evens and odds.
    * Return results as a tuple.
    * Demonstrates mutable variables and conditions.

8. **Command Code Interpreter**
    * Given an array of numeric codes.
    * Use `match` to map codes to actions.
    * Unknown codes handled via `_`.
    * Loop through all commands.
    * No return value; side-effect only.

9. **Matrix Basics**
    * Fixed-size 2D array (e.g. `[[i32; 3]; 3]`).
    * Sum rows and columns.
    * Use nested `for` loops.
    * Return total sum.
    * Reinforces compound data types.

10. **Retry Simulation**
    * Simulate an operation that fails N times.
    * Use mutable retry counter.
    * `while` loop with exit condition.
    * `match` on attempt number to change behavior.
    * Print final status.
