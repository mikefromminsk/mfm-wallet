function openDistribution(domain, success) {
    showDialog('/mfm-wallet/wallet/launch/distribution/index.html', success, function ($scope) {
        $scope.domain = domain
        $scope.amount_step = 6
        $scope.amount = 1000000
        $scope.user_percent = 50;
        $scope.mining_percent = 25;
        $scope.exchange_percent = 25;

        $scope.$watch('amount_step', function (newValue) {
            $scope.amount = Math.pow(10, parseInt(newValue))
        })

        $scope.$watch('user_percent', function (newValue) {
            if ($scope.mining_percent + $scope.exchange_percent == 0) {
                $scope.mining_percent = (100 - newValue) / 2
                $scope.exchange_percent = (100 - newValue) / 2
            } else {
                let factor = (100 - newValue) / ($scope.mining_percent + $scope.exchange_percent)
                $scope.mining_percent *= factor
                $scope.exchange_percent *= factor
                if ($scope.mining_percent < 0) {
                    $scope.mining_percent = 0
                    $scope.exchange_percent = 100 - $scope.user_percent
                }
            }
        })

        $scope.$watch('mining_percent', function (newValue) {
            $scope.mining_percent = newValue
            $scope.user_percent = 100 - ($scope.mining_percent + $scope.exchange_percent)
            if ($scope.user_percent < 0) {
                $scope.user_percent = 0
                $scope.exchange_percent = 100 - $scope.mining_percent
            }
        })

        $scope.$watch('exchange_percent', function (newValue) {
            $scope.exchange_percent = newValue
            $scope.user_percent = 100 - ($scope.mining_percent + $scope.exchange_percent)
            if ($scope.user_percent < 0) {
                $scope.user_percent = 0
                $scope.mining_percent = 100 - $scope.exchange_percent
            }
        })

        function showError(message) {
            showError(message)
            $scope.in_progress = false
            $scope.$apply()
        }

        $scope.launch = function () {
            $scope.in_progress = true
            getPin(function (pin) {
                wallet.calcStartHash($scope.domain, pin, function (next_hash) {
                    postContract("mfm-token", "send.php", {
                        domain: $scope.domain,
                        from_address: "owner",
                        to_address: wallet.address(),
                        pass: ":" + next_hash,
                        amount: $scope.amount,
                    }, function () {
                        mining($scope.domain, pin)
                    }, showError)
                })
            })
        }

        function mining(domain, pin) {
            wallet.calcStartHash(domain, pin, function (next_hash) {
                postContract("mfm-token", "send.php", {
                    domain: domain,
                    from_address: "owner",
                    to_address: "mining",
                    amount: "0",
                    pass: ":" + next_hash,
                    delegate: "mfm-mining/mint.php",
                }, function () {
                    calcPass(domain, pin, function (pass) {
                        postContract("mfm-token", "send.php", {
                            domain: domain,
                            from_address: wallet.address(),
                            to_address: "mining",
                            pass: pass,
                            amount: $scope.round($scope.amount * $scope.mining_percent / 100, 2)
                        }, function () {
                            exchange(domain, pin)
                        }, showError)
                    })
                })
            })
        }

        function exchange(domain, pin) {
            postContract("mfm-exchange", "spred.php", {
                domain: domain,
            }, function () {
                wallet.calcPass(domain, pin, function (pass) {
                    postContract("mfm-token", "send.php", {
                        domain: domain,
                        from_address: wallet.address(),
                        to_address: "bot_spred_" + domain,
                        amount: $scope.round($scope.amount * $scope.exchange_percent / 100, 2),
                        pass: pass,
                    }, function () {
                        showSuccessDialog(str.your_token_created, function () {
                            openSpredBot(domain, function () {
                                $scope.close()
                                if (success)
                                    success()
                            })
                        })
                    }, showError)
                })
            })
        }

        function init() {
            getProfile(domain, function (response) {
                $scope.profile = response
                $scope.$apply()
            })
        }

        init()
    })
}