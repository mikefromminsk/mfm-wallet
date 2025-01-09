function openDistribution(domain, success) {
    showDialog("wallet/launch/distribution", success, function ($scope) {
        $scope.domain = domain
        $scope.amount_step = 6
        $scope.amount = 1000000
        $scope.user_percent = 50;
        $scope.mining_percent = 30;
        $scope.exchange_percent = 10;
        $scope.staking_percent = 10;

        $scope.swipeToRefreshDisable()

        $scope.$watch('amount_step', function (newValue) {
            $scope.amount = Math.pow(10, parseInt(newValue))
        })

        $scope.$watch('user_percent', function (newValue) {
            if ($scope.mining_percent + $scope.exchange_percent == 0) {
                $scope.mining_percent = (100 - newValue) / 3
                $scope.exchange_percent = (100 - newValue) / 3
                $scope.staking_percent = (100 - newValue) / 3
            } else {
                let factor = (100 - newValue) / ($scope.mining_percent + $scope.exchange_percent + $scope.staking_percent)
                $scope.mining_percent *= factor
                $scope.exchange_percent *= factor
                $scope.staking_percent *= factor
                if ($scope.mining_percent < 0) {
                    $scope.mining_percent = 0
                    $scope.exchange_percent = 100 - $scope.user_percent
                }
            }
        })

        $scope.$watch('mining_percent', function (newValue) {
            $scope.mining_percent = newValue
            $scope.user_percent = 100 - ($scope.mining_percent + $scope.exchange_percent + $scope.staking_percent)
            if ($scope.user_percent < 0) {
                $scope.user_percent = 0
                $scope.exchange_percent = 100 - $scope.mining_percent - $scope.staking_percent
            }
        })

        $scope.$watch('exchange_percent', function (newValue) {
            $scope.exchange_percent = newValue
            $scope.user_percent = 100 - ($scope.mining_percent + $scope.exchange_percent + $scope.staking_percent)
            if ($scope.user_percent < 0) {
                $scope.user_percent = 0
                $scope.mining_percent = 100 - $scope.exchange_percent - $scope.staking_percent
            }
        })

        $scope.$watch('staking_percent', function (newValue) {
            $scope.staking_percent = newValue
            $scope.user_percent = 100 - ($scope.mining_percent + $scope.exchange_percent + $scope.staking_percent)
            if ($scope.user_percent < 0) {
                $scope.user_percent = 0
                $scope.staking_percent = 100 - $scope.exchange_percent - $scope.mining_percent
            }
        })

        $scope.launch = function () {
            $scope.startRequest()
            getPin(function (pin) {
                wallet.calcStartHash($scope.domain, pin, function (next_hash) {
                    postContract("mfm-token", "send", {
                        domain: $scope.domain,
                        from: wallet.genesis_address,
                        to: wallet.address(),
                        pass: ":" + next_hash,
                        amount: $scope.amount,
                    }, function () {
                        mining($scope.domain, pin)
                    }, $scope.finishRequest)
                })
            })
        }

        function mining(domain, pin) {
            postContract("mfm-token", "send", {
                domain: domain,
                from: wallet.genesis_address,
                to: wallet.MINING_ADDRESS,
                amount: 0,
                pass: wallet.calcStartPass(domain, wallet.MINING_ADDRESS),
                delegate: "mfm-mining/mint",
            }, function () {
                calcPass(domain, pin, function (pass) {
                    postContract("mfm-token", "send", {
                        domain: domain,
                        from: wallet.address(),
                        to: wallet.MINING_ADDRESS,
                        amount: $scope.round($scope.amount * $scope.mining_percent / 100, 2),
                        pass: pass,
                    }, function () {
                        exchange(domain, pin)
                    }, $scope.finishRequest)
                })
            })
        }

        function exchange(domain, pin) {
            let botAddress = "bot_" + domain
            postContract("mfm-token", "send", {
                domain: domain,
                from: wallet.genesis_address,
                to: botAddress,
                amount: 0,
                pass: wallet.calcStartPass(domain, botAddress),
                delegate: "mfm-exchange/place",
            }, function () {
                calcPass(domain, pin, function (pass) {
                    postContract("mfm-token", "send", {
                        domain: domain,
                        from: wallet.address(),
                        to: botAddress,
                        pass: pass,
                        amount: $scope.round($scope.amount * $scope.exchange_percent / 100, 2)
                    }, function () {
                        staking(domain, pin)
                    }, $scope.finishRequest)
                })
            })
        }

        function staking(domain, pin) {
            postContract("mfm-token", "send", {
                domain: domain,
                from: wallet.genesis_address,
                to: wallet.STAKING_ADDRESS,
                amount: 0,
                pass: wallet.calcStartPass(domain, wallet.STAKING_ADDRESS),
                delegate: "mfm-token/unstake",
            }, function () {
                calcPass(domain, pin, function (pass) {
                    postContract("mfm-token", "send", {
                        domain: domain,
                        from: wallet.address(),
                        to: wallet.STAKING_ADDRESS,
                        pass: pass,
                        amount: $scope.round($scope.amount * $scope.staking_percent / 100, 2)
                    }, function () {
                        showSuccessDialog(str.your_token_created, $scope.close)
                    }, $scope.finishRequest)
                })
            })
        }
    })
}