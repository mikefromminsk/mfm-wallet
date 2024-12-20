<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-token/utils.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-exchange/utils.php";

onlyInDebug();


/*requestEquals("/mfm-analytics/init.php");
requestEquals("/mfm-exchange/init.php");
requestEquals("/mfm-token/init.php");*/

$gas_owner = admin;
$password = get_required(admin_password);
$token = get_config_required(telegram_bot_token);

// init gas token
tokenRegAccount(gas_domain, $gas_owner, $password, 100000000);
tokenRegAccount(gas_domain, user, pass);
tokenSendAndCommit(gas_domain, $gas_owner, user, 1000, $password);
tokenRegAccount(gas_domain, support, pass);
trackFill(gas_domain, 1, 1); // 1 USDT = 1 USD
tokenRegAccount(gas_domain, slides, $password);
error(1);
requestEquals("/mfm-data/init.php");

function delegateBalanceToScript($domain, $from_address, $to_address, $script, $password)
{
    $balance = tokenBalance($domain, $from_address);
    if ($balance == null) error("balance is null");
    tokenRegScript($domain, $to_address, $script);
    tokenSendAndCommit($domain, $from_address, $to_address, $balance, $password);
}

function launchList($tokens, $gas_owner, $password)
{
    foreach ($tokens as $domain => $params) {
        $total = $params[total] ?: 1_000_000;
        tokenRegAccount($domain, $gas_owner, $password, $total);
        foreach ($params as $name => $value) {
            if ($name == exchange) {
                $bot_address = "bot_spred_" . $domain;
                botScriptReg($domain, $bot_address);
                tokenSendAndCommit($domain, $gas_owner, $bot_address, round($total * $value / 100, 2), $password);
                tokenSendAndCommit(gas_domain, $gas_owner, $bot_address, 100, $password);
            }
            if ($name == mining) {
                tokenRegScript($domain, mining, "mfm-mining/mint.php");
                tokenSendAndCommit($domain, $gas_owner, mining, round($total * $value / 100, 2), $password);
            }
            if ($name == staking) {
                tokenRegScript($domain, staking, "mfm-bank/unstake.php");
                tokenSendAndCommit($domain, $gas_owner, staking, round($total * $value / 100, 2), $password);
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
    $tokens[$domain] = [total => 1_000_000, mining => 100];
}*/

launchList($tokens, $gas_owner, $password);

$nonce = requestEquals("/mfm-mining/miner.php", [
    domain => diamond,
])[nonce];

tokenRegAccount(diamond, user, $password);
requestEquals("/mfm-mining/mint.php", [
    domain => diamond,
    nonce => $nonce,
    gas_address => user,
    gas_pass => tokenPass(gas_domain, user, $password),
]);

requestEquals("/mfm-exchange/place.php", [
    domain => diamond,
    is_sell => 1,
    address => user,
    price => 1,
    amount => 1,
    total => 1,
    pass => tokenPass(diamond, user, $password),
]);

requestEquals("/mfm-exchange/place.php", [
    domain => diamond,
    is_sell => 0,
    address => user,
    price => 1,
    amount => 1,
    total => 1,
    pass => tokenPass(gas_domain, user, $password),
]);


requestEquals("/mfm-exchange/spred.php", [
    domain => bee_nest,
]);

delegateBalanceToScript(gas_domain, $gas_owner, bank, "mfm-bank/owner.php", $password);

$htaccess = file_get_contents($_SERVER[DOCUMENT_ROOT] . "/mfm-root/.htaccess");
file_put_contents($_SERVER[DOCUMENT_ROOT] . "/.htaccess", $htaccess);

echo json_encode([success => true]);
