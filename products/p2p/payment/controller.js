function openPaymentAdd(success) {
    trackCall(arguments)
    showDialog("products/p2p/payment", success, function ($scope) {

        $scope.payments = [
            "blik",
            "PKObank",
            "USDT TRON TRC20",
        ]

        $scope.paymentAdd = function (payment) {
            getPin(function (pin) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-direct", "payment_add", {
                        address: wallet.address(),
                        payment: payment,
                        pass: pass,
                    }, function () {
                        showSuccess(str.payment_added, $scope.close)
                    })
                })
            })
        }
    })
}