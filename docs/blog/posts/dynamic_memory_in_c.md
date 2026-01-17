---
title: "Dinamik Xotira | Dynamic Memory Allocation"
description: "My old research on how dynamic memory works in C."
date: 2023-07-10
categories:
  - C language
tags:
  - C
---


Keling, avvalo Memory Allocation o'zi nima ekanligi haqida biroz so'z yuritsak.

<!-- more -->

**Memory allocation** deb dastur ishlashi uchun kompyuter tezkor xotirasi (RAM)dan talab etilgan miqdorda resurs/joy ajratish jarayoni tushuniladi. Xotira ajratishning 2 xil turi mavjud:

**1. Static Memory Allocation**
Mazkur jarayon dastur kompilyatsiya bo'layotgan paytda amalga oshadi (Compile-time allocation). Sababi bunda Stack xotiradan joy ajratiladi.

**2. Dynamic Memory Allocation**
Bu jarayon esa dastur ishlashni boshlagan paytda amalga oshadi (Run-time allocation). Sababi bunda Heap xotiradan joy ajratiladi. (Stack va Heap haqida keyingi maqolalarda batafsil so'z yuritamiz)

![Stack and Heap memory](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lo3aq1om0fh3jqqt0r0b.png)

C dasturlash tilida Dinamik xotiradan joy ajratish uchun `<stdlib.h>` kutubxonasining 4 ta funksiyasidan foydalaniladi.

## - malloc()
`malloc()` yoxud "memory allocation" funksiyasi belgilangan data type va o'lcham bo'yicha dinamik xotiradan joy ajratadi. Quyida bir misol ko'ramiz:

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    
    int* ptr;
    ptr = (int*) malloc(n * sizeof(int));

    if (ptr == NULL) {
        printf("Xotirada joy ajratilmadi.\n");
        exit(0);
    }

    // Pointerni dinamik array sifatida ishlatish
    for (int j = 0; j < n; ++j) {
        ptr[j] = j + 1;
    }

    return 0;
}
```
Dasturning maqsadi `n` ta integer uchun dinamik xotiradan joy ajratish. Lekin bu yerda `sizeof()` nega kerak? Sababi har bir ma'lumot turi xotirada turlicha joy egallaydi va biz shulardan `n` tasiga joy ochish uchun uning o'lchamini aniqlashimiz shart: `n * sizeof(<data_type>)`

![Memory allocation for fundamental data types](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1dbr1z7hv4ko2qz8eqjm.jpg)
Yaxshi, o'lchamni aniqladik, `malloc()` bizga joy ajratdi. Lekin `(int*)` yana nimasi?! 
**Void pointer** - hech qayerga point qilmaydigan pointer. Ya'ni hech bir data turidagi o'zgaruvchining addressini qaytarmaydi. `malloc()` xotiradan joy ajratgach, shu joydagi 1-baytga nisbatan aynan <u>void pointer</u> qaytaradi. Chunki dastur bu joyga biz qaysi turdagi o'zgaruvchini saqlamoqchi ekanimizni bilmaydi. Natijada bu vazifani qo'lda bajarishimiz kerak bo'ladi va buni biz _type-casting_ yoxud `(<data_type>*)` yordamida bajaramiz.
Finally, ajratilgan joyning 1-baytiga nisbatan integer pointerni `ptr` o'zgaruvchisiga assign qilamiz. Endi aynan shu o'zgaruvchi yordamida bu dinamik xotiraga access qilish mumkin bo'ladi. Dasturning oxirida esa tekshirib ko'ryapmiz: agar `malloc()` o'zidan `NULL` qaytarsa yoxud xotiradan joy ajratmasa dasturni o'chirib foydalanuvchini ogohlantirsin.

✅ Bonus sifatida Dinamik array tushunchasiga ham to'xtalamiz. Eng qiziq joyi nima bilasizmi? Hozir ko'rgan pointerimiz bir vaqtda array vazifasini bajaradi😄. Yuqoridagi kodning so'ngi blokida ko'rish mumkinki, biz pointerga array kabi access qilyapmiz, chunki `ptr[j] = *(ptr+j)` o'rinli.

## - calloc()
`calloc()` yoxud "contiguous allocation" deyarli `malloc()` bilan bir xil, shu 2 ta nuqtadan tashqari:
- u har bir ajratilgan xotira blokining qiymatini 0 ga tenglashtirib chiqadi;
- `malloc()` dan farqli ravishda 2 ta argument qabul qiladi.

![malloc() and calloc()](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yl81c9gfd10g73gtxsm2.png)
Quyida bir misol ko'ramiz:

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    
    int* ptr;
    ptr = (int*) calloc(n, sizeof(int));

    if (ptr == NULL) {
        printf("Xotirada joy ajratilmadi.\n");
        exit(0);
    }
    
    return 0;
}
```
Haqiqatan ham e'tibor bersak, bu funksiyada `n` va `sizeof(int)` vergul bilan ajratiladi, ya'ni alohida 2 ta argument sifatida.

## - free()
`free()` funksiyasi dinamik xotiradan ajratilgan joyni bo'shatish uchun ishlatiladi. Yuqoridagi 2 funksiya ham o'zi band qilgan joyni avtomatik tarzda bo'shatmagani tufayli bu funksiyaga ehtiyoj sezamiz. Ayniqsa, cheklangan xotira bilan ishlashda bu funksiya juda qo'l keladi.

```c
#include <stdio.h>
#include <stdlib.h>
 
int main()
{
    int n;
    int *ptr1, *ptr2;

    ptr1 = (int*) malloc(n * sizeof(int));
    ptr2 = (int*) calloc(n, sizeof(int));

    if (ptr1 == NULL || ptr2 == NULL) {
        printf("Xotirada joy ajratilmadi.\n");
        exit(0);
    }

    free(ptr1);
    free(ptr2);

    return 0;
}
```
Ko'rinib turibdiki, `free()` yagona argument - ajratilgan xotiraga nisbatan pointer qabul qiladi va o'sha xotirani bo'shatadi.

## - realloc()
`realloc()` yoxud "re-allocation" funksiyasi oldin `malloc()` yoki `calloc()` yordamida ajratilgan xotiraning taqsimotini dinamik ravishda o'zgartirish uchun ishlatiladi. Masalan oldin 4 ta integer uchun joy ajratilgan edi, endi esa 6 ta uchun ajratishimiz kerak. Quyida mazkur misolni ko'ramiz:

```c
#include <stdio.h>
#include <stdlib.h>
 
int main()
{
    int n;
    int *ptr1, *ptr2;

    n = 4;
    ptr = (int*) malloc(n * sizeof(int));

    if (ptr == NULL) {
        printf("Xotirada joy ajratilmadi.\n");
        exit(0);
    }

    n = 6;
    ptr = realloc(ptr, n * sizeof(int));

    if (ptr == NULL) {
        printf("Xotirada joy ajratilmadi.\n");
        exit(0);
    }

    free(ptr);

    return 0;
}
```
`realloc()` ishlash jarayonida avvalgi 4 ta integer uchun ajratilgan joyni saqlab qoladi va unga yana 2 ta qo'shib, 6 ta integerlik joy hosil qiladi. Agar xotirada buning uchun joy yetarli bo'lmasa, funksiya `NULL` qaytaradi. Shu sabab bu funksiyani ham xatolikka tekshirish maqsadga muvofiqdir.

## **Qo'shimcha: Dynamic Strings!**
Odatda string ham static holatda bo'ladi, ammo biz uni `malloc()` funksiyasi yordamida boshqarishimiz mumkin. Bu ham xuddi yuqorida ko'rgan dinamik array bilan bir xil, sababi string aslida "charlar arrayi" hisoblanadi. 
Shuningdek, stringni copy qilish uchun biz `strcpy()` ni ishlatar edik. Dinamik string uchun esa `strdup()` ishlatiladi:
```c
#include <string.h>

...

char *name;

char input[30];
scanf("%s", input);

name = strdup(input);
```
Sababi bu funksiya avtomatik tarzda `malloc()` ham qiladi hamda o'lcham berilmagan dinamik string uchun kerakli joyni ochadi.

---

🏁 _Dinamik xotira mavzusi C dasturlash tilining eng muhim qismlaridan biri hisoblanadi. Mazkur bilimni yaxshi bilish uning ustiga Data Strukturalar ilmini erkin qurish imkonini beradi.
📌 Maqolani foydali deb topgan bo'lsangiz uni share qilishingiz mumkin. E'tiboringiz uchun rahmat!_