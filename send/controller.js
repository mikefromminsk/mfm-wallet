function openSend(domain, to_address, amount, success, project) {
    trackCall(arguments)
    showDialog("send", success, function ($scope) {
        addPriceAmountTotal($scope)

        $scope.domain = domain
        if ((to_address || "") != "") {
            $scope.to_address = to_address
            $scope.block_to_address = true
        }

        if ((amount || "") != "") {
            $scope.amount = amount
        }

        $scope.send = function send(domain) {
            trackCall(arguments)
            $scope.startRequest()
            getPin(function (pin) {
                wallet.calcUserPass(domain, pin, function (pass) {
                    postContract(project || "mfm", "send", {
                        domain: domain,
                        from: wallet.address(),
                        to: $scope.to_address,
                        pass: pass,
                        amount: $scope.amount
                    }, function () {
                        $scope.finishRequest()
                        storage.pushToArray(storageKeys.send_history, $scope.to_address, 3)
                        openTran(pass.split(":")[1], $scope.close)
                    }, $scope.finishRequest)
                }, $scope.finishRequest)
            }, $scope.finishRequest)
        }

        $scope.setMax = function () {
            $scope.amount = $scope.account.balance
        }

        $scope.setToAddress = function (to_address) {
            $scope.to_address = to_address
        }

        function init() {
            $scope.recent = storage.getStringArray(storageKeys.send_history).reverse()
            getAccount(domain, function (response) {
                $scope.account = response.account
                $scope.$apply()
            })
        }

        init()

        setTimeout(function () {
            document.getElementById(!to_address ? 'send_address' : 'send_amount').focus()
        }, 500)
    })
}