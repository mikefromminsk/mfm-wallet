<?php


foreach (glob("iso64/*") as $file_path) {
    $file_name = str_replace("iso64/", "", $file_path);
    $file_name = str_replace(".png", "", $file_name);
    $substr = "_off";
    $new_name = str_replace($substr, "", $file_name);
    if ($new_name != $file_name) {
        rename("iso64/$file_name.png", "iso64/$new_name.png");
    }
}