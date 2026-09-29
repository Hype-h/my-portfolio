"use strict";

/* Set the email address that receives messages and project briefs. */
const OWNER_EMAIL = "YOUR-EMAIL@example.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isPlaceholder = email => !email || email.includes("YOUR-EMAIL");

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initContactForm();
  initStartForm();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

/* ---------- Helpers ---------- */

/* Trimmed value of a field; empty string if the field does not exist. */
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function setStatus(el, type, text) {
  el.className = type ? `status ${type}` : "status";
  el.textContent = text || "";
}

function showToast(text) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function openMail(to, subject, body) {
  window.location.href =
    `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ---------- Navigation ---------- */

function initNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#nav a").forEach(a => {
    const target = a.getAttribute("href").split("#")[0];
    if (target === page) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  const burger = document.getElementById("burger");
  if (!burger) return;

  const setMenu = open => {
    document.body.classList.toggle("menu-open", open);
    burger.classList.toggle("on", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  burger.addEventListener("click", () =>
    setMenu(!document.body.classList.contains("menu-open")));
  document.querySelectorAll("#nav a").forEach(a =>
    a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 760) setMenu(false); });
}

/* ---------- Contact form (contact.html) ---------- */

function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    setStatus(status, "");
    const fail = msg => setStatus(status, "error", msg);

    if (!val("name")) return fail("Enter your name.");
    if (!EMAIL_RE.test(val("email"))) return fail("Enter a valid email address.");
    if (!val("subject")) return fail("Enter a subject.");
    if (val("message").length < 10) return fail("Add a few more details about your project.");

    /* Use the mailto link on the page if present, otherwise OWNER_EMAIL */
    const link = document.getElementById("emailLink");
    const linkEmail = link ? (link.getAttribute("href") || "").replace("mailto:", "") : "";
    const to = isPlaceholder(linkEmail) ? OWNER_EMAIL : linkEmail;
    if (isPlaceholder(to)) return fail("Add your email address to contact.html or OWNER_EMAIL in app.js.");

    const body = `Name: ${val("name")}\nEmail: ${val("email")}\n\n${val("message")}`;
    openMail(to, val("subject"), body);

    setStatus(status, "success", "Opening your email app. Press send there to deliver your message.");
    showToast("Opening your email app");
  });
}

/* ---------- Start-a-project form (start.html) ---------- */

function initStartForm() {
  const form = document.getElementById("startForm");
  const status = document.getElementById("startStatus");
  if (!form || !status) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    setStatus(status, "");
    const fail = msg => setStatus(status, "error", msg);

    if (!val("s-name")) return fail("Enter your name.");
    if (!EMAIL_RE.test(val("s-email"))) return fail("Enter a valid email address.");
    if (!val("s-type")) return fail("Choose a project type.");
    if (val("s-desc").length < 20) return fail("Describe your project in at least a couple of sentences.");
    if (isPlaceholder(OWNER_EMAIL)) return fail("Set OWNER_EMAIL at the top of app.js first.");

    const body = [
      `Name: ${val("s-name")}`,
      `Email: ${val("s-email")}`,
      `Project type: ${val("s-type")}`,
      `Budget: ${val("s-budget") || "Not given"}`,
      `Deadline: ${val("s-deadline") || "Not given"}`,
      `References: ${val("s-links") || "None"}`,
      "",
      "Description:",
      val("s-desc"),
      "",
      "Key features:",
      val("s-features") || "Not given"
    ].join("\n");

    openMail(OWNER_EMAIL, `New project: ${val("s-type")} from ${val("s-name")}`, body);

    setStatus(status, "success", "Opening your email app. Press send there to deliver your brief.");
    showToast("Opening your email app");
  });
}
