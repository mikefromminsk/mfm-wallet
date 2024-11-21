<?php

$tokens = [];
foreach (glob("iso64/*") as $file_path) {
    $file_name = str_replace("iso64/", "", $file_path);
    $file_name = str_replace(".png", "", $file_name);
    $tokens[] = $file_name;
}

echo json_encode($tokens, JSON_PRETTY_PRINT);