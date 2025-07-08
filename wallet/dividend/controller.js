function openDividend(domain, success) {
    trackCall(arguments)
    showDialog("wallet/dividend", success, function ($scope) {
        $scope.domain = domain

        $scope.epochFinish = function () {
            $scope.startRequest()
            postContract("mfm-contract", "epoch_finish", {
                "domain": wallet.vavilon,
                "epoch_vavilon_stop_balance": $scope.epoch_vavilon ? $scope.epoch_vavilon.balance : 0
            }, function (response) {
                showSuccessDialog(str.success, $scope.refresh)
                $scope.finishRequest()
            }, $scope.finishRequest)
        }

        $scope.refresh = function () {
            postContract("mfm-contract", "epoch", {
                address: wallet.address()
            }, function (response) {
                $scope.epoch_tran = response.epoch_tran
                $scope.mining_gas = response.mining_gas
                $scope.epoch_vavilon = response.epoch_vavilon || {}
                $scope.accounts = [response.epoch_vavilon || {}]
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.$apply()
            })
        }

        $scope.refresh()
    })
}