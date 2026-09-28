"use strict";

/* Set the email address that receives project briefs. */
const OWNER_EMAIL = "YOUR-EMAIL@example.com";

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initForm();
  initStartForm();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

function initNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#nav a").forEach(a => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });

  const burger = document.getElementById("burger");
  if (!burger) return;

  const setMenu = open => {
    document.body.classList.toggle("menu-open", open);
    burger.classList.toggle("on", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  document.querySelectorAll("#nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 760) setMenu(false); });
}

function initForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  const fail = msg => { status.className = "status error"; status.textContent = msg; };

  form.addEventListener("submit", e => {
    e.preventDefault();
    const v = id => document.getElementById(id).value.trim();
    status.className = "status";

    if (!v("name")) return fail("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) return fail("Enter a valid email address.");
    if (!v("subject")) return fail("Enter a subject.");
    if (v("message").length < 10) return fail("Add a few more details about your project.");

    const link = document.getElementById("emailLink");
    const to = link ? link.getAttribute("href").replace("mailto:", "") : "";
    if (!to || to.includes("YOUR-EMAIL")) return fail("Add your email address to contact.html first.");

    const body = `Name: ${v("name")}\nEmail: ${v("email")}\n\n${v("message")}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(v("subject"))}&body=${encodeURIComponent(body)}`;

    status.className = "status success";
    status.textContent = "Opening your email app to send the message.";
    showToast("Opening your email app");
  });
}

function showToast(text) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 3200);
}

function initStartForm() {
  const form = document.getElementById("startForm");
  const status = document.getElementById("startStatus");
  if (!form || !status) return;

  const v = id => document.getElementById(id).value.trim();
  const fail = msg => { status.className = "status error"; status.textContent = msg; };

  form.addEventListener("submit", e => {
    e.preventDefault();
    status.className = "status";

    if (!v("s-name")) return fail("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("s-email"))) return fail("Enter a valid email address.");
    if (!v("s-type")) return fail("Choose a project type.");
    if (v("s-desc").length < 20) return fail("Describe your project in at least a couple of sentences.");
    if (OWNER_EMAIL.includes("YOUR-EMAIL")) return fail("Set OWNER_EMAIL at the top of app.js first.");

    const lines = [
      `Name: ${v("s-name")}`,
      `Email: ${v("s-email")}`,
      `Project type: ${v("s-type")}`,
      `Budget: ${v("s-budget") || "Not given"}`,
      `Deadline: ${v("s-deadline") || "Not given"}`,
      `References: ${v("s-links") || "None"}`,
      "",
      "Description:",
      v("s-desc"),
      "",
      "Key features:",
      v("s-features") || "Not given"
    ];

    window.location.href =
      `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent("New project: " + v("s-type") + " from " + v("s-name"))}` +
      `&body=${encodeURIComponent(lines.join("\n"))}`;

    status.className = "status success";
    status.textContent = "Opening your email app. Press send there to deliver your brief.";
    showToast("Opening your email app");
  });
}