<?php
include_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-wallet/api/utils.php";
include_once $_SERVER["DOCUMENT_ROOT"] . "/mfm-analytics/utils.php";

$domain = get_required(domain);
$address = get_string(address);

$token[domain] = $domain;
$token[title] = dataGet([wallet, info, $domain, title]);
$token[hide_in_store] = dataGet([wallet, info, $domain, hide_in_store]) == 1;
$token[nodes] = 1;
$tran = tokenFirstTran($domain);
$token[created] = $tran[time];
$token[total] = $tran[amount];
$token[owner] = $tran[to];
$token[circulation] = $tran[amount] - tokenBalance($domain, $token[owner]);
$token[circulation_percent] = $token[circulation] / $tran[amount] * 100;
$token[fee] = 100 - $token[circulation_percent];

$token[description] = dataGet([wallet, info, $domain, description]);
$token[balance] = tokenBalance($domain, $address);
$token[price] = getCandleLastValue($domain . _price);
$token[price24] = getCandleChange24($domain . _price);
$token[trans] = getCandleLastValue($domain . _trans);
$token[addresses] = getCandleLastValue($domain . _addresses);
$token[volume] = getCandleLastValue($domain . _volume);


$token[mcap] = $token[total] * $token[price];


$token[dapps] = [];
foreach (dataKeys([wallet, $domain, packages], 100) as $app_domain) {
    $token[dapps][$app_domain] = [
        hash => dataGet([wallet, $domain, packages, $app_domain, hash]),
    ];
}

$token[pie][blocked] = 0;
$token[pie][unused] = dataGet([$domain, token, $token[owner], amount]);
if (dataGet([$domain, token, $token[owner], script])) {
    $token[pie][unused] = 0;
    $token[pie][blocked] = $token[pie][unused];
}/*
$token[pie][circulation] = $token[total] - $token[pie][unused];
$token[pie][ico] = dataGet([$domain, token, ico, amount]);
$token[pie][bonus] = dataGet([$domain, token, bonus, amount]);

$coin[logo] = dataGet([wallet, info, $domain, logo]);

$coin[pie][deligated] = dataGet([$domain, token, $coin[owner], script]);

rating
coinlib.io
investors
plan whitepaper
lang
socnets

trending
topvolume
toptrades

Потребление 24h
Выпуск 24h

        "contractAddress":"0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
         "tokenName":"PancakeSwap Token",
         "symbol":"Cake",
         "divisor":"18",
         "tokenType":"ERC20",
         "totalSupply":"431889535.843059000000000000",
         "blueCheckmark":"true",
         "description":"PancakeSwap is a yield farming project whereby users can get FLIP (LP token) for staking and get CAKE token as reward. CAKE holders can swap CAKE for SYRUP for additional incentivized staking.",
         "website":"https://pancakeswap.finance/",
         "email":"PancakeSwap@gmail.com",
         "blog":"https://medium.com/@pancakeswap",
         "reddit":"",
         "slack":"",
         "facebook":"",
         "twitter":"https://twitter.com/pancakeswap",
         "bittokentalk":"",
         "github":"https://github.com/pancakeswap",
         "telegram":"https://t.me/PancakeSwap",
         "wechat":"",
         "linkedin":"",
         "discord":"",
         "whitepaper":"",
         "tokenPriceUSD":"23.9300000000"

*/

commit($token);