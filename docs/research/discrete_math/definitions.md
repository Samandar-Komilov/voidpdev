# Definition

Precision is the most important thing in Mathematics. If you have an idea, it takes some time to convert it to a clear and precise sentence, and it is very vital to learn this skill. 

Take the time to express your ideas clearly both verbally and in writing. To learn mathematics requires you to engage all routes into your brain: your hands, eyes, mouth, and ears all need to get in on the act. Say the ideas out loud and write them down. You will learn to express yourself more clearly and you will learn the concepts better.

Let's first clarify what a **definition** actually is. 

!!! note "What is the definition?"
    A definition is to say about something clearly. Here are the exact points that answer what is a definition and what is not:
    
    * Definition is a form, an identity, a role in a system. It is **not** a behaviour. 
    * Definition describes structure, never consequences.
    * Definition cannot be `True` or `False`. They can only be accepted or rejected as conventions.
    * Definition answers "what is this thing?", theorem answers "what happens when this thing is used?"
    * Definition is like a `struct`, Behaviour is like a `function`. Theorem is a statement about behaviour.
    * Definition must capture the **essence** (mohiyat), not the **accident** (hodisa). Hodisaviy struktura identityni bermaydi. 
    
    We must specify the conditions that when exactly the definition makes sense. For example:
    > Let `a` and `b` are integers. We say that `a` is divisible by `b` provided there is an integer `c` such that `bc=a`.

There are 3 types of definitions:

1. **Structural Definition.** This works when the object is defined by its form: `an IP address is 32-bit binary string.`
2. **Role Definition.** This works when the object is identified by its role in a system, not by shape: ``a client is the initiator of a communication session; a charger is an energy-source endpoint in an energy-transfer system.``
3. **Abstract Property Definition.** This works when an object is defined by the property (under condition) that makes it that thing, not by its materials: `A graph is a pair (V, E) where [some_condition].`

!!! danger "Definition vs Behaviour. How to identify?"
    You might ask this question to differentiate definition and behaviour clearly:

    > Can I identify this object without seeing it act? Yes - definition. No - behaviour.

Now, role definition seems tricky, because it feels like simply making the behaviour a noun. But role is not a behaviour:

- Role is a **position in a structure**. 
- Behaviour is **activity over time**.

So, you must remove time to clearly see if its a behaviour or role. Because behaviour is time-dependent.

!!! example "Strict Test"
    At this point, you might have a question: **how do I know if I should define the object by its form or its role in a system?**

    You must ask the following questions to identify:  
    1. **Is this object fundamentally identified by its internal structure?** E.g. binary string, tuple, graph, HTTP request. These make sense by their form, shape and components.

    2. **Is this object fundamentally identified by its position in a system?** E.g. client, server, money, charger. These make sense inside a system.

    If neither (1) nor (2) works, you picked an object that cannot be defined with this framework. You might skip it.

!!! question "How to Identify the System?"
    Role definition requires us to define the object by its system. But how do I know what system it participates? Use the following 3-step method:

    1. **This thing participates in what?**  
        - pen -> writing system
        - lamp -> illumination system
        - charger -> energy-transfer system
        - money -> exchange system
    2. **Identify the abstract system, not the real-world usage.**  
        - ❌ A pen is used to write on paper.
        - ✅ A pen is an instrument in a writing system.
        - ❌ Money is used to buy goods.
        - ✅ Money is the unit of account in an exchange system.
    3. **Identify the object's role in the system.**   
        - pen = ink-depositor
        - pencil = graphite-depositor
        - eraser = mark-remover
        - bag = portable container
    
    Here is a simple decision tree:
    ```txt
    Does identity come from internal structure?
        → Yes: FORM definition.
        → No:
    Does identity come from position in a larger system?
        → Yes: ROLE definition.
        → No: Object not definable in this framework.
    ```


!!! tip "Template for Writing Definitions"
    An object X is called `<the_term_being_defined>` provided it satisfies `<conditions>`.

Definitions are not descriptions. Definitions are not theorems. They are words used to purely identify an object by its identity, not behaviour.

---

## Definition Exercises

1. Define the following relations about integers using natural number's definition:
    - less than (<)
    - less than or equal to (<=)
    - greater than (>)
    - greater than or equal to (>=)
2. Define a rational number.
3. Define what it means for an integer to be a perfect square.
4. Define what it means for one number to be the square root of another number.
5. Define the perimeter of a polygon.
6. Write a careful definition for one point to be between two other points.
7. Define the midpoint of a line segment.
8. Try writing definitions for these words:
    - teenager
    - grandmother
    - leap year
    - homophone
9. Define a palindrome string.
10. Define a prime number.
11. Define a pen.
12. Define a pencil.
13. Define a eraser.
14. Define a book.
15. Define a copybook.
16. Define a bag.
17. Define a charger.
18. Define a lamp.
19. Define a money.
20. Define a flag.
21. Define an IP address.
22. Define a port number.
23. Define a network packet.
24. Define a client (in a client–server model).
25. Define a server.
26. Define a TCP connection.
27. Define an HTTP request.
28. Define an HTTP response.
29. Define a URL path.
30. Define a header field (in HTTP).
31. Define a database table.
32. Define a row (tuple) in a database table.
33. Define a column (attribute) in a database table.
34. Define a record identifier.
35. Define a foreign key.
36. Define a query.
37. Define a result set.
38. Define an index (in databases).
39. Define a key–value pair.
40. Define a JSON object.
41. Define a state of a program.
42. Define a state transition.
43. Define a process (OS process).
44. Define a thread.
45. Define a file.
46. Define a directory.
47. Define a configuration parameter.
48. Define a log entry.
49. Define a timestamp.
50. Define a version number.

---

## Solutions

1. `A` is less than `B` iff there is some natural number `N` such that `A = B - N` or `B = A + N` where `N > 0`. `A` is less than or equal to `B` iff there is some non-negative integers `N` such that `A = B - N` where `N >= 0`.
2. A rational number is anything that `m/n` where `n != 0` and `m, n` are natural numbers.
3. An integer `X` is called a perfect square provided that there is some integer `Y` such that `X = Y * Y`.
4. Say `X` is a perfect square. Therefore, there is natural number `Y` which satisfies `X = Y * Y`. The `Y` is called square root of `X`.
5. Say we have a polygon with `n` with lengths `p_n`. The perimeter of the polygon is the sum of all sides of it: `S_p = p_1 + p_2 + ... + p_n`.
6. Suppose `A`, `B`, `C` are points in the plane. We say `C` is between `A` and `B` provided that `AC + CB = AB`. Even if `A` and `B` are the same point, then `C` must be the same point as well. 
7. Suppose we have a line segment `AB`. The midpoint `M` of a line segment is the one satisfying `AM + BM = AB` and `AM = BM`.
8. A person `T` is called teenager iff their age `A` satisfies condition `13 <= A <= 19`.
9. A string `S` is called palindrome iff the it is read the same in both directions. 
10. An integer `p` is called prime provided that `p > 1` and the only positive divisors of `p` are 1 and `p`.

11. A pen is an ink-depositor instrument in a writing system.
12. A pencil is a graphite-depositor instrument in a writing system.
13. An eraser is a mark-remover instrument in a writing system.
14. A book is a finite sequence of pages bound into a single physical unit.
15. A copybook is a finite sequence of blank pages bound into a single physical unit.
16. A bag is a designated portable container in a container system.
17. A charger is a device designated as the energy-source endpoint in an energy-transfer system.
18. A lamp is the designated light-emission component of an illumination system.
19. Money is the designated unit of account in an exchange system.
20. A flag is a designated identity marker within a sign system.