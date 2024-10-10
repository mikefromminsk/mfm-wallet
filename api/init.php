<?php

include_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-token/utils.php";

onlyInDebug();

$address = get_required(wallet_admin_address);
$password = get_required(wallet_admin_password);

requestEquals("/mfm-token/init.php", [
    address => $address,
    password => $password
]);

function launchList($tokens, $address, $password)
{
    foreach ($tokens as $token) {
        $domain = $token[domain];
        $amount = $token[amount] ?: 1000000;
        tokenAccountReg($domain, $address, $password, $amount);
    }
}

$tokens = [
    [domain => "rock"],
    [domain => "oak_log"],
    [domain => "stone"],
    [domain => "chest", recipe => [
        "oak_log" => 8
    ]],
];

launchList($tokens, $address, $password);

commit();