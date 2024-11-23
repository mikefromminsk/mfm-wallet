<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-token/utils.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-exchange/utils.php";

onlyInDebug();

requestEquals("/mfm-analytics/init.php");
requestEquals("/mfm-token/init.php");
requestEquals("/mfm-exchange/init.php");

$gas_domain = get_required(gas_domain);
$address = get_required(wallet_admin_address);
$password = get_required(wallet_admin_password);
$token = get_config_required(telegram_bot_token);

// init gas token
tokenRegAccount($gas_domain, $address, $password, 100000000);
tokenRegAccount($gas_domain, user, pass);
trackFill($gas_domain, 1, 1); // 1 USDT = 1 USD

requestEquals("/mfm-data/init.php");

function delegateBalanceToScript($domain, $from_address, $to_address, $script, $password)
{
    $balance = tokenBalance($domain, $from_address);
    if ($balance == null) error("balance is null");
    tokenRegScript($domain, $to_address, $script);
    tokenSendAndCommit($domain, $from_address, $to_address, $balance, $password);
}

function launchList($tokens, $address, $password)
{
    $gas_domain = get_required(gas_domain);
    foreach ($tokens as $domain => $emit_type) {
        if (tokenRegAccount($domain, $address, $password, 1000000)) {
            if ($emit_type == exchange) {
                $bot_address = "bot_spred_" . $domain;
                botScriptReg($domain, $bot_address);
                tokenSendAndCommit($domain, $address, $bot_address, 100, $password);
                tokenSendAndCommit($gas_domain, $address, $bot_address, 100, $password);
            }
            if ($emit_type == mining) {
                delegateBalanceToScript($domain, $address, mining, "mfm-mining/mint.php", $password);
            }
        }
    }
}

$tokens = [
    oak_log => exchange,
];

$token_list = file_get_contents($_SERVER[DOCUMENT_ROOT] . "/mfm-wallet/api/token_list.json");
$token_list = json_decode($token_list, true);

foreach ($token_list as $domain) {
    if ($tokens[$domain] != null) continue;
    $tokens[$domain] = mining;
}

launchList($tokens, $address, $password);

delegateBalanceToScript($gas_domain, $address, bank, "mfm-bank/owner.php", $password);

$htaccess = file_get_contents($_SERVER[DOCUMENT_ROOT] . "/mfm-root/.htaccess");
file_put_contents($_SERVER[DOCUMENT_ROOT] . "/.htaccess", $htaccess);


echo json_encode([success => true]);
