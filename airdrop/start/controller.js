function openOnboarding(success) {
    trackCall(arguments)
    showDialog("airdrop/start", success, function ($scope) {

        $scope.tasks = [
            {
                title: str.launch_token,
                check: str.your_token_created,
                description: str.launch_your_own_cryptocurrency_in_just_a_few_clicks,
                click: function () {
                    $scope.openLaunchToken($scope.refresh)
                }
            },
            {
                title: str.start_miner,
                check: str.you_start_mining,
                description: str.collect_energy_and_mine_tokens,
                click: function () {
                    $scope.openMiner(wallet.vavilon, $scope.refresh)
                }
            },
            {
                title: str.receive_giveaway,
                check: str.giveaway_received,
                description: str.take_participate_in_giveaways,
                click: function () {
                    $scope.openAirdrop(wallet.vavilon, $scope.refresh)
                }
            },
            {
                title: str.exchange,
                check: str.order_placed,
                description: str.trade_your_assets_on_the_internal_exchange,
                click: function () {
                    $scope.openExchange(wallet.vavilon, true, $scope.refresh)
                }
            },
            {
                title: str.collect_gas,
                check: str.you_block_tokens,
                description: str.earn_passive_income_by_collecting_gas_in_the_network,
                click: function () {
                    $scope.openDividend(wallet.vavilon, $scope.refresh)
                }
            },
        ]

        $scope.next = function () {
            if ($scope.tabIndex + 1 == $scope.tasks.length) {
                $scope.close()
            }
            $scope.tabIndex += 1
        }

        $scope.refresh = function () {
            loadRewards($scope)
        }

        $scope.refresh()
    })
}