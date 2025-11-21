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

!!! question "Discrete Math nima o'zi?"
    U menga nimaga kerak? Men bir paytlar matematikadan chiqib ketganimda "dasturlash uchun bu integrallarni keragi yo'q, degandim". 

Bu savolga javob berishdan oldin aniqlashtirib olaylik: **Matematika nima o'zi?**

---

Matematika bu sonlar va shakllarni o'rganuvchi fan. Bu ulkan fan hayotimizda biz o'ylagandan ham ko'proq jabhalarda namoyon bo'ladi. Lekin uni umumlashtirib 2 turga ajratish mumkin: **continuous** va **discrete**.  

1. **Continuous** matematikada biz cheksiz bo'laklarga ega, uzluksiz va davomiy propertylarni o'rganamiz. Oddiy misol hammamizning uyimizda bor analog soat - soat, minut va sekund millari uzluksiz ravishda qimirlab turadi. Eng qizig'i ularning aniq state'lari ham yo'q, ya'ni agar eng kichik state sekund desak, undan ham kichikrog'i topiladi: 00:00:00 va 00:00:01 o'rtasida cheksiz kichik statelar mavjud. Bu oqim, bu davomiylik.
2. **Discrete** matematika esa o'z navbatida raqamli soatga o'xshaydi, unda aniq statelar mavjud. 00:00 va 00:01 o'rtasida aniq 60 ta possible state bor, yarim sekund, 1/314 sekund degan narsalar mavjud emas!

!!! warning "Menga nima foyda?"
    Xo'p, tushundim. Bularni ko'p o'qiganman, eshitganman. **Lekin bu menga nima foyda beradi?** Qaysidir system muammosiga yaxshiroq yechim bera olamanmi? Interviewlarda yaxshiroq natija ko'rsata olamanmi?

Bu menga nima kerak deyishni bas qil. Savolni o'zgartir: "Qaysi muammolarim faqat discrete bilan hal bo'ladi?". Bu savolga javob berishdan oldin atamalarga biroz to'xtalaman va keyin sabablar ro'yxatini tuzamiz.

* **State** - ma'lum jarayonning aniq bir momentdagi holati. Masalan, HTTP requestni parse qilish bilan tushunsak, request kelgan momentdagi state `RequestReceived`, Request Line parse qilingan momentda `ParseRequestLine`, headerlar parse qilinganda `ParseHeader` va body parse qilinganda `BodyParse`. Jarayon yakunlanganda `RequestParsed` yoki agar error bo'lsa `RequestNotParsed`.
* **Invariant** - jarayonda mavjud barcha statelar uchun rost bo'lishi kerak bo'lgan xususiyat. Masalan, HTTP requestda request line bo'lishi shart, headerlar soni nechtadirdan oshmasligi kerak, etc. Bir so'z bilan cheklovlar.
* **Transition** - jarayon bir holatdan boshqasiga (tashqi ta'sir ostida yoki mustaqil) o'tishi. Masalan, qachonki biz `\r\n` ga yetib kelsak, request line parse qilishni to'xtatib headerlarga o'tamiz.
* **Proof** - isbot. Isbotki qaysidir jarayon har qanday holatda ishlashiga kafolat beradi. Isbot har qanday testdan kuchli, sababi siz millionta case test qilsangiz ham qayerdadir edge case qolib ketishi mumkin.

!!! Note "Davom etamiz"
    Hmm... Qiziq. Nimadir borga o'xshayapti.

Albatta. Toki asosiy conceptlarni tushunib olgan ekanmiz, kel endi bu fan bizga "nima foyda berishini" ko'rib chiqamiz:

1. **Senga discrete kerak, chunki hamma algoritmlar aslida bir diskret tizimdir.**
Arrays, strings, linked lists, trees, graphs: bularning barchasi aniq, chekli va sanash mumkin bo'lgan statelarga ega tuzilmalardir. Discrete mulohazasiz sen shunchaki patternlarni eslab qolasan. Discrete mulohaza bilan sen invariantlardan algoritmni o'ylab topasan.

2. **Senga discrete kerak, chunki sen qurgan va quradigan hamma narsa aslida state machine.**
HTTP serverlar, authentication flowlar, database tranzaksiyalar: hamma hammasi state machinelar. Discrete mulohazasiz sen ularni tizimli boshqara olmaysan. Discrete mulohaza bilan esa sen aslida nima bo'layotganini ko'ra olasan, modellashtira olasan.

3. **Senga discrete kerak, chunki interviewlar sening muammoni yecha olish qobiliyatingga qaraydi, patternlarni eslab qolishinga emas.**
LeetCode tizimli fikrlashni aniqlash uchun bir filter kabidir. Sen patternlarni eslab qolishing, 3000 ta misolni shu tartibda yechib chiqishing mumkin. Lekin discrete reasoning bo'lmasa, oldin ko'rmagan patterning, yangi holatga, yangi muammoga duch kelganingda miyang qotib qolsa hayron qolma.

4. **Senga discrete kerak, chunki haqiqiy kuchli tizimlar garantiya talab qiladi.**
Har qanday katta tizim doim ishlab turishi kerak. AWS qulab qolganda nima bo'ldi? Cloudflare? Yoki internet tarmog'iga qara, bular shunchalik mustahkam va kafolat bilan qurilganki, ular hech qachon buzilmasligiga o'zimiz ham ishonamiz. Buni qanday amalga oshirishdi? Milliardlab test caselar bilanmi? Yo'q. Teoremalar va isbotlar bilan.

5. **Senga discrete kerak, chunki kodning 100% to'g'riligini faqatgina testlar bilan bilib bo'lmaydi.**
Har bir test aynan bitta holatni tekshiradi. Isbot esa bo'lishi mumkin bo'lgan barcha holatlar uchun javob beradi va juda ko'p buglarni oldini oladi. Agar sen faqat test-caselarga suyanib qolsang, miyang execution-feedback-fix loopiga tushib qoladi. Bu xuddi "natural sonlar ichida cheksiz juft sonlar mavjud" teoremasini bittalab testlab, 1000 gacha testlagach, faqat 1000 gacha juft sonlar bor ekan deyishga o'xshaydi. Isbotlaganda-chi? 

Xulosa qil: senga discrete kerak chunki u taxmin va intuitsiyani aniqlik bilan, pattern yodlashni keltirib chiqarish, kutilmagan errorlar va edge caselarni kafolat hamda imitatsiyani dizayn bilan almashtiradi.

!!! Success "Evrika!"
    Tushunarli. Men aynan shu narsa tufayli low level dasturlashga kirib ko'rdim. Aynan shu narsa tufayli frameworkchi bo'lishni tan olmay, chuqurroq va chuqurroq kirishga urindim. Bu nima? Bu qilayotgan ishimdan ma'no topish, kelib chiqishini tushunish edi. Men qochib yurgan discrete matematika menga aslida kerak narsani berishi xayolimga ham kelmagandi. Buni va nihoyat tushunganim uchun shukr.

---

### Reference Books

Biz Discrete math o'rganish davomida ishlatadigan kitoblarimiz:

- [Mathematics for Computer Science](https://t.me/voidpbooks/135) by Albert R.Meyer
- [Mathematics: A Discrete Introduction](https://t.me/voidpbooks/139) by Edward R. Scheinerman