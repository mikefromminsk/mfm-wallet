function openLaunchRecipe(domain, success) {
    showDialog("launch/recipe", success, function ($scope) {
        $scope.domain = domain
        $scope.token = {
            supply_step: 6,
        }
        $scope.contract = "craft"
        $scope.items = [{}]

        $scope.addItem = function () {
            $scope.items.push({})
        }

        $scope.selectContract = function () {
            openLaunchContracts(domain)
        }

        $scope.$watch('supply_step', function (newValue) {
            $scope.supply = Math.pow(10, parseInt(newValue))
        })

        $scope.launch = function () {
            $scope.startRequest()

            let delegate = "mfm-contract/craft?domain=" + domain
            for (let item of $scope.items) {
                delegate += "&" + item.domain + "=" + item.rate
            }
            const contractAddress = hashAddress(delegate)
            const CRAFT_SEED = "card wing home athlete regular post notice paddle isolate zone payment craft"

            postContract("mfm-token", "send", { // create token
                domain: domain,
                to: contractAddress,
                pass: wallet.calcStartPass(domain, contractAddress, CRAFT_SEED),
                delegate: delegate,
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