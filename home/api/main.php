<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-analytics/utils.php";

$gas_domain = get_required(gas_domain);

$week_ago = (time() - 60 * 60 * 24 * 7);

$response[slides] = selectList("select t2.`domain` from trans t1"
    . " left join tokens t2 on t1.`from` = t2.`owner`"
    . "   and t2.`domain` = (select `domain` from tokens t3 where t3.`owner` = t1.`from` order by t3.`created` desc limit 1)"
    . " where t1.`to` like 'slides'"
    . " order by t1.`time` desc limit 5") ?: [];

$response[tops][top_mining] = selectList("select `domain`, count(*) tran_count from trans"
    . " where `from` like 'mining'"
    . " and `time` > $week_ago"
    . " group by `domain`"
    . " order by tran_count desc limit 8") ?: [];

$response[tops][top_exchange] = selectList("select `domain` from tokens"
    . " where `domain` <> '$gas_domain'"
    . " order by volume24 desc limit 8") ?: [];

$response[tops][top_search] = selectList("select `value`, count(*) found_count from events"
    . " where `type` like 'ui_call'"
    . " and `name` like 'found'"
    . " and `name` <> '$gas_domain'"
    . " and `time` > $week_ago"
    . " group by `value`"
    . " order by found_count desc limit 8") ?: [];

echo json_encode($response);