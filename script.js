function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Shared tooltip controller for HTML & JavaScript
document.addEventListener('DOMContentLoaded', () => {
  const shared = document.getElementById('shared-lang-tooltip');
  if (!shared) return;

  const articles = Array.from(document.querySelectorAll('#experience .article-container article'));
  const htmlArticle = articles[0]; // HTML is first
  const javaArticle = articles[1]; // Java is second
  const cssArticle = articles[2]; // CSS is third
  const cppArticle = articles[3]; // C++ is fourth
  const jsArticle = articles[4]; // JavaScript is fifth

  function showFor(targetArticle) {
    // swap content if targetArticle has a mapped content block
    if (contentMap.has(targetArticle)) {
      shared.querySelector('p').innerHTML = contentMap.get(targetArticle);
    }
    shared.setAttribute('aria-hidden', 'false');
    const tooltipRect = shared.getBoundingClientRect();
    const articleRect = targetArticle.getBoundingClientRect();
    const centerX = articleRect.left + articleRect.width / 2;
    const leftInsideTooltip = Math.max(12, Math.min(window.innerWidth - 12, centerX)) - tooltipRect.left;
    const leftPercent = (leftInsideTooltip / tooltipRect.width) * 100;
    const pointer = shared.querySelector('.shared-pointer');
    if (pointer) pointer.style.left = leftPercent + '%';
  }

  function hideShared() {
    shared.setAttribute('aria-hidden', 'true');
  }

  const allLangArticles = [htmlArticle, javaArticle, cssArticle, cppArticle, jsArticle];
  allLangArticles.forEach((art) => {
    if (!art) return;
    art.addEventListener('mouseenter', () => showFor(art));
    art.addEventListener('focusin', () => showFor(art));
    art.addEventListener('mouseleave', hideShared);
    art.addEventListener('focusout', hideShared);
  });

  // Also attach the shared tooltip behavior to any articles in the Tools & Databases tile (e.g., MySQL)
  const toolsArticles = Array.from(document.querySelectorAll('#experience > .experience-details-container .about-containers > .details-container:nth-child(2) .article-container article'));
  toolsArticles.forEach((art) => {
    art.addEventListener('mouseenter', () => showFor(art));
    art.addEventListener('focusin', () => showFor(art));
    art.addEventListener('mouseleave', hideShared);
    art.addEventListener('focusout', hideShared);
  });

  document.addEventListener('click', (e) => {
    if (!shared.contains(e.target)) hideShared();
  });
});

// content mapping for shared tooltip
const contentMap = new Map();
const articleNodes = document.querySelectorAll('#experience .article-container article');
const sharedParagraph = document.getElementById('shared-lang-tooltip')?.querySelector('p');
if (articleNodes.length) {
  // HTML: use the existing shared paragraph (already set in markup)
  if (articleNodes[0] && sharedParagraph) contentMap.set(articleNodes[0], sharedParagraph.innerHTML);

  // Java: extract inline tooltip if present
  if (articleNodes[1]) {
    const t = articleNodes[1].querySelector('.lang-tooltip');
    if (t) contentMap.set(articleNodes[1], t.innerHTML);
  }

  // CSS: extract inline tooltip if present
  if (articleNodes[2]) {
    const t = articleNodes[2].querySelector('.lang-tooltip');
    if (t) contentMap.set(articleNodes[2], t.innerHTML);
  }

  // C++: use a concise default paragraph (replaceable)
  if (articleNodes[3]) {
    contentMap.set(articleNodes[3], `I use C++ for performance-sensitive coding, implementing efficient algorithms and data structures. I pay careful attention to memory management, RAII, and low-level optimization while writing clean, modular code. Projects include data-structures exercises and small performance-focused tools that showcase attention to speed and resource usage.`);
  }

  // JavaScript: provide a short first-person paragraph (replaceable)
  if (articleNodes[4]) {
    contentMap.set(articleNodes[4], `I enhance interactivity and user experience using JavaScript. I implement DOM manipulation, event-driven behavior, and lightweight client-side features while keeping performance and accessibility in mind. I used JavaScript here for navigation, UI interactions, and small UX improvements.`);
  }

  // Find the MySQL article anywhere under #experience by matching its h3 text and map it to the supplied paragraph
  const mysqlArticle = Array.from(document.querySelectorAll('#experience .article-container article')).find(a => {
    const h = a.querySelector('h3');
    return h && h.textContent && h.textContent.trim().toLowerCase() === 'mysql';
  });
  if (mysqlArticle) {
    contentMap.set(mysqlArticle, `I utilize MySQL to design and manage the relational database backend for a Hospital Management System. I am proficient in structuring tables to securely record critical data for patients, doctors, and staff. I implement complex queries to manage and retrieve information, including the scheduling and tracking of appointments and procedures. This demonstrates my ability to build robust, scalable, and reliable database solutions for real-world applications`);
  }
}