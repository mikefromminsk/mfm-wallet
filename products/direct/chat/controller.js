function openChat(order_id, success) {
    trackCall(arguments)
    showDialog("products/direct/order", success, function ($scope) {

        $scope.send = function () {
            postContract("mfm-direct", "chat_send", {
                order_id: order_id,
                message: $scope.message
            }, function () {
                $scope.message = ""
                $scope.refresh()
            })
        }

        $scope.refresh = function () {
            postContract("mfm-direct", "chat", {
                order_id: order_id
            }, function (response) {
                $scope.chat = response.chat
            })
        }
        
        $scope.appelation = function () {
            postContract("mfm-direct", "appelation", {
                order_id: order_id
            }, function (response) {
                showSuccessDialog(str.appelation_sent, $scope.refresh)
            })
        }

        $scope.refresh()
    })
}