function openDistribution(domain, success) {
    showDialog("wallet/launch/distribution", success, function ($scope) {
        $scope.domain = domain
        $scope.amount_step = 6
        $scope.amount = 10000
        $scope.mining_percent = 20
        $scope.swipeToRefreshDisable()

        $scope.$watch('amount_step', function (newValue) {
            $scope.amount = Math.pow(10, parseInt(newValue))
        })

        $scope.launch = function (sendAllToMining = true) {
            $scope.startRequest()
            getPin(function (pin) {
                wallet.calcStartHash($scope.domain, pin, function (next_hash) {
                    postContract("mfm-token", "send", {
                        domain: $scope.domain,
                        to: wallet.address(),
                        pass: ":" + next_hash,
                        amount: $scope.amount,
                    }, function () {
                        if (sendAllToMining)
                            mining($scope.domain, pin)
                        else
                            showSuccessDialog(str.your_token_created, $scope.close)
                    }, $scope.finishRequest)
                })
            })
        }

        $scope.setMiningPercent = function (percent) {
            $scope.mining_percent = percent
        }

        function mining(domain, pin) {
            postContract("mfm-token", "send", {
                domain: domain,
                to: wallet.MINING_ADDRESS,
                amount: 0,
                pass: wallet.calcStartPass(domain, wallet.MINING_ADDRESS),
                delegate: "mfm-contract/mint" + $scope.mining_percent,
            }, function () {
                calcPass(domain, pin, function (pass) {
                    postContract("mfm-token", "send", {
                        domain: domain,
                        from: wallet.address(),
                        to: wallet.MINING_ADDRESS,
                        amount: $scope.amount,
                        pass: pass,
                    }, function () {
                        showSuccessDialog(str.your_token_created, $scope.close)
                    }, $scope.finishRequest)
                })
            })
        }
    })
}