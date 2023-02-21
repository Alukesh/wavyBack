<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require "phpmailer/src/Exception.php";
require "phpmailer/src/PHPMailer.php";

$mail = new PHPMailer(true);
$mail ->CharSet = "UTF-8";
$mail ->setLanguage("ru", "phpmailer/language/");
$mail ->IsHTML(true);

$mail->setForm("info@fls.guru", "Мой первый сайт с отправкой формы на PHP");

$mail->addAddress("akenzhebaev422@gmail.com");

$mail->Subject = "Здаров";


$hand = "Правая";
if($_POST["hand"] == "left"){
    $hand = "Левая";
}


$body = "<h1>Встречайте супер письмо</h1>";

if(trim(!empty($_POST["name"]))){
    $body.= "<p><strong>Имя:</strong> ".$_POST["name"]."</p>";
}
if(trim(!empty($_POST["email"]))){
    $body.= "<p><strong>E-mail:</strong> ".$_POST["email"]."</p>";
}
if(trim(!empty($_POST["hand"]))){
    $body.= "<p><strong>Hand:</strong> ".$_POST["hand"]."</p>";
}
if(trim(!empty($_POST["age"]))){
    $body.= "<p><strong>Age:</strong> ".$_POST["age"]."</p>";
}



if(!empty($_FILES["image"]["tmp_name"])){
    $filePath = __DIR__ . "/files/" . $_FILES["image"]["name"];

    if(copy($_FILES["image"]["tmp_name"], $filePath)){
        $fileAttach = $filePath;
        $body.= "<p><strong>Фото в приложении</strong></p>";
        $mail->addAttachment($fileAttach);
    }
}


$mail->Body = $body;

if (!$mail->send()) {
    $message = "Ошибка";
} else {
    $message = "Данные отправлены!";
}

$response = ["message" => $message];

header("Content-type: application/json");
echo json_encode($response);

?>