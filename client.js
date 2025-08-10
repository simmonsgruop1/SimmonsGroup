document
  .getElementById("contact-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(this).entries());

    try {
      const resp = await fetch("/api/submit_form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (resp.ok) {
        window.location.href = "thanks.html";
      } else {
        const t = await resp.text();
        alert(t || "Ошибка при отправке формы.");
      }
    } catch (err) {
      alert("Ошибка при отправке формы. Проверьте соединение.");
      console.error(err);
    }
  });
