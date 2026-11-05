// IMPORTANT: Replace this with your WhatsApp number in international format.
 // Nigeria example: 2348012345678 (no +, spaces or dashes).
const WHATSAPP_NUMBER = "2340000000000";

function openWhatsApp(message) {
  if (WHATSAPP_NUMBER === "2340000000000") {
    alert("WhatsApp ordering is not connected yet. Ask the store owner to add the business WhatsApp number in script.js.");
    return;
  }
  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank", "noopener,noreferrer");
}

document.querySelectorAll(".order-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product;
    openWhatsApp("Hello Ramzy Tech! I'm interested in the " + product + ". Please confirm the current price, availability and delivery options.");
  });
});

document.getElementById("contactButton").addEventListener("click", (event) => {
  event.preventDefault();
  openWhatsApp("Hello Ramzy Tech! I'd like to make an enquiry.");
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

document.querySelectorAll("#navLinks a").forEach((link) => {
  link.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open"));
});

document.getElementById("year").textContent = new Date().getFullYear();
