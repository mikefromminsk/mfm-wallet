function openDirectBlock(order_id, success) {
    trackCall(arguments)
    showDialog("products/direct/block", success, function ($scope) {
        addPriceAmountTotal($scope)

        $scope.place = function () {
            $scope.startRequest()
            getPin(function (pin) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-direct", "block", {
                        order_id: order_id,
                        address: wallet.address(),
                        amount: $scope.amount,
                        pass: pass
                    }, function (response) {
                        $scope.finishRequest()
                        showSuccessDialog(str.order_placed, function () {
                            $scope.close()
                            openDirectFill(response.order_id)
                        })
                    }, $scope.finishRequest)
                })
            }, $scope.finishRequest)
        }

        postContract("mfm-direct", "order", {
            order_id: order_id
        }, function (response) {
            $scope.order = response.order
            $scope.changePrice($scope.order.price)
            $scope.changeAmount($scope.order.amount)
        })
    })
}