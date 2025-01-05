function openPayOffCredit(success) {
    trackCall(arguments)
    showDialog("products/credit/pay_off_credit", success, function ($scope) {

        function getCredits() {
            postContract("mfm-token", "trans", {
                domain: wallet.gas_domain,
                from: wallet.address(),
                to: $scope.bank_address,
            }, function (response) {
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.credit = 0
                $scope.pay_off = 0
                for (const tran of response.trans) {
                    if (tran.from == $scope.bank_address)
                        $scope.credit += tran.amount
                    if (tran.to == $scope.bank_address)
                        $scope.pay_off += tran.amount
                }
                $scope.$apply()
            })
        }

        $scope.payOffCredit = function () {
            $scope.openSend(wallet.gas_domain, $scope.bank_address, $scope.amount, close)
        }

        function init() {
            getCredits()
        }

        init()

    })
}