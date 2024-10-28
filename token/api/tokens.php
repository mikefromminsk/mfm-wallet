<?php
require_once $_SERVER[DOCUMENT_ROOT] . "/mfm-data/utils.php";

$address = get_string(address);
$search_text = get_string(search_text);

$response[result] = [];

function tokenInfo($domain, $address = null)
{
    return [
        domain => $domain,
        price => getCandleLastValue($domain . _price),
        price24 => getCandleChange24($domain . _price) * 100,
        balance => tokenBalance($domain, $address),
    ];
}

if ($address != null) {
    $active_domains = getDomains($address, $search_text);
    foreach ($active_domains as $domain)
        $response[active][] = tokenInfo($domain, $address);

    $rec_domains = getDomains(null, $search_text);
    foreach ($rec_domains as $domain)
        if (!in_array($domain, $active_domains))
            $response[recs][] = tokenInfo($domain, $address);
    usort($response[active], function ($a, $b) {
        return -strcmp($a[balance] * $a[price], $b[balance] * $b[price]);
    });
} else {
    $rec_domains = getDomains(null, $search_text);
    foreach ($rec_domains as $domain)
        $response[recs][] = tokenInfo($domain, $address);
}

commit($response);