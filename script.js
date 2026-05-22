// Header, mobile navigation, scroll reveal, and static contact form behavior.
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const revealElements = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("[data-contact-form]");
const formSuccess = document.querySelector("[data-form-success]");
const formError = document.querySelector("[data-form-error]");
const formSubmit = document.querySelector("[data-form-submit]");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

function closeMobileNav() {
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("open");
  document.body.classList.remove("nav-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navMenu.classList.toggle("open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

window.addEventListener("scroll", updateHeader);
updateHeader();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

function showFormMessage(type, message = "") {
  formSuccess.classList.toggle("visible", type === "success");
  formError.classList.toggle("visible", type === "error");
  formError.textContent = message;
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showFormMessage("none");

  // FormData collects the values from the existing form fields by their name attributes.
  const formData = new FormData(contactForm);
  const contactData = Object.fromEntries(formData.entries());

  formSubmit.disabled = true;
  formSubmit.textContent = "Wird gesendet...";

  const subject = `Anfrage: ${contactData.service || "BLN Security Solutions"}`;
  const body = [
    `Name / Firma: ${contactData.name || ""}`,
    `Email: ${contactData.email || ""}`,
    `Telefon: ${contactData.phone || ""}`,
    `Leistung / Service: ${contactData.service || ""}`,
    "",
    "Nachricht / Message:",
    contactData.message || "",
  ].join("\n");

  const mailtoUrl = `mailto:info@bln-security-solutions.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoUrl;
  showFormMessage("success");

  window.setTimeout(() => {
    showFormMessage("none");
  }, 6000);

  formSubmit.disabled = false;
  formSubmit.textContent = "Anfrage senden";
});
