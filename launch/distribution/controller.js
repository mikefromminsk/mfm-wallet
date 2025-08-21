function openDistribution(domain, success) {
    showDialog("launch/distribution", success, function ($scope) {
        $scope.domain = domain
        $scope.supply_step_min = 3
        $scope.supply_step_max = 6
        $scope.supply_step = 6
        $scope.supply = Math.pow(10, 6)
        $scope.swipeToRefreshDisable()

        $scope.$watch('supply_step', function (newValue) {
            $scope.supply = Math.pow(10, parseInt(newValue))
        })

        $scope.launch = function () {
            $scope.startRequest()
            postContract("mfm-token", "send", { // create token
                domain: domain,
                to: wallet.MINING_ADDRESS,
                pass: wallet.calcStartPass(domain, wallet.MINING_ADDRESS),
                delegate: "mfm-contract/mint100",
                amount: $scope.supply,
            }, function () {
                getPin(function (pin) { // add to wallet
                    wallet.calcStartHash($scope.domain, pin, function (next_hash) {
                        postContract("mfm-token", "send", {
                            domain: $scope.domain,
                            to: wallet.address(),
                            pass: ":" + next_hash,
                        }, function () {
                            showSuccessDialog(str.your_token_created, function () {
                                $scope.close(domain)
                            })
                        }, $scope.finishRequest)
                    }, $scope.finishRequest)
                }, $scope.finishRequest)
            }, $scope.finishRequest)
        }
    })
}