---
title: "C dasturlash tilida struct, union va enum"
description: "Struct, Union va Enum konstruksiyalari haqida qilingan eski research"
date: 2023-07-14
categories:
  - C language
tags:
  - fundamentals
---


Bugun C dasturlash tilining muhim qismlaridan bo'lgan Strukturalar, Birlashmalar va Enumlar haqida gaplashamiz.

<!-- more -->

## **👉 Struct**
Struct bu user-defined data turi bo'lib, bir necha turdagi ma'lumotlarni bir turga jamlash uchun ishlatilishi mumkin. Struct xuddi Object oriented tillardagi Classlarga o'xshab ketadi, biroq ba'zi farqlari mavjud. Struct dasturda ishlatilishidan oldin e'lon qilinishi shart. Odatda `main()` dan ham tashqarida e'lon qilish maslahat beriladi:

```c
// Maqolada Student misolida beriladi.
struct Student {
    char name[100];
    int  matricula;
    ...
};
```
Mazkur blok **struktura prototipi** deb ataladi va biz unga <u>instance</u> hosil qilmagunimizcha xotiradan joy olmaydi. 
Buni biz shu struktura tipidagi o'zgaruvchi e'lon qilish orqali amalga oshirishimiz mumkin:

```c
struct Student {
    char name[100];
    int matricula;
    ...
} student1, student2;

struct Student student3, student4;
// 2 xil usulda struktura o'zgaruvchilari hosil qilindi.
```
Struktura memberlariga **dot operator (.)** orqali access qilinadi:

```c
student1.matricula;
student3.name;
```
❗️ Struktura memberlariga declaration paytida qiymat berish mumkin emas:

```c
struct Student {
   char name[100] = "Abdulxay"; 
   int matricula = 28;
   // Compile error!
};
```
Sababi yuqorida aytganimizdek, struct e'lon qilinganda xotiradan joy olmaydi toki shu turdagi o'zgaruvchi e'lon qilinmaguncha. O'zgaruvchi memberlarini initialize qilishning 3 xil usuli mavjud:
```c
// 1-usul

// String holatida strcpy ishlatilishi shart!
strcpy(student1.name, "Hikmet");
student1.matricula = 26;

// 2-usul
struct Student student2 = {"Erhan",27};

// 3-usul
struct Student student3 = {.name = "Zaza", .matricula = 22};
```

**- typedef**
⌛️ Ba'zida struktura nomi uzun bo'lib ketadi va bu vaqtni bekorga sarf qilishi mumkin. Shu holatda `typedef` keywordini ishlatish maqsadga muvofiq:

```c
typedef struct Student {
    char name[100];
    int  matricula;
    ...
} student_t;

student_t winner = {"Memati", 30};
```
Bu yerda yangi `student_t` derived type bo'yicha o'zgaruvchi e'lon qilinmoqda. 

**- Nested structures**
OOP mavjud tillarda Class ichida Class ochish mumkin bo'lgani kabi C da ham struct ichida struct ochish mumkin. Buning ham 2 xil usuli bor:

```c
// 1. Embedded Nesting
struct Wolves {
    char name[100];
    struct Team team {
        int no;
        int power;
        ...
    }
    ...
}

// 2. Separate Nesting
struct Team {
    int no;
    int power;
    ...
}

struct Wolves {
    char name[100];
    struct Team team;
    ...
}
```
Nested memberlarga access qilish ham dot operator yordamida amalga oshadi:
```c
wolve1.team.no;
wolve2.team.power;
```
Nested holatida bir necha struktura alohida e'lon qilinsa-da, qiymat faqat Parent strukturaga beriladi:

```c
struct Wolves wolve1 = {.name="Jahid", .team.no = 1, .team.power = 100};
```

**- Structure Pointers**
Biz boshqa turlarga qilganimiz kabi strukturaga ham pointer berishimiz mumkin. Bu aslida juda efficient usul bo'lib, funksiya argumentiga struct o'rniga uning pointeri kiritilishi buning bir misoli.
Struktura pointeri yordamida struct memberlariga access qilish biroz murakkab (*ptr.field), shu sabab **arrow operator (->)** yordamida osonlashtirilgan:

```c
struct Point {
    int x, y;
};

struct Point nuqta = {1,2};
struct Point* ptr = &nuqta;

// Pointer yordamida strukturaga access qilish
printf("%d %d",ptr->x, ptr->y);
```

**- Self-referential Structures**
O'z-o'ziga murojaat qiluvchi strukturalarni tushunish bizga Data Structures tomon yo'l ochadi. Chunki bu tushuncha ustiga Linked List, Tree, Graph kabi ma'lumot tuzilmalari qurilgan. 
O'z-o'ziga murojaat qiluvchi - o'z turidagi boshqa o'zgaruvchilarning adresini/pointerini ham saqlaydigan struct o'zgaruvchilari. Buni misol bilan ko'rish yaxshiroq:

```c
typedef struct Node {
    char name[50];
    int no;
    struct Node* next;
} node_t;

int main()
{
    node_t node1 = { "N1", 1, NULL };
    node_t node2 = { "N2", 2, NULL };
  
    // node2 ning adresini node1.next ga tenglash
    node1.next = &node2;
  
    // node1 ga pointer
    node_t *ptr1 = &node1;
  
    // node1 yordamida node2 ga access qilish
    printf("node2.name: %s\nnode2.no: %d", ptr1->next->name,
           ptr1->next->no);
  
    return 0;
}
```
Ko'rib turganimizdek, node1.next = &node2; orqali node2 ning adresi node1 da saqlanmoqda. Linked Listda ham idea shunday to'g'rimi, ya'ni o'zidan keyingi element adresini saqlashi kerak.

**- Structure Padding**
❓ Bir savol tug'iladi, struct xotirada qanday joy egallaydi?
✅ 32 bitli kompilyator uchun protsessor bir vaqtning o'zida faqat 4 baytni o'qiy oladi. Shu tufayli bunday kompilyatorda, xotira 4 baytlik bloklarga bo'lingan bo'ladi.

![Struct padding](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9dzl4t8ro8touvcygxrc.png)

Keling bir misol ko'raylik. Berilgan rasmda quyidagi struct qurilgan:

```c
struct student 
{
       int id1;
       int id2;
       char a;
       char b;
       float percentage;
};
```

Bu yerda `int` uchun 4 bayt, har bir belgi uchun 1 bayt. Ko'rib turganingizdek, 2 ta belgi faqat 2 bayt xotirani ajratadi va protsessor avtomatik ravishda boshqa 2 baytni bo'sh qoldirib, keyingi 4 baytlik blokga o'tadi. Bu **Struct padding** deb ataladi.

Shunday qilib struct bo'yicha kirish qismi tugadi. Endi Union va Enum haqida fikr yuritamiz.

## **👉 Union**
Union ham user-defined data type va syntax jihatdan 100% struct bilan bir xil:

```c
typedef struct {
    int x;
    float y;
    char z;
} str_t;

typedef union {
    int x;
    float y;
    char z;
} uni_t;

// Memberlarga access qilish
uni_t uni1.x = 4;
```

 Bu ikki tuzilmaning farqi xotiradan oladigan joyda seziladi. Struktura memberlari alohida locationlarga joylashadi, Union esa barcha o'zgaruvchilar bir locationga joylashadi. Keling, o'xshatish uchun bir stupid html example keltiraman:
Struct - input:checkbox
Union - select
Ya'ni, strukturada bir necha memberlar "tanlanishi" mumkin, unionda esa faqat bittasi "tanlanadi".

Strukturaning o'lchami undagi barcha memberlar o'lchamlari yig'indisiga teng bo'lsa, Unionda esa ularning eng kattasi. Buni isbotlash uchun yuqoridagi struct va unionning o'lchamlarini topamiz:
```c
...
int main(){
    printf("Size of struct: %lu\n", sizeof(str_t));
    printf("Size of union: %lu\n", sizeof(uni_t));

    return 0;
}

// Returns 12 and 4 respectively
```
Demak, struct uchun:
`4 (int) + 4 (float) + 1 (char) + 3 (struct padding) = 12`
bo'lsa, union uchun:
`max(4 (int), 4 (float), 1 (char)) = 4`

❓ Xo'sh, Union qanday hollarda ishlatiladi?
Buni bir misol bilan tushuntiramiz. Tasavvur qiling, bir o'yin yasayapmiz va unda characterlar bor. Character odam bo'lishi ham robot bo'lishi ham mumkin. Agar u odam bo'lsa, uning shaxsiyati, agar robot bo'lsa ichidagi dasturi haqidagi ma'lumotlar bo'lishi kerak. Aynan shu qismda Union bizga kerak bo'ladi:

```c
typedef struct {
    char *name;
    bool isRobot;
    union {
        char *personality;
        int firmware_version;
    }
} character;

void print_character(character* c){
    printf("Character is : %s",c->name);
    if (c->isRobot){
        printf("Version: %d", c->firmware_version);
    } else{
        printf("Personality: %s", c->personality);
    }
}
```
Demak union orqali biz xuddiki dropdown menu vazifasini C da bajaryapmiz. Bu usul _memory-efficient_ ham hisoblanadi.

## **- Enum**
Enumeration (yoxud perebor) user-defined data type bo'lib, o'zbek tilida "sanab chiqish, hisoblash" kabi ma'nolarda keladi. Ushbu data type integral konstantalardan iborat bo'ladi:

```c
enum Size {
    Small,
    Medium,
    Large,
    ExtraLarge
};

int main(){
    enum Size shoeSize;
    shoeSize = Small;
    
    printf("Shoe Size is : %d", shoeSize);
    
    return 0;
};

// outputs 0
```
Bu yerda ko'rishimiz mumkinki, biz define qilgan nomlarga enum o'zi raqam - state qo'yib berar ekan. `Small` keywordi birinchi turgani uchun unda `state=0` bo'ladi. Biz shunchaki ularni raqamlab chiqsak va indeks bo'yicha chaqirsak ham bo'lar edi, lekin dastur readability va osonligi jihatdan enumeration bizga qulayroq. Quyidagi rasmda yanada batafsil tanishish mumkin:
![Enum](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/osaaxcxkkwlpw6itzaj1.png)

---

🏁 _Xulosa qilib aytadigan bo'lsak, Struct, Union va Enum tiplari barchasi user-defined hisoblanadi va turli holatlarda ishlatiladi. Ular ichida eng muhimi Struct bo'lib, uni "C ning Classi" deyish mumkin.
Bu maqolamiz DSA ga kirish oldidan oxirgi fundamental bilimlar haqida bo'ldi. E'tiboringiz uchun rahmat!_