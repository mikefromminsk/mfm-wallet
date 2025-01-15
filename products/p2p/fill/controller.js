function openP2PFill(order, success) {
    trackCall(arguments)
    showDialog("products/p2p/fill", success, function ($scope) {
        addExchange($scope, order.domain, order.is_sell)

        $scope.price = order.price
        $scope.amount = order.amount
        $scope.total = order.total

        $scope.placeP2P = function () {
            trackCall(arguments)
            $scope.startRequest()
            getPin(function (pin) {
                calcPassList([order.domain, wallet.gas_domain], pin, function (passes) {
                    postContract("mfm-exchange", "place", {
                        order_type: "limit",
                        domain: order.domain,
                        is_sell: order.is_sell ? 0 : 1,
                        address: wallet.address(),
                        price: order.price,
                        amount: $scope.amount,
                        total: $scope.total,
                        pass: passes[$scope.is_sell ? order.domain : wallet.gas_domain]
                    }, function () {
                        $scope.finishRequest()
                        showSuccessDialog(str.order_placed, $scope.loadOrderbook)
                    }, $scope.finishRequest)
                })
            }, $scope.finishRequest)
        }
    })
}