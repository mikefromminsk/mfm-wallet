function openOnboarding(domain, success) {
    trackCall(arguments)
    showDialog("airdrop/start", success, function ($scope) {
        $scope.domain = domain

        $scope.tasks = [
            {
                title: str.launch_token,
                check: str.your_token_created,
                description: str.launch_your_own_cryptocurrency_in_just_a_few_clicks,
                img: 'launcher',
                click: function () {
                    $scope.openLaunchToken($scope.refresh)
                }
            },
            {
                title: str.start_miner,
                check: str.you_start_mining,
                description: str.collect_energy_and_mine_tokens,
                img: 'miner',
                click: function () {
                    $scope.openMiner('vavilon', $scope.refresh)
                }
            },
            {
                title: str.receive_giveaway,
                check: str.giveaway_received,
                description: str.use_the_token_distribution_for_new_users,
                img: 'airdrop',
                click: function () {
                    $scope.openAirdrop('vavilon', $scope.refresh)
                }
            },
            {
                title: str.exchange,
                check: str.order_placed,
                description: str.trade_your_assets_on_the_internal_exchange,
                img: 'swap',
                click: function () {
                    $scope.openExchange('vavilon', true, $scope.refresh)
                }
            },
            {
                title: str.collect_gas,
                check: str.you_block_tokens,
                description: str.earn_passive_income_by_collecting_gas_in_the_network,
                img: 'vavilon',
                click: function () {
                    $scope.openDividend('vavilon', $scope.refresh)
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
            loadRewards(function (rewardsReceived) {
                $scope.rewardsReceived = rewardsReceived
            })
        }

        $scope.refresh()
    })
}