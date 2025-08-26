---
title: "Preprocessors and Macros in C"
description: "I wanted to learn compile time features of the C language..."
date: 2023-10-01
categories:
  - System Programming
tags:
  - c
  - fundamentals
---



Today, I am going to consider one of the most essential but least common topics in C/C++ world - Preprocessors and Macros.

<!-- more -->

Preprocessors are programs that process the source code <u>before compilation</u>. There are a number of steps between writing and executing a program in C. Let us have a look at these steps before we actually start familiarizing:

![How C program works](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mc3v06ppcnwketyndjr8.png)

1. Source code written by programmers is stored in a file `program.c`. 
2. It is then processed by preprocessors and an expanded source code file is generated `program.i`.
3. Expanded file is compiled by the compiler and an object code file is generated `program.obj`.
4. The linker links this object code file to the object code of the library functions to generate the executable file `program.exe`. 

## Preprocessor Directives
Preprocessor programs provide preprocessor directives that tell the compiler to preprocess the source code before compiling. All of these preprocessor directives begin with a `#` (hash) symbol.

> ❗️ Remember that the `#` symbol only provides a path to the preprocessor, and a command such as `include` is processed by the preprocessor program. For example, `#include` will include the code or content of the specified file in your program.

The following table lists all directives:

![Preprocessor Directives](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3986taybg612wy6oqoyi.png)

There are 3 Main Types of Preprocessor Directives:  
- Macros
- File Inclusion
- Conditional Compilation

Let's now consider each of these directives in detail with many subtleties. 

## 1. Macros

A **macro** is a piece of code in a program that is replaced by the value of the macro. Macro is defined by #define directive. Whenever a macro name is encountered by the compiler, it replaces the name with the definition of the macro. We use it always, you know, when we declare static arrays like below:

```c
#include <stdio.h>
#define MAX 100    // Macro

int main()
{
    int array[MAX];  // Declaring array
    printf("The value of MAX" is "%d", MAX);
    return 0;
}
```
However, there are many other types of macros that probably you have not used yet.

**1.1. Object-like Macros**
An **object-like macro** is a simple identifier that will be replaced by a code fragment. It is called object-like because it looks like an object in code that uses it. It is popularly used to replace a symbolic name with numerical/variable represented as **constant**. Just now we illustrated the example above.

**1.2. Chain Macros**
Macros inside macros are termed as **chain macros**. In chain macros first of all parent macro is expanded then the child macro is expanded. Below is the illustration of a Chain Macro:
```c
#include <stdio.h>
#define INSTAGRAM FOLLOWERS
#define FOLLOWERS 500

int main()
{
	printf("Cristiano Ronaldo has "%dM" followers on Instagram", INSTAGRAM);
	return 0;
}

// Output: Cristiano Ronaldo has 500M followers on Instagram
```

**1.3. Multi-line Macros**
An object-like macro could have a multi-line. So to create a multi-line macro you have to use backslash-newline. Below is the illustration of multiline macros:
```c
#include <stdio.h>
#define ELE 1, \
            2, \
            3

int main()
{
	int arr[] = { ELE };
	printf("Elements of Array are:\n");
	for (int i = 0; i < 3; i++) {
		printf("%d ", arr[i]);
	}
	return 0;
}

// Output: Elements of Array are: 1  2  3 
```

**1.4. Function-like Macros**
These macros are the same as a function call. It replaces the entire code instead of a function name. **Pair of parentheses immediately after the macro name is necessary.** If we put a space between the macro name and the parentheses in the macro definition, then the macro <u>will not work</u>. A function-like macro is only lengthened if and only if its name appears with a pair of parentheses after it. If we don’t do this, the function pointer will get the address of the real function and lead to a **_syntax error_**.
Below is the illustration of function-like macros:
```c
#include <stdio.h>
#define min(a, b) (((a) < (b)) ? (a) : (b))

int main()
{
	int a = 18;
	int b = 76;
	printf("Minimum value between %d and %d is %d\n", a, b, min(a, b));

	return 0;
}

// Output: Minimum value between 18 and 76 is 18
```

## 2. File Inclusion

This type of preprocessor directive tells the compiler to include a file in the source code program. The `#include` preprocessor directive is used to include the header files in the C/C++ program. There are 2 types of files that can be included by developer:

**1. Standard Header Files**
The standard header files contain definitions of pre-defined functions like `printf()`, `scanf()`, etc. These files must be included to work with these functions. 
```c
#include <file_name>

// < and > brackets tell the compiler to look for standard directory
```

**2. User-defined Header Files**
When a program becomes very large, it is a good practice to divide it into smaller files and include them whenever needed. These types of files are user-defined header files. These files can be included as:
```c
#include "file_name"

// The double quotes ( ” ” ) tell the compiler to search for the header file in the source file’s directory.
```

## 3. Conditional Compilation

It is a type of directive that helps to compile a specific portion of the program or to skip the compilation of some specific part of the program <u>based on some conditions</u>. There are the following preprocessor directives that are used to insert conditional code:
- `#if` Directive
- `#ifdef` Directive
- `#ifndef` Directive
- `#else` Directive
- `#elif` Directive
- `#endif` Directive

Syntax:
```c
#ifdef macro_name
    statement1;
    statement2;
    statement3;
    .
    .
    .
    statementN;
#endif
```
If the macro with the name `macro_name` is defined, then the block of statements will execute normally, but if it is not defined, the compiler will simply skip this block of statements.

Actually, there is 2 more derivatives are available, but as they are not commonly used and `#pragma` is not even supported by GCC compilers, I think there is no point to show them.

---

## 📌 Interesting Facts

That's all about Preprocessors and Macros. Now, let's have fun by learning some gripping facts about them.

1️⃣ Macros can take function like arguments, the arguments are <u>not checked for data type</u>. For example, the following macro `INCREMENT(x)` can be used for `x` of any data type:
```c
#include <stdio.h>
#define INCREMENT(x) ++x
int main()
{
	char* ptr = "Embedded";
	int x = 10;
	printf("%s ", INCREMENT(ptr)); // pointer to string is moved by 1 character
	printf("%d", INCREMENT(x));
	return 0;
}

// Output: mbedded  11
```

2️⃣ The macro arguments are <u>not evaluated</u> before macro expansion. For example, consider the following program:
```c
#include <stdio.h>
#define MULTIPLY(a, b) a* b

int main()
{
	// The macro is expanded as 2 + 3 * 3 + 5, not as 5*8
	printf("%d", MULTIPLY(2 + 3, 3 + 5));
	return 0;
}

// Output: 16
```
This problem can be solved as shown below:
```c
#include <stdio.h>
#define MULTIPLY(a, b) (a) * (b)

int main()
{
	// The macro is expanded as (2 + 3) * (3 + 5), as 5*8
	printf("%d", MULTIPLY(2 + 3, 3 + 5));
	return 0;
}

// Output: 40
```

3️⃣ The tokens passed to macros can be concatenated using operator `##` called Token-Pasting operator:
```c
#include <stdio.h>
#define merge(a, b) a##b
int main()
{
	printf("%d ", merge(12, 34));
}

// Output: 1234
```

4️⃣ A token passed to macro can be converted to a string literal by using `#` before it:
```c
#include <stdio.h>
#define get(a) #a

int main()
{
	// Memati is changed to "Memati"
	printf("%s", get(Memati)); // Note: Memati is not a string here!
}

Output: Memati
```

5️⃣ The macros with arguments should be avoided as they cause problems sometimes. And Inline functions should be preferred as there is type checking parameter evaluation in inline functions. From C99 onward, inline functions are supported by C language also. 

For example consider the following program. From first look the output seems to be 1, but it produces 36 as output.
```c
#include <stdio.h>

#define square(x) x* x
int main()
{
	// Expanded as 36/6*6
	int x = 36 / square(6);
	printf("%d", x);
	return 0;
}

// Output: 36
```
But we can write this code as follows to get the expected result:
```c
#include <stdio.h>

#define square(x) (x * x)
int main()
{
	// Expanded as 36/(6*6)
	int x = 36 / square(6);
	printf("%d", x);
	return 0;
}

// Output: 1
```

6️⃣ There are some standard macros which can be used to print program file `__FILE__`, Date of compilation `__DATE__`, Time of compilation `__TIME__` and Line Number in C code `__LINE__`. Below is an example:
```c
#include <stdio.h>

int main()
{
	printf("Current File :%s\n", __FILE__);
	printf("Current Date :%s\n", __DATE__);
	printf("Current Time :%s\n", __TIME__);
	printf("Line Number :%d\n", __LINE__);
	return 0;
}

// Output: Current File :/usr/share/IDE_PROGRAMS/C/other/081c548d50135ed88cfa0296159b05ca/081c548d50135ed88cfa0296159b05ca.c
Current Date :Sep  4 2019
Current Time :10:17:43
Line Number :8
```

---

Today, we completed discussing about Preprocessors and Macros in C. It turns out that although pieces of code with #s and <>s seems "negligible", they play really fundamental role in any C program. 


The only one very vital topic is lasting: Bit Manipulation! 
**🏁 That's it for now. Thank you!**