(() => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("message");
  const send = document.getElementById("send");
  const messages = document.getElementById("messages");

  function addBubble(text, kind) {
    const bubble = document.createElement("div");
    bubble.className = "bubble " + kind;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message || send.disabled) return;

    addBubble(message, "user");
    input.value = "";
    send.disabled = true;
    send.textContent = "…";
    const waiting = addBubble("RAMZY AI is thinking…", "bot");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Sorry, RAMZY AI is unavailable right now.");
      waiting.textContent = data.reply || "I couldn't prepare a reply. Please try again.";
    } catch (error) {
      waiting.textContent = error.message || "Connection problem. Please try again.";
    } finally {
      send.disabled = false;
      send.textContent = "Send";
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
})();