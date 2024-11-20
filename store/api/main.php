<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-analytics/utils.php";

$time = time();

$top_mining = select("select count(*) tran_count, `domain` from trans"
    . " where `from` like 'mining'"
    . " and `time` > " . ($time - 60 * 60 * 24 * 7)
    . " group by `domain`"
    . " order by tran_count desc limit 5");

$top_exchange = select("select count(*) tran_count, `from` from trans"
    . " where `domain` like 'usdt'"
    . " and `from` like 'bot_spred%'"
    . " and `time` > " . ($time - 60 * 60 * 24 * 7)
    . " group by `from`"
    . " order by tran_count desc limit 5");


$response = [];

$response[top_mining] = [];
foreach ($top_mining as $item) {
    $response[top_mining][] = $item[domain];
}

$response[top_exchange] = [];
foreach ($top_exchange as &$item) {
    $response[top_exchange][] = str_replace("bot_spred_", "", $item[from]);
}

echo json_encode($response);