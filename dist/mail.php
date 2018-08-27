<?php


$name = htmlspecialchars($_POST['Name']);
$email = htmlspecialchars($_POST['Email']);
$tel = htmlspecialchars($_POST["Phone"]);
$redirectToReferer = true;
$redirectURL = 'thankyou.html';
// От кого 
$senderEmail = "test_mail@freeway.zzz.com.ua"; // указываем почту хостинга


// Куда 
$targetEmail = "some mail"; 

// Тема
$subject ="Заявка с сайта";

// Заголовок сообщения
$headers = "From: $senderEmail\r\n";
$headers.= "Reply-To: $senderEmail\r\n";
$headers.= "MIME-Version: 1.0\r\n".
$headers.= "Content-type: text/html; charset=utf-8\r\n".
$headers.= "X-Mailer: PHP/" . phpversion();

$message =	'Имя: '.$name."\n".
			'Email: '.$email."\n".
			'Телефон: '.$tel."\n";

mail($targetEmail, $subject, $message, $headers);

// redirect
	if($redirectToReferer) {
		header("Location: ".@$_SERVER['HTTP_REFERER'].'#sent');
	} else {
		header("Location: ".$redirectURL);
	}
?>