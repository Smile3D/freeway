<?php
	//****************************************
	//edit here
	$senderName = 'Freeway';
	$senderEmail = 'site@example.com';
	$targetEmail = 'admin@example.com';
	$messageSubject = 'Заявка на участие';
	$redirectToReferer = true;
	$redirectURL = 'thankyou.html';
	//****************************************

	// mail content
	$name = $_POST['Name'];
	$email = $_POST['Email'];
	$phone = $_POST['Phone'];

	// prepare message text
	$messageText =	'Имя: '.$name."\n".
					'Email: '.$email."\n".
					'Телефон: '.$phone."\n";

	// send email
	$senderName = "=?UTF-8?B?" . base64_encode($senderName) . "?=";
	$messageSubject = "=?UTF-8?B?" . base64_encode($messageSubject) . "?=";
	$messageHeaders = "From: " . $senderName . " <" . $senderEmail . ">\r\n"
				. "MIME-Version: 1.0" . "\r\n"
				. "Content-type: text/plain; charset=UTF-8" . "\r\n";

	if (preg_match('/^[_.0-9a-z-]+@([0-9a-z][0-9a-z-]+.)+[a-z]{2,4}$/',$targetEmail,$matches))
	mail($targetEmail, $messageSubject, $messageText, $messageHeaders, $targetEmail);

	// redirect
	if($redirectToReferer) {
		header("Location: ".@$_SERVER['HTTP_REFERER'].'#sent');
	} else {
		header("Location: ".$redirectURL);
	}
?>