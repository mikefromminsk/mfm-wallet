function openLaunchSimple(domain, success) {
    showDialog("launch/simple", success, function ($scope) {
        $scope.domain = domain
        $scope.supply_step_min = 3
        $scope.supply_step_max = 6
        $scope.supply_step = 6
        $scope.supply = Math.pow(10, 6)
        $scope.contract = "simple"

        $scope.selectContract = function () {
            openLaunchContracts(domain)
        }

        $scope.$watch('supply_step', function (newValue) {
            $scope.supply = Math.pow(10, parseInt(newValue))
        })

        $scope.launch = function () {
            $scope.startRequest()
            getPin(function (pin) {
                postContract("mfm-token", "send", { // create token
                    domain: domain,
                    to: wallet.address(),
                    pass: wallet.calcUserStartPass($scope.domain, pin),
                    amount: $scope.supply
                }, function () {
                    showSuccessDialog(str.your_token_created, function () {
                        $scope.close(domain)
                    })
                }, $scope.finishRequest)
            }, $scope.finishRequest)

        }
    })
}