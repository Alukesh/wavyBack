<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';




$name = $_POST['name'];
$email = $_POST['email'];
$hand = $_POST['hand'];
$age = $_POST['age'];
$message = $_POST['message'];
$file = $_FILES['myfile'];



// Формирование самого письма
$title = "Заголовок письма";
$body = "
<h2>Новое письмо</h2>
<b>Имя:</b> $name<br>
<b>Почта:</b> $email<br><br>
<b>Сообщение:</b><br>$message
";



// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
    $mail->isSMTP();   
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    // Настройки вашей почты
    $mail->Host       = 'smtp.gmail.com'; // SMTP сервера вашей почты
    $mail->Username   = 'akenzhebaev422@gmail.com'; // Логин на почте
    $mail->Password   = 'lhemkepjyteokljb'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('webmaster@mydomain', 'My Company Kiosk'); // Адрес самой почты и имя отправителя

    // Получатель письма
    // $mail->addAddress('youremail@yandex.ru');  
    $mail->addAddress('akenzhebaev422@gmail.com'); // Ещё один, если нужен

    // Прикрипление файлов к письму
if (!empty($file['name'][0])) {
    for ($ct = 0; $ct < count($file['tmp_name']); $ct++) {
        $uploadfile = tempnam(sys_get_temp_dir(), sha1($file['name'][$ct]));
        $filename = $file['name'][$ct];
        if (move_uploaded_file($file['tmp_name'][$ct], $uploadfile)) {
            $mail->addAttachment($uploadfile, $filename);
            $rfile[] = "Файл $filename прикреплён";
        } else {
            $rfile[] = "Не удалось прикрепить файл $filename";
        }
    }   
}
// Отправка сообщения
$mail->isHTML(true);
$mail->Subject = $title;
$mail->Body = $body;    

// Проверяем отравленность сообщения
if ($mail->send()) {$result = "success";} 
else {$result = "error";}

} catch (Exception $e) {
    $result = "error";
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

// Отображение результата
echo json_encode(["result" => $result, "resultfile" => $rfile, "status" => $status]);

// $mail = new PHPMailer(true);
// $mail ->CharSet = "UTF-8";
// $mail ->setLanguage("ru", "phpmailer/language/");
// $mail ->IsHTML(true);

// $mail->setForm("info@fls.guru", "Мой первый сайт с отправкой формы на PHP");

// $mail->addAddress("akenzhebaev422@gmail.com");

// $mail->Subject = "Здаров";


// $hand = "Правая";
// if($_POST["hand"] == "left"){
//     $hand = "Левая";
// }


// $body = "<h1>Встречайте супер письмо</h1>";

// if(trim(!empty($_POST["name"]))){
//     $body.= "<p><strong>Имя:</strong> ".$_POST["name"]."</p>";
// }
// if(trim(!empty($_POST["email"]))){
//     $body.= "<p><strong>E-mail:</strong> ".$_POST["email"]."</p>";
// }
// if(trim(!empty($_POST["hand"]))){
//     $body.= "<p><strong>Hand:</strong> ".$_POST["hand"]."</p>";
// }
// if(trim(!empty($_POST["age"]))){
//     $body.= "<p><strong>Age:</strong> ".$_POST["age"]."</p>";
// }



// if(!empty($_FILES["image"]["tmp_name"])){
//     $filePath = __DIR__ . "/files/" . $_FILES["image"]["name"];

//     if(copy($_FILES["image"]["tmp_name"], $filePath)){
//         $fileAttach = $filePath;
//         $body.= "<p><strong>Фото в приложении</strong></p>";
//         $mail->addAttachment($fileAttach);
//     }
// }


// $mail->Body = $body;

// if (!$mail->send()) {
//     $message = "Ошибка";
// } else {
//     $message = "Данные отправлены!";
// }

// $response = ["message" => $message];

// header("Content-type: application/json");
// echo json_encode($response);

?>