function openP2PChat(order_id, success) {
    trackCall(arguments)
    showDialog("products/p2p/chat", success, function ($scope) {
        $scope.order_id = order_id

        $scope.loadChat = function () {
            postContract("mfm-direct", "chat", {
                order_id: order_id,
            }, function (response) {
                $scope.chat = $scope.groupByTimePeriod(response.chat)
                for (let day of $scope.chat) {
                    day.items.sort((a, b) => a['time'] - b['time'])
                }
                $scope.chat = $scope.chat.sort((a, b) => a['time'] - b['time'])
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
                        $scope.message = ""
                        $scope.loadChat()
                    })
                })
            })
        }

        $scope.subscribe("chat:order:" + order_id, function () {
            $scope.loadChat()
        })

        $scope.pressEnter($scope.send)

        setTimeout(function () {
            document.getElementById('chat_input').focus()
        }, 300)
    })
}