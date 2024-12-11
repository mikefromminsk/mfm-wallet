<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-token/utils.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-exchange/utils.php";

onlyInDebug();

requestEquals("/mfm-analytics/init.php");
requestEquals("/mfm-exchange/init.php");
requestEquals("/mfm-token/init.php");

$address = get_required(wallet_admin_address);
$password = get_required(wallet_admin_password);
$token = get_config_required(telegram_bot_token);

// init gas token
tokenRegAccount(gas_domain, $address, $password, 100000000);
tokenRegAccount(gas_domain, user, pass);
tokenSendAndCommit(gas_domain, $address, user, 1000, $password);
tokenRegAccount(gas_domain, support, pass);
trackFill(gas_domain, 1, 1); // 1 USDT = 1 USD
tokenRegAccount(gas_domain, slides, $password);

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
    foreach ($tokens as $domain => $params) {
        $total = $params[total] ?: 1_000_000;
        tokenRegAccount($domain, $address, $password, $total);
        foreach ($params as $name => $value) {
            if ($name == exchange) {
                $bot_address = "bot_spred_" . $domain;
                botScriptReg($domain, $bot_address);
                tokenSendAndCommit($domain, $address, $bot_address, round($total * $value / 100, 2), $password);
                tokenSendAndCommit(gas_domain, $address, $bot_address, 100, $password);
            }
            if ($name == mining) {
                tokenRegScript($domain, mining, "mfm-mining/mint.php");
                tokenSendAndCommit($domain, $address, mining, round($total * $value / 100, 2), $password);
            }
            if ($name == staking) {
                tokenRegScript($domain, staking, "mfm-bank/unstake.php");
                tokenSendAndCommit($domain, $address, staking, round($total * $value / 100, 2), $password);
            }
        }
    }
}

$tokens = [
    diamond => [total => 100_000, mining => 100],
    gold => [total => 1_000_000, mining => 100],
    redstone => [total => 5_000_000, mining => 100],
    iron => [total => 100_000_000, mining => 100], // need 1_000_000_000
    bee_nest => [staking => 90, exchange => 10],
    emerald => [exchange => 100],
];

/*$token_list = file_get_contents($_SERVER[DOCUMENT_ROOT] . "/mfm-wallet/api/token_list.json");
$token_list = json_decode($token_list, true);
foreach ($token_list as $domain) {
    if ($tokens[$domain] != null) continue;
    $tokens[$domain] = mining;
}*/

launchList($tokens, $address, $password);



delegateBalanceToScript(gas_domain, $address, bank, "mfm-bank/owner.php", $password);

$htaccess = file_get_contents($_SERVER[DOCUMENT_ROOT] . "/mfm-root/.htaccess");
file_put_contents($_SERVER[DOCUMENT_ROOT] . "/.htaccess", $htaccess);


echo json_encode([success => true]);
