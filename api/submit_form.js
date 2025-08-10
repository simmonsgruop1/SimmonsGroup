// api/submit_form.js
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { fname, email, phone, full_ph, subject, message, worked } =
    req.body || {};
  const phoneFinal = full_ph || phone || "";

  if (!fname || !email || !phoneFinal || !subject || !message) {
    return res.status(422).send("Заполните все поля.");
  }
  if (isNaN(Number(message)) || Number(message) < 300) {
    return res.status(422).send("Сумма должна быть не меньше 300.");
  }

  const workedRu =
    worked === "yes" ? "Да" : worked === "no" ? "Нет" : "Не указано";

  const text = `Имя и Фамилия: ${fname}
Телефон: ${phoneFinal}
Email: ${email}
Выбранный вариант: ${subject}
Сумма потери: ${message}
Сотрудничество с другими фирмами: ${workedRu}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      subject: `Новый лид с оффера Recovex — ${subject}`,
      text,
      html: text.replace(/\n/g, "<br>"),
      replyTo: email,
    });
    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).send("Mailer error");
  }
};
