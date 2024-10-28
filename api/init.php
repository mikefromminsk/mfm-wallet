<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-token/utils.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-exchange/utils.php";

onlyInDebug();

$address = get_required(wallet_admin_address);
$password = get_required(wallet_admin_password);
$token = get_config_required(mytoken_space_bot_token);

requestEquals("/mfm-data/init.php", [
    wallet_admin_address => $address,
    wallet_admin_password => $password
]);

function launchList($tokens, $address, $password)
{
    $gas_domain = get_required(gas_domain);
    foreach ($tokens as $token) {
        $domain = $token[domain];
        $amount = $token[amount] ?: 1000000;
        tokenRegAccount($domain, $address, $password, $amount);
        if (isset($token[bot])) {
            foreach ($token[bot] as $strategy => $amount) {
                $bot_address = "bot_" . $strategy . "_" . $domain;
                botScriptReg($domain, $bot_address);
                tokenSendAndCommit($domain, $address, $bot_address, 100, $password);
                tokenSendAndCommit($gas_domain, $address, $bot_address, 100, $password);
            }
        }
        if (isset($token[mining])) {
            tokenRegScript($domain, mining, "mfm-mining/mint.php");
            tokenSendAndCommit($domain, $address, mining, $token[mining], $password);
        }
    }
}

$tokens = [
    [domain => "oak_log", bot => [spred => 100]],
    [domain => "rock", mining => 1000000],
    [domain => "mfm-mining"],

/*    [domain => "oak_log"],
    [domain => "stone"],
    [domain => "chest", recipe => [
        "oak_log" => 8
    ]],*/

];

launchList($tokens, $address, $password);


requestEquals("/mfm-exchange/init.php", [
    wallet_admin_address => $address,
    wallet_admin_password => $password
]);


requestEquals("/mfm-bank/init.php", [
    wallet_admin_address => $address,
    wallet_admin_password => $password
]);


$htaccess = file_get_contents($_SERVER[DOCUMENT_ROOT] . "/mfm-root/.htaccess");
file_put_contents($_SERVER[DOCUMENT_ROOT] . "/.htaccess", $htaccess);


$response[success] = true;

echo json_encode($response, JSON_PRETTY_PRINT);
