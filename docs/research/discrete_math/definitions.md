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
    Remove all verbs that imply change, action or causation. If the sentence still holds the meaning - role. If not - behaviour.

!!! tip "Template for Writing Definitions"
    An object X is called `<the_term_being_defined>` provided it satisfies `<conditions>`.

No proofs. No descriptions. Pure definitions.

---

## Definition Exercises

### From Book

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

### General

11. Define a pen.
12. Define a pencil.
13. Define a eraser.
14. Define a book.
15. Define a copybook.
16. Define a bag.
17. Define a charger.
18. Define a lamp.
19. Define a carpet.
20. Define a money.
21. Define a debit card.
22. Define a flag.
23. Define a country.
24. Define a car.
25. Define a tree (natural).
26. 
27. 
28. 
29. 
30. 

### Computer Science

31. Define an IP address.
32. Define a port number.
33. Define a network packet.
34. Define a client (in a client–server model).
35. Define a server.
36. Define a TCP connection.
37. Define an HTTP request.
38. Define an HTTP response.
39. Define a URL path.
40. Define a header field (in HTTP).
41. Define a database table.
42. Define a row (tuple) in a database table.
43. Define a column (attribute) in a database table.
44. Define a record identifier.
45. Define a foreign key.
46. Define a query.
47. Define a result set.
48. Define an index (in databases).
49. Define a key–value pair.
50. Define a JSON object.
51. Define a state of a program.
52. Define a state transition.
53. Define a process (OS process).
54. Define a thread.
55. Define a file.
56. Define a directory.
57. Define a configuration parameter.
58. Define a log entry.
59. Define a timestamp.
60. Define a version number.

---

## Solutions

1. `A` is less than `B` iff there is some natural number `N` such that `A = B - N` or `B = A + N` where `N > 0`. `A` is less than or equal to `B` iff there is some non-negative integers `N` such that `A = B - N` where `N >= 0`.
2. A rational number is anything that `m/n` where `n != 0` and `m, n` are natural numbers.
3. An integer `X` is called a perfect square provided that there is some integer `Y` such that `X = Y * Y`.
4. Say `X` is a perfect square. Therefore, there is natural number `Y` which satisfies `X = Y * Y`. The `Y` is called square root of `X`.
5. Say we have a polygon with `n` with lengths `p_n`. The perimeter of the polygon is the sum of all sides of it: `S_p = p_1 + p_2 + ... + p_n`.
6. Suppose `A`, `B`, `C` are points in the plane. We say `C` is between `A` and `B` provided that `AC + CB = AB`. Even if `A` and `B` are the same point, then `C` must be the same point as well. 
7. Suppose we have a line segment `AB`. The midpoint `M` of a line segment is the one satisfying `AM + BM = AB` and `AM = BM`.
8. 
9. A string `S` is called palindrome iff the it is read the same in both directions. 
10. An integer `p` is called prime provided that `p > 1` and the only positive divisors of `p` are 1 and `p`.

11. 