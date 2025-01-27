function openOrderPlace(offer_id, success) {
    trackCall(arguments)
    showDialog("products/p2p/order_place", success, function ($scope) {
        addPriceAmountTotal($scope)

        $scope.payment = storage.getString(storageKeys.default_payment_type)
        $scope.payments = window.payment_types

        $scope.place = function () {
            $scope.startRequest()
            getPin(function (pin) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-direct", "order_place", {
                        offer_id: offer_id,
                        address: wallet.address(),
                        amount: $scope.amount,
                        payment: $scope.payment,
                        pass: pass
                    }, function (response) {
                        $scope.finishRequest()
                        showSuccessDialog(str.order_placed, function () {
                            $scope.close()
                            openOrder(response.order_id)
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

        function init() {
            postContract("mfm-direct", "profile", {
                address: wallet.address(),
            }, function (response) {
                $scope.profile = response.profile
            }, function () {
                openPaymentAdd(function () {
                    $scope.payment = storage.getString(storageKeys.default_payment_type)
                    $scope.$apply()
                })
            })
        }

        init()
    })
}