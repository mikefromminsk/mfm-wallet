function openDirectBlock(offer_id, success) {
    trackCall(arguments)
    showDialog("products/direct/block", success, function ($scope) {
        addPriceAmountTotal($scope)

        $scope.place = function () {
            $scope.startRequest()
            getPin(function (pin) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-direct", "order_place", {
                        order_id: offer_id,
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
                }, $scope.finishRequest)
            })
        }

        postContract("mfm-direct", "offer", {
            offer_id: offer_id
        }, function (response) {
            $scope.offer = response.offer
            $scope.changePrice($scope.offer.price)
            $scope.changeAmount($scope.offer.amount)
        })
    })
}