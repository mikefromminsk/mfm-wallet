function openDistribution(domain, success) {
    showDialog("launch/distribution", success, function ($scope) {
        $scope.domain = domain
        $scope.amount_step = 6
        $scope.amount = 10000
        $scope.mining_percent = 20
        $scope.swipeToRefreshDisable()

        $scope.$watch('amount_step', function (newValue) {
            $scope.amount = Math.pow(10, parseInt(newValue))
        })

        $scope.launch = function () {
            $scope.startRequest()
            postContract("mfm-token", "send", { // create token
                domain: domain,
                to: wallet.MINING_ADDRESS,
                pass: wallet.calcStartPass(domain, wallet.MINING_ADDRESS),
                delegate: "mfm-contract/mint" + $scope.mining_percent,
                amount: $scope.amount,
            }, function () {
                getPin(function (pin) { // add to wallet
                    wallet.calcStartHash($scope.domain, pin, function (next_hash) {
                        postContract("mfm-token", "send", {
                            domain: $scope.domain,
                            to: wallet.address(),
                            pass: ":" + next_hash,
                        }, function () {
                            showSuccessDialog(str.your_token_created, $scope.close)
                        }, $scope.finishRequest)
                    }, $scope.finishRequest)
                }, $scope.finishRequest)
            }, $scope.finishRequest)
        }

        $scope.setMiningPercent = function (percent) {
            $scope.mining_percent = percent
        }
    })
}