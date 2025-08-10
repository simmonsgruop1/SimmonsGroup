document
  .getElementById("contact-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // HTML5-валидация (не отправляем, если есть ошибки)
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }

    const formData = new FormData(this);

    try {
      const resp = await fetch("submit_form.php", {
        method: "POST",
        body: formData,
      });

      if (resp.ok) {
        window.location.href = "thanks.php";
      } else {
        const text = await resp.text();
        alert("Ошибка при отправке формы. Попробуйте ещё раз.");
        console.error("Bad response:", resp.status, text);
      }
    } catch (err) {
      alert("Ошибка при отправке формы. Проверьте соединение.");
      console.error(err);
    }
  });
