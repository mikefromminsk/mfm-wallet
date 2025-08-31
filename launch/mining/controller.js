function openLaunchMining(domain, success) {
    showDialog("launch/mining", success, function ($scope) {
        $scope.domain = domain
        $scope.contract = "mining"
        $scope.token = {
            supply_step: 6,
        }

        $scope.selectContract = function () {
            openLaunchContracts(domain, function () {
                $scope.close(domain)
            })
        }

        $scope.launch = function () {
            $scope.startRequest()
            postContract("mfm-token", "send", { // create token
                domain: domain,
                to: wallet.MINING_ADDRESS,
                pass: wallet.calcStartPass(domain, wallet.MINING_ADDRESS),
                delegate: "mfm-contract/mint100",
                amount: Math.pow(10, $scope.token.supply_step),
            }, function () {
                addToWallet(domain, function () {
                    showSuccessDialog(str.your_token_created, function () {
                        $scope.close(domain)
                    })
                }, $scope.finishRequest)
            }, $scope.finishRequest)
        }
    })
}