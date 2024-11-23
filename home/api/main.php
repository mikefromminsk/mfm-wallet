<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-analytics/utils.php";

$gas_domain = get_required(gas_domain);

$time = time();

$response = [];

$top_mining = select("select count(*) tran_count, `domain` from trans"
    . " where `from` like 'mining'"
    . " and `time` > " . ($time - 60 * 60 * 24 * 7)
    . " group by `domain`"
    . " order by tran_count desc limit 5");
$response[top_mining] = [];
foreach ($top_mining as $item) {
    $response[top_mining][] = $item[domain];
}

$top_exchange = select("select count(*) tran_count, `from` from trans"
    . " where `domain` like 'usdt'"
    . " and `from` like 'bot_spred%'"
    . " and `time` > " . ($time - 60 * 60 * 24 * 7)
    . " group by `from`"
    . " order by tran_count desc limit 5");
$response[top_exchange] = [];
foreach ($top_exchange as $item) {
    $response[top_exchange][] = str_replace("bot_spred_", "", $item[from]);
}

$top_search = select("select count(*) found_count, value from events"
    . " where `type` like 'ui_call'"
    . " and `name` like 'found'"
    . " and `time` > " . ($time - 60 * 60 * 24 * 7)
    . " group by `value`"
    . " order by found_count desc limit 6");

$response[top_search] = [];
foreach ($top_search as $item) {
    if ($item[value] != $gas_domain)
        $response[top_search][] = $item[value];
}


echo json_encode($response);