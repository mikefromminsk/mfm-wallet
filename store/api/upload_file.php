<?php
include_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-wallet/api/utils.php";

$filename = get_required(filename);
$file = get_required(file);

if (!file_put_contents($_SERVER["DOCUMENT_ROOT"] . $filename, $file)) {
    error("Failed to move uploaded file");
}
commit();
