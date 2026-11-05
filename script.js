// Ramzy Tech WhatsApp contact
// Number is in international format without +, spaces or dashes.
const WHATSAPP_NUMBER = "2348104734570";

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll(".enquire").forEach((link) => {
  const product = link.dataset.product || "a product";
  link.href = whatsappLink(`Hello Ramzy Tech! I'm interested in the ${product}. Please share the current price, availability and delivery details.`);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const contactLink = document.getElementById("contact-whatsapp");
if (contactLink) {
  contactLink.href = whatsappLink("Hello Ramzy Tech! I'd like to make an enquiry.");
  contactLink.target = "_blank";
  contactLink.rel = "noopener noreferrer";
}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}

document.getElementById("year").textContent = new Date().getFullYear();
