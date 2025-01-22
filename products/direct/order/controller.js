function openDirectFill(order_id, success) {
    trackCall(arguments)
    showDialog("products/direct/order", success, function ($scope) {

        $scope.sentMoney = function () {
            $scope.startRequest()
            getPin(function (pin) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-direct", "order_sent", {
                        order_id: order_id,
                        pass: pass
                    }, function () {
                        $scope.finishRequest()
                        showSuccessDialog(str.status_updated, $scope.refresh)
                    }, $scope.finishRequest)
                })
            })
        }

        $scope.finishOrder = function () {
            $scope.startRequest()
            getPin(function (pin) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-direct", "order_finish", {
                        order_id: order_id,
                        pass: pass
                    }, function () {
                        $scope.finishRequest()
                        showSuccessDialog(str.status_updated, $scope.refresh)
                    }, $scope.finishRequest)
                })
            })
        }

        $scope.cancelOrder = function () {
            openAskSure(str.are_you_sure, str.yes, str.no, function () {
                postContract("mfm-direct", "order_cancel", {
                    order_id: order_id
                }, function () {
                    showSuccessDialog(str.status_updated, $scope.refresh)
                })
            })
        }

        $scope.refresh = function () {
            postContract("mfm-direct", "order", {
                order_id: order_id
            }, function (response) {
                $scope.order = response.order
                $scope.$apply()
            })
        }

        $scope.refresh()
    })
}