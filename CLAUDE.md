# Соёл Эрдэм Дээд Сургуулийн Вэбсайт

> モンゴル文化教育大学 · Japan sumi-e inspired static website
> HTML + CSS + JS · No build tools · Decap CMS

---

## 🎯 Одоогийн шинэчлэлийн зорилго

`pages/erdem.html` буюу **Эрдэм шинжилгээний хуудсыг** бүхэлд нь шинэчилж, оюутан/багш/олон нийтэд нээлттэй **интерактив судалгааны платформ** болгон хөгжүүлэх.

### Яагаад шинэчлэх шаардлагатай вэ?

Одоогийн судалгааны хэсэг нь зүгээр л мэдээллийн статик текст. Оюутнууд:
- Юу хийх, хаанаас эхлэхээ мэддэггүй
- Ментор багштай холбогдох суваггүй
- Бодит үр дүн гаргахаас илүү "ажил дуусгадаг"

### Шийдэл: 3 шинэ тэргүүлэх бүлэг сэдэв

**Бүлэг 1: Хэл + Технологийн огтлолцол** (Purple `#7F77DD`)
- Япон + IT тэнхимийн гүүр
- Япон-Монгол машин орчуулга, AI туслах, хэл сурах апп

**Бүлэг 2: Дижитал иргэний шийдэл** (Teal `#1D9E75`)
- Асуудал судлалыг шийдэл болгон хувиргах
- Сэтгэл зүйн апп, deepfake илрүүлэгч, хяналтын хэрэгсэл

**Бүлэг 3: Соёл + Инновацийн лаборатори** (Coral `#D85A30`)
- Монгол судлал + технологи
- Дижитал архив, VR өв, соёлын хөтөч апп

---

## 🛠 Техникийн бүтэц

### Технологийн стек
- **Frontend**: Pure HTML + CSS + JavaScript (build tool хэрэггүй)
- **CMS**: Decap CMS (GitHub-based, контент `content/` folder-т markdown хэлбэрээр хадгалагдана)
- **Hosting**: Netlify (netlify.toml тохиргоотой)
- **Auth**: Netlify Identity (admin нэвтрэх)
- **Fonts**: Google Fonts (Cormorant Garamond + Manrope + Shippori Mincho)

### Гол folder-ууд (СЭДС вэбсайт)

```
soyolerdem-website/
├── index.html                 — Нүүр (MN)
├── jp/index.html              — Нүүр (JP)
├── pages/
│   ├── erdem.html             ← ⭐ ЭНЭ ХУУДСЫГ ШИНЭЧИЛНЭ
│   ├── oyutan.html            — hub хуудас
│   ├── surgalt.html
│   └── ...бусад 15 хуудас
├── content/                   — Decap CMS markdown контент
│   ├── erdem/                 ← Судалгааны материал энд хадгалагдана
│   └── ...
├── admin/
│   ├── index.html             — Decap CMS админ
│   └── config.yml             ← Шинэ контент тип нэмэхэд энд тохируулна
├── assets/
│   ├── css/main.css           — Global CSS, үндсэн өнгөнүүд :root-д
│   ├── js/main.js             — Анимаци, scroll
│   ├── js/cms-loader.js       — Markdown → HTML уншуулагч
│   └── images/
└── netlify.toml
```

---

## 🎨 Дизайн систем (заавал дагах)

### Одоогийн өнгө (assets/css/main.css-ийн :root-т)

```css
--ink: #1a1a2e          /* Үндсэн — бэхний хар цэнхэр */
--vermillion: #e63946   /* Японы тамгын улаан — onцлох */
--paper: #f7f3e9        /* Уламжлалт Япон цаас */
--gold: #c9a961         /* Алтлаг тодотгол */
```

### 3 шинэ бүлэгт зориулсан өнгө (ЗӨВХӨН эрдэм шинжилгээний хэсэгт)

```css
--research-purple: #7F77DD      /* Хэл + Технологи */
--research-purple-bg: #EEEDFE
--research-teal: #1D9E75         /* Дижитал иргэн */
--research-teal-bg: #E1F5EE
--research-coral: #D85A30        /* Соёл + Инноваци */
--research-coral-bg: #FAECE7
```

Эдгээр өнгийг `main.css`-т нэмнэ, гэхдээ **үндсэн sumi-e эстетикийг** өөрчлөхгүй.

### Фонт
- **Гарчиг**: Cormorant Garamond (seriф)
- **Бие текст**: Manrope
- **Япон кана**: Shippori Mincho

### Зарчим
- **Минималист**, Japan редакцийн хэв маяг
- **Hover эффект** зөөлөн (`transition: all 0.3s ease`)
- **Mobile first** — 3 breakpoint: 640px, 1024px
- **Монгол Cyrillic зөв харагдах** — UTF-8 заавал

---

## 📋 pages/erdem.html шинэчлэлийн бүтэц

Дараах дарааллаар секцүүдтэй байна:

### 1. Hero секц
- Том гарчиг: "Эрдэм шинжилгээ, инноваци"
- Subtitle: "Оюутан, багш, судлаач — хэн ч шинэ санаагаа хэрэгжүүлэх нээлттэй талбар"
- 3 статистик карт (идэвхтэй төсөл, оролцогч, хэвлэгдсэн өгүүлэл)
- 3 CTA товчлуур: "Санаа оруулах" · "Төсөлд нэгдэх" · "Нээлттэй сэдвүүд"

### 2. 3 тэргүүлэх бүлэг
- Purple, Teal, Coral өнгөтэй 3 карт
- Hover-т өнгө гүнзгийрэх, жаахан өргөгдөх
- Дарахад тус бүлгийн дэлгэрэнгүй анкор хэсэг рүү scroll

### 3. "Би юу хийж чадах вэ?"
3 баганат таб/секц:
- **Оюутан** → сэдэв хайх · ментор хайх · багт нэгдэх
- **Багш** → сэдэв нэмэх · менторлох сонирхол · хэвлэлд оруулах
- **Гаднын** → асуудал санал болгох · ивээн тэтгэх

### 4. Нээлттэй сэдвийн самбар
- Карт хэлбэртэй жагсаалт (Decap CMS-ээр удирдах)
- Шүүлтүүр: бүлгээр, түвшингээр (хялбар/дунд/хэцүү)
- Тус карт дээр "Би сонирхож байна" товч → санаа оруулах форм руу scroll

### 5. Идэвхтэй төсөл
- Явагдаж буй баг гишүүд, ментор, явцын хувь

### 6. Багш нарын ментор профайл
- CMS-ээс уншина (`content/багш-ментор/`)
- Судалгааны сонирхол, нээлттэй орон тоо

### 7. Санаа оруулах форм (доод хэсэгт)
- Нэр, и-мэйл, би хэн бэ, бүлэг, санаа
- Submit → Netlify Forms (backend хэрэггүй)

### 8. Архив (одоо байгаа CITI Science сэтгүүлийн жагсаалт)
- Одоогийнх хэвээр үлдэнэ, доор орно

---

## 🔧 Decap CMS-т нэмэх шинэ контент төрлүүд

`admin/config.yml`-т дараах collection-ууд нэмэх хэрэгтэй:

### 1. `research-topics` (Нээлттэй сэдвүүд)
```yaml
- name: "research-topics"
  label: "Нээлттэй судалгааны сэдэв"
  folder: "content/research-topics"
  create: true
  fields:
    - { name: title, label: "Сэдвийн нэр" }
    - { name: group, label: "Бүлэг", widget: select,
        options: ["hel-tekhnologi", "digital-irgen", "soyol-innovatsi"] }
    - { name: level, label: "Түвшин", widget: select,
        options: ["khyalbar", "dund", "khetsuu"] }
    - { name: description, label: "Тайлбар", widget: markdown }
    - { name: suggested_mentor, label: "Санал болгож буй ментор" }
    - { name: status, label: "Статус", widget: select,
        options: ["open", "in-progress", "completed"] }
```

### 2. `mentor-profiles` (Багшийн ментор профайл)
```yaml
- name: "mentor-profiles"
  label: "Ментор багш"
  folder: "content/mentors"
  create: true
  fields:
    - { name: name, label: "Нэр" }
    - { name: title, label: "Цол, албан тушаал" }
    - { name: photo, label: "Зураг", widget: image }
    - { name: research_interests, label: "Судалгааны сонирхол" }
    - { name: available_slots, label: "Нээлттэй орон тоо", widget: number }
    - { name: bio, label: "Богино танилцуулга", widget: markdown }
```

### 3. `active-projects` (Идэвхтэй төсөл)
```yaml
- name: "active-projects"
  label: "Идэвхтэй төсөл"
  folder: "content/active-projects"
  create: true
  fields:
    - { name: title, label: "Төслийн нэр" }
    - { name: group, label: "Бүлэг" }
    - { name: team, label: "Баг гишүүд", widget: list }
    - { name: mentor, label: "Ментор" }
    - { name: progress, label: "Явц (%)", widget: number }
    - { name: description, label: "Тайлбар", widget: markdown }
```

---

## 📍 Зам (Path) стандарт

`pages/erdem.html` дотроос ашиглах замууд:

```html
<!-- CSS / JS -->
<link rel="stylesheet" href="../assets/css/main.css">
<script src="../assets/js/main.js"></script>
<script src="../assets/js/cms-loader.js"></script>

<!-- Дотоод линк -->
<a href="../index.html">Нүүр</a>
<a href="../pages/about.html">Сургуулийн тухай</a>

<!-- Зураг -->
<img src="../assets/images/research-hero.jpg">

<!-- CMS контент уншиж -->
<!-- cms-loader.js нь content/ folder-оос автоматаар markdown уншина -->
```

---

## ⚠️ Анхаарах дүрэм (Claude Code-д үргэлж сануул)

1. **Одоогийн sumi-e эстетикийг эвдэхгүй** — үндсэн sayar, hero section-ууд хэвээр
2. **Fallback-тай ажиллах** — CMS контент ирээгүй үед үзэсгэлэнтэй placeholder
3. **19 HTML файлын nav хэсэг** — хэрэв nav цэсэнд "Эрдэм шинжилгээ" нэмвэл бүх 19 файлд
4. **Зураг**: бүх шинэ зураг Unsplash placeholder эсвэл `assets/images/`-т бодит зураг
5. **Код дахь коммент — Англи хэлээр**, хэрэглэгч рүү чиглэсэн текст — **Монгол хэлээр**
6. **Мобайл дээр заавал шалгах** — nav hamburger, mobile card layout
7. **`pages/erdem.html`-аас гадна бусад файлд гар хүрэхгүй** (хэрэв хэрэггүй бол)

---

## 🔄 Ажлын урсгал (Claude Code-д)

```bash
# Анх эхлэхэд
cd soyolerdem-website
git checkout -b erdem-redesign    # шинэ branch нээх
claude                             # Claude Code эхлүүлэх

# Ажиллаж байхдаа
git status                         # өөрчлөлт шалгах
git add pages/erdem.html
git commit -m "feat(erdem): add hero section with 3 CTA"
git push

# GitHub дээр Netlify автоматаар preview gargadg
# Сайн ажилласны дараа main руу merge
```

---

## ✅ Даалгаварын жагсаалт

- [x] `main.css`-т 3 research өнгөний variable нэмэх
- [x] `pages/erdem.html`-ийн hero section шинэчлэх
- [x] 3 бүлгийн картны секц нэмэх
- [ ] "Би юу хийж чадах вэ?" 3 баганат секц
- [ ] Нээлттэй сэдвийн самбар (CMS fallback-тай)
- [ ] Идэвхтэй төслийн секц
- [ ] Ментор профайлын секц
- [ ] Санаа оруулах форм (Netlify Forms)
- [ ] `admin/config.yml`-т 3 шинэ collection нэмэх
- [ ] Мобайл breakpoint-оор шалгах
- [ ] Япон хэлний хувилбар (`jp/erdem.html`) — сүүлд хийнэ

---

## 📚 Холбогдох баримт

- `SEK_Shinechleliin_Koncepc.docx` — сургуулийн удирдлагад танилцуулах бүрэн концепц
- `SE_2026_оюутны_ЭШХ.pdf` — 2026 оны эрдмийн чуулганы хөтөлбөр (бодит мэдээллийн эх)
- `CMS-SETUP.md` — Decap CMS тохируулах заавар

---

## 💡 Дараагийн том алхам (MVP-ийн дараа)

- Оюутны портфолио хуудас (хувийн судалгааны жагсаалт)
- Оюутан-ментор таарах автомат систем
- Эрдэм шинжилгээний бичиг сэтгүүлийн дижитал индекс
- Японы түнш сургуулиудтай хамтарсан төслийн хэсэг
- Англи хэлний `en/erdem.html`

---

## Дууссан ажил

### 2026.04.19
- SESSION 1: CSS-т 3 research group өнгөний variable нэмэв (Purple #7F77DD, Teal #1D9E75, Coral #D85A30 + background хувилбарууд)
- SESSION 2+3: pages/erdem.html-д Hero секц + 3 тэргүүлэх чиглэлийн карт нэмэв. Hero-д 11/18/4 статистик, 3 CTA товч. Карт бүр clickable, өнгөт border-top, hover animation-тай.
- Anchor жагсаалт (дараагийн sessions-д хийгдэнэ): #submit-idea, #active-projects, #open-topics, #hel-tekhnologi, #digital-irgen, #soyol-innovatsi
