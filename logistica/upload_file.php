<?php
$fileName = $_FILES["image"]["name"]; // The file name
$fileTmpLoc = $_FILES["image"]["tmp_name"]; // File in the PHP tmp folder
$fileType = $_FILES["image"]["type"]; // The type of file it is
$fileSize = $_FILES["image"]["size"]; // File size in bytes
$fileErrorMsg = $_FILES["image"]["error"]; // 0 for false... and 1 for true

$fileName = $_POST["MovViaje"].'.'.pathinfo($fileName, PATHINFO_EXTENSION);

//echo 'Nuevo Nombre:'.$fileName;

if (!$fileTmpLoc) { // if file not chosen
    //echo "ERROR: Please browse for a file before clicking the upload button.";
    exit();
}
if(move_uploaded_file($fileTmpLoc, "uploads/$fileName")){
    //echo "$fileName upload is complete";
    exit(header("Status: 200 OK"));
} else {
    echo "move_uploaded_file function failed";
}
?>