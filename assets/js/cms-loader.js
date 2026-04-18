/* ============================================================
   CMS CONTENT LOADER
   GitHub-аас .md файлыг татаж html-ээр харуулах
   ============================================================ */

// ⚠️ ТОХИРГОО — Энэ 2 мөрийг өөрсдийн GitHub дансанд тохируулна
const GITHUB_USER = "khuygbaataro"; // ← Өөрийн GitHub username
const GITHUB_REPO = "soyolerdem-website"; // ← Repo нэр
const GITHUB_BRANCH = "main";

// Тохиргооны статус шалгах
const CMS_CONFIGURED = GITHUB_USER !== "YOUR-USERNAME";

const GITHUB_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents`;
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

// ============================================
// Warning мессеж — CMS тохируулаагүй үед
// ============================================
if (!CMS_CONFIGURED) {
  console.warn(
    "%c⚠️ CMS тохируулаагүй байна",
    "color: #e63946; font-size: 14px; font-weight: bold;",
    "\nassets/js/cms-loader.js файл дотор GITHUB_USER-г солино уу.",
  );
}

// ============================================
// Markdown файлыг parse хийх (front matter + body)
// ============================================
function parseMarkdown(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };

  const meta = {};
  match[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      // Quote-уудыг цэвэрлэх
      if (value.startsWith('"') && value.endsWith('"'))
        value = value.slice(1, -1);
      if (value === "true") value = true;
      if (value === "false") value = false;
      meta[key] = value;
    }
  });

  return { meta, body: match[2] };
}

// Огноог монголоор форматлах
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year} · ${month} · ${day}`;
}

// Ангиллын Японы нэрийг буцаах
const categoryMap = {
  elselt: { mn: "ЭЛСЭЛТ", jp: "入 学" },
  event: { mn: "ҮЙЛ ЯВДАЛ", jp: "行 事" },
  success: { mn: "АМЖИЛТ", jp: "成 果" },
  intern: { mn: "ИНТЕРНШИП", jp: "イ ン タ ー ン" },
  research: { mn: "ЭРДЭМ", jp: "学 術" },
  partnership: { mn: "ТҮНШЛЭЛ", jp: "提 携" },
  graduation: { mn: "ТӨГСӨЛТ", jp: "卒 業" },
};

// ============================================
// GitHub-аас хавтасны бүх файлыг татах
// ============================================
async function fetchCollection(folder) {
  // CMS тохируулаагүй бол fallback ашиглах
  if (!CMS_CONFIGURED) {
    console.info(
      `[CMS] Static fallback used for: ${folder} (GITHUB_USER not configured)`,
    );
    return null; // Fallback-ийг идэвхжүүлэхийн тулд null буцаана
  }

  try {
    console.info(`[CMS] Fetching: content/${folder}`);
    const response = await fetch(`${GITHUB_API}/content/${folder}`);

    if (response.status === 404) {
      console.warn(
        `[CMS] Folder not found: content/${folder} (хавтас хоосон эсвэл repo үүсээгүй)`,
      );
      return [];
    }
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const files = await response.json();
    if (!Array.isArray(files)) return [];

    const items = await Promise.all(
      files
        .filter((f) => f.name.endsWith(".md"))
        .map(async (file) => {
          const res = await fetch(file.download_url);
          const text = await res.text();
          const { meta, body } = parseMarkdown(text);
          return { ...meta, body, slug: file.name.replace(".md", "") };
        }),
    );

    console.info(`[CMS] Loaded ${items.length} items from ${folder}`);
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    console.error(`[CMS] Load error for ${folder}:`, err.message);
    return null; // Алдаа гарвал fallback идэвхжүүлэх
  }
}

// ============================================
// МЭДЭЭ харуулах — medee.html хуудсанд
// ============================================
async function renderNews(containerId = "dynamic-news", maxItems = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const news = await fetchCollection("medee");

  // Fallback: null буцсан бол container-д байгаа static контентыг үлдээнэ
  if (news === null) {
    console.info(`[CMS] Keeping static fallback for ${containerId}`);
    return;
  }

  container.innerHTML = "";

  const items = maxItems ? news.slice(0, maxItems) : news;

  if (items.length === 0) {
    container.innerHTML =
      '<div style="grid-column: span 3; text-align:center; padding: 3rem; color: var(--ink-light); font-family: var(--font-serif); font-style: italic;">Одоогоор мэдээ байхгүй байна.</div>';
    return;
  }

  container.innerHTML = items
    .map((item, idx) => {
      const cat = categoryMap[item.category] || { mn: "", jp: "" };
      const isFeatured = item.featured === true || item.featured === "true";
      const coverImg =
        item.cover ||
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800";

      return `
      <article class="news-card ${idx === 0 && isFeatured ? "large" : ""} fade-on-scroll" onclick="openNews('${item.slug}')">
        <div class="news-image" style="background-image: linear-gradient(135deg, rgba(26,26,46,0.5), rgba(230,57,70,0.3)), url('${coverImg}');"></div>
        <div class="news-content">
          <div class="news-meta">
            <span class="news-category">${cat.jp} · ${cat.mn}</span>
            <span class="news-date">${formatDate(item.date)}</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.summary || ""}</p>
          <a href="#" class="read-more">Цааш унших →</a>
        </div>
      </article>
    `;
    })
    .join("");
}

// ============================================
// СОНИН харуулах
// ============================================
async function renderSonin(containerId = "dynamic-sonin") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const issues = await fetchCollection("sonin");
  if (issues === null) return; // Static fallback үлдэнэ
  if (issues.length === 0) {
    container.innerHTML =
      '<p style="grid-column: span 3; text-align:center; color: var(--ink-light); padding: 2rem;">Одоогоор сонин байхгүй байна.</p>';
    return;
  }

  const seasonColors = {
    spring: "linear-gradient(145deg, var(--ink), var(--vermillion))",
    summer: "linear-gradient(145deg, #2a4a6b, var(--ink))",
    autumn: "linear-gradient(145deg, #4a6741, var(--ink))",
    winter: "linear-gradient(145deg, #1a3a5a, var(--ink-deep))",
  };

  const seasonJP = { spring: "春", summer: "夏", autumn: "秋", winter: "冬" };

  container.innerHTML = issues
    .map(
      (issue) => `
    <div class="fade-on-scroll" style="cursor: pointer;">
      <a href="${issue.pdf || "#"}" target="_blank" style="text-decoration: none; color: inherit;">
        <div style="aspect-ratio: 3/4; background: ${seasonColors[issue.season] || seasonColors.spring}; padding: var(--space-4); display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 10px 30px rgba(26,26,46,0.15);">
          <div>
            <div style="font-family: var(--font-jp); color: var(--paper); font-size: 0.75rem; letter-spacing: 0.3em; font-weight: 600; opacity: 0.7;">№ ${issue.issue_number} · ${new Date(issue.date).getFullYear()}</div>
          </div>
          <div>
            <div style="font-family: var(--font-serif); color: var(--paper); font-size: 2.8rem; font-weight: 500; line-height: 0.95; font-style: italic;">${issue.title}</div>
            <div style="font-family: var(--font-jp); color: var(--paper); font-size: 0.8rem; letter-spacing: 0.2em; margin-top: var(--space-2); opacity: 0.8;">${issue.issue_number} 号 · ${seasonJP[issue.season] || ""}</div>
          </div>
        </div>
        <div style="padding: var(--space-3) 0;">
          <div style="font-family: var(--font-jp); color: var(--vermillion); font-size: 0.75rem; letter-spacing: 0.2em; font-weight: 600;">${formatDate(issue.date)}</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 500; margin: 0.5rem 0;">${issue.issue_number} дахь дугаар</h3>
          <p style="font-size: 0.9rem; color: var(--ink-soft);">${issue.description || ""}</p>
        </div>
      </a>
    </div>
  `,
    )
    .join("");
}

// ============================================
// ТӨГСӨГЧДИЙГ харуулах
// ============================================
async function renderGraduates(containerId = "dynamic-graduates") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const grads = await fetchCollection("tugsugchid");
  if (grads === null) return; // Static fallback үлдэнэ
  if (grads.length === 0) {
    container.innerHTML =
      '<p style="grid-column: span 3; text-align:center; color: var(--ink-light); padding: 2rem;">Төгсөгч байхгүй байна.</p>';
    return;
  }

  container.innerHTML = grads
    .map(
      (grad) => `
    <div class="alumni-card fade-on-scroll">
      <div class="year">${grad.year_graduated} онд төгссөн</div>
      <h4>${grad.name}</h4>
      <div class="position">${grad.position || ""}</div>
      <div class="company">${grad.company || ""}</div>
    </div>
  `,
    )
    .join("");
}

// ============================================
// ЭРДЭМ ШИНЖИЛГЭЭНИЙ БҮТЭЭЛ харуулах
// ============================================
async function renderResearch(containerId = "dynamic-research") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const papers = await fetchCollection("erdem");
  if (papers === null) return; // Static fallback үлдэнэ
  if (papers.length === 0) {
    container.innerHTML =
      '<p style="grid-column: span 3; text-align:center; color: var(--ink-light); padding: 2rem;">Бүтээл байхгүй байна.</p>';
    return;
  }

  container.innerHTML = papers
    .map(
      (paper) => `
    <div class="research-card fade-on-scroll">
      <div class="volume">Vol. ${paper.volume} · ${new Date(paper.date).getFullYear()}</div>
      <h4>${paper.title}</h4>
      <div class="author">${paper.author} · ${paper.author_title || ""}</div>
      <div class="date">${formatDate(paper.date)}</div>
    </div>
  `,
    )
    .join("");
}

// ============================================
// АЖЛЫН БАЙР, ЭЛСЭЛТИЙН ЗАР
// ============================================
async function renderJobs(containerId = "dynamic-jobs") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const jobs = await fetchCollection("ajlyn-bair");
  if (jobs === null) {
    container.innerHTML =
      '<div style="grid-column: span 2; text-align: center; padding: 3rem 2rem; color: var(--ink-light); font-family: var(--font-serif); font-style: italic;">CMS тохируулаагүй тул зар харагдахгүй байна.<br><small style="font-size: 0.8rem; opacity: 0.7;">assets/js/cms-loader.js дотор GITHUB_USER-г солино уу.</small></div>';
    return;
  }
  const active = jobs.filter((j) => j.active !== false && j.active !== "false");

  if (active.length === 0) {
    container.innerHTML =
      '<p style="grid-column: span 2; text-align:center; color: var(--ink-light); padding: 2rem;">Одоогоор идэвхтэй зар байхгүй байна.</p>';
    return;
  }

  const typeLabel = {
    ajil: "АЖЛЫН БАЙР · 募 集",
    elselt: "ЭЛСЭЛТ · 入 学",
    tetgeleg: "ТЭТГЭЛЭГ · 奨 学",
    dadlaga: "ДАДЛАГА · 実 習",
  };

  container.innerHTML = active
    .map(
      (job) => `
    <div class="fade-on-scroll" style="background: var(--paper); border: 1px solid var(--border); padding: var(--space-4); position: relative;">
      ${job.urgent ? '<div style="position: absolute; top: -0.5rem; right: 1rem; background: var(--vermillion); color: var(--paper); padding: 0.3rem 0.8rem; font-family: var(--font-jp); font-size: 0.75rem; letter-spacing: 0.2em; font-weight: 700;">急 募</div>' : ""}
      <div style="font-family: var(--font-jp); color: var(--vermillion); font-size: 0.78rem; letter-spacing: 0.2em; font-weight: 600; margin-bottom: var(--space-2);">${typeLabel[job.type] || ""}</div>
      <h3 style="font-family: var(--font-serif); font-size: 1.4rem; font-weight: 500; margin-bottom: var(--space-2);">${job.title}</h3>
      <p style="color: var(--ink-soft); line-height: 1.6; margin-bottom: var(--space-3); font-size: 0.95rem;">${job.summary || ""}</p>
      <div style="display: flex; gap: var(--space-3); padding-top: var(--space-2); border-top: 1px dashed var(--border); font-size: 0.85rem; color: var(--ink-light); flex-wrap: wrap;">
        ${job.salary ? `<div><strong style="color: var(--vermillion);">Цалин:</strong> ${job.salary}</div>` : ""}
        ${job.location ? `<div><strong style="color: var(--vermillion);">Байршил:</strong> ${job.location}</div>` : ""}
        ${job.deadline ? `<div><strong style="color: var(--vermillion);">Хугацаа:</strong> ${formatDate(job.deadline)}</div>` : ""}
      </div>
    </div>
  `,
    )
    .join("");
}

// ============================================
// Мэдээ нарийн дэлгэрэнгүй харуулах (modal/popup)
// ============================================
function openNews(slug) {
  // TODO: Single news page эсвэл modal popup
  console.log("Opening news:", slug);
  alert(
    "Дэлгэрэнгүй хуудас хөгжүүлэгдэж байна. Одоогоор CMS админ хэсгээс шууд унших боломжтой.",
  );
}

// ============================================
// Автомат ачаалалт (хуудас ачаалагдсаны дараа)
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Ачаалах контентын төрлөөс хамаарч auto-detect
  if (document.getElementById("dynamic-news")) renderNews("dynamic-news");
  if (document.getElementById("dynamic-news-home"))
    renderNews("dynamic-news-home", 3);
  if (document.getElementById("dynamic-sonin")) renderSonin();
  if (document.getElementById("dynamic-graduates")) renderGraduates();
  if (document.getElementById("dynamic-research")) renderResearch();
  if (document.getElementById("dynamic-jobs")) renderJobs();
});
