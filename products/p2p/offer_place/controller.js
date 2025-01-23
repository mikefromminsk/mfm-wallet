function openOfferPlace(domain, success) {
    trackCall(arguments)
    showDialog("products/p2p/offer_place", success, function ($scope) {
        addPriceAmountTotal($scope, domain, 0)
        $scope.domain = domain

        $scope.place = function () {
            $scope.startRequest()
            getPin(function (pin) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-direct", "offer_place", {
                        domain: domain,
                        address: wallet.address(),
                        price: $scope.price,
                        is_sell: $scope.is_sell ? 1 : 0,
                        amount: $scope.amount,
                        min: ($scope.min_order || 0),
                        max: ($scope.max_order || $scope.amount),
                        pass: pass,
                    }, function () {
                        $scope.finishRequest()
                        showSuccessDialog(str.order_placed, $scope.close)
                    }, $scope.finishRequest)
                }, $scope.finishRequest)
            })
        }

        function init() {
            postContract("mfm-direct", "profile", {
                address: wallet.address(),
            }, function (response) {
                $scope.profile = response.profile
                if (storage.getString(storageKeys.default_payment_type) == "")
                    openPaymentAdd()
            }, function () {
                openPaymentAdd()
            })
        }

        init()
    })
}