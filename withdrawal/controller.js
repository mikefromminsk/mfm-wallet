function openWithdrawal(domain, success) {
    trackCall(arguments)
    showDialog("withdrawal", success, function ($scope) {
        $scope.domain = domain
        $scope.commission = 3

        $scope.setMax = function () {
            $scope.amount = $scope.account.balance
        }

        function init() {
            getAccount(domain, function (response) {
                $scope.account = response.account
                $scope.$apply()
            })
        }

        $scope.network = function () {
            if (domain == wallet.gas_domain)
                return "tron"
            return domain
        }

        init()
    })
}