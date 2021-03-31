<?php
	$referer = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);
	$document=$_REQUEST['doc'];
	$spider=$_REQUEST['spider'];

	$pos=strpos($document, '.')
	if($pos !== false){
		$endung=substr($document, $pos+1)
		if ($endung==="html"){
			header('Content-Type: text/html');
		}
		else if ($endung==="pdf"){
			header('Content-Type: application/pdf');
		}
		else{
			exit("not allowed");
		}
		$content=file_get_contents ( $spider.'/'.$document);
		print($content);
	}
?>