<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        // Берём телефон из phone, а если вдруг есть full_ph — то предпочитаем его
        $name    = trim($_POST['fname'] ?? '');
        $email   = trim($_POST['email'] ?? '');
        $phone   = trim($_POST['full_ph'] ?? ($_POST['phone'] ?? ''));
        $subject = trim($_POST['subject'] ?? '');
        $message = trim($_POST['message'] ?? '');
        $worked  = trim($_POST['worked'] ?? '');

        // Серверная валидация (минимум)
        if ($name === '' || $email === '' || $phone === '' || $subject === '' || $message === '') {
            http_response_code(422);
            echo "Заполните все поля.";
            exit;
        }
        // сумма ≥ 300
        if (!is_numeric($message) || (float)$message < 300) {
            http_response_code(422);
            echo "Сумма должна быть числом не меньше 300.";
            exit;
        }
        // нормализуем worked
        $worked = ($worked === 'yes') ? 'Да' : (($worked === 'no') ? 'Нет' : 'Не указано');

        $emailBody  = "Имя и Фамилия: {$name}\n";
        $emailBody .= "Телефон: {$phone}\n";
        $emailBody .= "Email: {$email}\n";
        $emailBody .= "Выбранный вариант: {$subject}\n";
        $emailBody .= "Сумма потери: {$message}\n";
        $emailBody .= "Сотрудничество с другими фирмами: {$worked}\n";

        // SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = '777vestg@gmail.com';
        $mail->Password   = 'qwbo sbye iuxe ahku';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // корректнее, чем 'tls'
        $mail->Port       = 587;

        // Кодировка и язык
        $mail->CharSet = 'UTF-8';
        $mail->setLanguage('ru');
        $mail->Encoding = 'base64';

        // Recipients
        $mail->setFrom('777vestg@gmail.com', 'EXPERT Lead');
        $mail->addAddress('777vestg@gmail.com', 'Recipient');
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo($email, $name ?: 'Applicant');
        }

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'New Lead from Recovex offer';
        $mail->Body    = nl2br(htmlspecialchars($emailBody, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
        $mail->AltBody = $emailBody;

        $mail->send();
        echo 'ok';
    } else {
        http_response_code(405);
        echo "Invalid request";
    }
} catch (Exception $e) {
    http_response_code(500);
    echo "Mailer Error: {$mail->ErrorInfo}";
}
