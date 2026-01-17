---
title: "Diskret Matematika menga nima uchun kerak?"
description: "Mazkur postda menga diskret matematika nima uchun kerak ekani, nega shunchaki LeetCode yechishdan ma'no topmaganim haqida so'z yuritaman."
date: 2025-11-21
categories:
  - Computer Science
tags:
    - discrete math
---

Mazkur postda menga diskret matematika nima uchun kerak ekani, nega shunchaki LeetCode yechishdan ma'no topmaganim haqida so'z yuritaman.

<!-- more -->

### What is Discrete Math?

Avvalo eslab olaylik, Matematika bu sonlar va shakllarni o'rganuvchi fan. Bu ulkan fan hayotimizda biz o'ylagandan ham ko'proq jabhalarda namoyon bo'ladi. Lekin uni umumlashtirib 2 turga ajratish mumkin: **continuous** va **discrete**.  

1. **Continuous** matematikada biz cheksiz bo'laklarga ega, uzluksiz va davomiy propertylarni o'rganamiz. Oddiy misol hammamizning uyimizda bor analog soat - soat, minut va sekund millari uzluksiz ravishda qimirlab turadi. Eng qizig'i ularning aniq state'lari ham yo'q, ya'ni agar eng kichik state sekund desak, undan ham kichikrog'i topiladi: 00:00:00 va 00:00:01 o'rtasida cheksiz kichik statelar mavjud. Bu oqim, bu davomiylik.
2. **Discrete** matematika esa o'z navbatida raqamli soatga o'xshaydi, unda aniq statelar mavjud. 00:00 va 00:01 o'rtasida aniq 60 ta possible state bor, yarim sekund, 1/314 sekund degan narsalar mavjud emas!

Muammo shundaki, biz doim o'zimizga "Bu menga nimaga kerak?" degan noaniq savol beramiz. Biz buning o'rniga "Discrete qaysi muammolarga yechim bo'ladi?" deb so'rashimiz kerak. Bu savolga javob berishdan oldin esa atamalarga biroz to'xtalamiz va keyin sabablar ro'yxatini tuzamiz.

* **State** - ma'lum jarayonning aniq bir momentdagi holati. Masalan, HTTP requestni parse qilish bilan tushunsak, request kelgan momentdagi state `RequestReceived`, Request Line parse qilingan momentda `ParseRequestLine`, headerlar parse qilinganda `ParseHeader` va body parse qilinganda `BodyParse`. Jarayon yakunlanganda `RequestParsed` yoki agar error bo'lsa `RequestNotParsed`.
* **Invariant** - jarayonda mavjud barcha statelar uchun rost bo'lishi kerak bo'lgan xususiyat. Masalan, HTTP requestda request line bo'lishi shart, headerlar soni nechtadirdan oshmasligi kerak, etc. Bir so'z bilan cheklovlar.
* **Transition** - jarayon bir holatdan boshqasiga (tashqi ta'sir ostida yoki mustaqil) o'tishi. Masalan, qachonki biz `\r\n` ga yetib kelsak, request line parse qilishni to'xtatib headerlarga o'tamiz.
* **Proof** - isbot. Isbotki qaysidir jarayon har qanday holatda ishlashiga kafolat beradi. Isbot har qanday testdan kuchli, sababi siz millionta case test qilsangiz ham qayerdadir edge case qolib ketishi mumkin.

---

### Why I need Discrete?

Toki asosiy conceptlarni tushunib olgan ekanmiz, keling endi bu fan bizga "nima foyda berishini" ko'rib chiqamiz:

1. **Sizga discrete kerak, chunki hamma algoritmlar aslida bir diskret tizimdir.**
Arrays, strings, linked lists, trees, graphs: bularning barchasi aniq, chekli va sanash mumkin bo'lgan statelarga ega tuzilmalardir. Discrete mulohazasiz siz shunchaki patternlarni eslab qolasan. Discrete mulohaza bilan siz invariantlardan algoritmni o'ylab topasan.

2. **Sizga discrete kerak, chunki siz qurgan va quradigan hamma narsa aslida state machine.**
HTTP serverlar, authentication flowlar, database tranzaksiyalar: hamma hammasi state machinelar. Discrete mulohazasiz siz ularni tizimli boshqara olmaysan. Discrete mulohaza bilan esa siz aslida nima bo'layotganini ko'ra olasan, modellashtira olasan.

3. **Sizga discrete kerak, chunki interviewlar sizing muammoni yecha olish qobiliyatingga qaraydi, patternlarni eslab qolishingizga emas.**
LeetCode tizimli fikrlashni aniqlash uchun bir filter kabidir. Siz patternlarni eslab qolishing, 3000 ta misolni shu tartibda yechib chiqishing mumkin. Lekin discrete reasoning bo'lmasa, oldin ko'rmagan patterning, yangi holatga, yangi muammoga duch kelganingda miyang qotib qolsa hayron qolma.

4. **Sizga discrete kerak, chunki haqiqiy kuchli tizimlar garantiya talab qiladi.**
Har qanday katta tizim doim ishlab turishi kerak. AWS qulab qolganda nima bo'ldi? Cloudflare? Yoki internet tarmog'iga qara, bular shunchalik mustahkam va kafolat bilan qurilganki, ular hech qachon buzilmasligiga o'zimiz ham ishonamiz. Buni qanday amalga oshirishdi? Milliardlab test caselar bilanmi? Yo'q. Teoremalar va isbotlar bilan.

5. **Sizga discrete kerak, chunki kodning 100% to'g'riligini faqatgina testlar bilan bilib bo'lmaydi.**
Har bir test aynan bitta holatni tekshiradi. Isbot esa bo'lishi mumkin bo'lgan barcha holatlar uchun javob beradi va juda ko'p buglarni oldini oladi. Agar siz faqat test-caselarga suyanib qolsang, miyang execution-feedback-fix loopiga tushib qoladi. Bu xuddi "natural sonlar ichida cheksiz juft sonlar mavjud" teoremasini bittalab testlab, 1000 gacha testlagach, faqat 1000 gacha juft sonlar bor ekan deyishga o'xshaydi. Isbotlaganda-chi? 

Xulosa: sizga discrete kerak chunki u taxmin va intuitsiyani aniqlik bilan, pattern yodlashni keltirib chiqarish bilan, kutilmagan errorlar va edge caselarni kafolat bilan hamda imitatsiyani dizayn bilan almashtiradi. Bir so'z bilan aytganda, siz nima qilayotganingizni rosmana bilib ish qilasiz.

---

### Reference Books

Biz Discrete math o'rganish davomida ishlatadigan kitoblarimiz:

- [Mathematics for Computer Science](https://t.me/voidpbooks/135) by Albert R.Meyer
- [Mathematics: A Discrete Introduction](https://t.me/voidpbooks/139) by Edward R. Scheinerman