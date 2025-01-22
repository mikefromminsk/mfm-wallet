function openDirectChat(order_id, success) {
    showDialog("products/direct/chat", success, function ($scope) {
        $scope.loadChat = function () {
            postContract("mfm-direct", "chat", {
                order_id: order_id,
            }, function (response) {
                $scope.chat = $scope.groupByTimePeriod(response.chat)
                $scope.$apply()
            })
        }

        $scope.swipeToRefresh = function () {
            $scope.loadChat()
        }

        $scope.swipeToRefresh()

        $scope.send = function () {
            getPin(function (pin) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-direct", "chat_send", {
                        order_id: order_id,
                        address: wallet.address(),
                        message: $scope.message,
                        pass: pass,
                    }, function () {
                        $scope.loadChat()
                    })
                })
            })
        }

        $scope.pressEnter($scope.send)

        setTimeout(function () {
            document.getElementById('chat_input').focus()
        }, 300)
    })
}