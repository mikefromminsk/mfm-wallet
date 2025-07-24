function openWithdrawal(domain, success) {
    trackCall(arguments)
    showDialog("wallet/withdrawal", success, function ($scope) {
            $scope.domain = domain

            $scope.commission = 3;

            $scope.setMax = function () {
                $scope.amount = $scope.account.balance
            }

            function init() {
                getAccount(domain, function (response) {
                    $scope.account = response.account
                    $scope.$apply()
                })
            }

            init()
        }
    )
}