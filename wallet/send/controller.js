function openSend(domain, to_address, amount, success) {
    trackCall(arguments)
    showBottomSheet("wallet/send", success, function ($scope) {
        $scope.domain = domain
        if ((to_address || "") != "") {
            $scope.to_address = to_address
            $scope.block_to_address = true
        }

        if ((amount || "") != "") {
            $scope.amount = amount
        }

        $scope.$watch('to_address', function (newValue, oldValue) {
            if (newValue == null) return
            if (newValue != newValue.toLowerCase())
                $scope.to_address = newValue.toLowerCase()
            if (newValue.match(new RegExp("\\W")))
                $scope.to_address = oldValue
            if (newValue.indexOf(' ') != -1)
                $scope.to_address = oldValue
        })

        $scope.send = function send(domain) {
            trackCall(arguments)
            $scope.startRequest()
            getPin(function (pin) {
                calcPass(domain, pin, function (pass) {
                    postContract("mfm-token", "send.php", {
                        domain: domain,
                        from_address: wallet.address(),
                        to_address: $scope.to_address,
                        pass: pass,
                        amount: $scope.amount,
                    }, function (response) {
                        storage.pushToArray(storageKeys.send_history, $scope.to_address, 3)
                        $scope.back()
                        openTran(response.next_hash, success)
                    }, $scope.finishRequest)
                })
            })
        }

        $scope.$watch('amount', function () {
            $scope.amount = $scope.round($scope.amount, 2)
        })

        $scope.setMax = function () {
            $scope.amount = $scope.account.balance
        }

        $scope.setToAddress = function (to_address) {
            $scope.to_address = to_address
        }

        function init() {
            $scope.recent = storage.getStringArray(storageKeys.send_history).reverse()
            getProfile(domain, function (response) {
                $scope.token = response.token
                $scope.account = response.account
                $scope.$apply()
            })
        }

        init()
    })
}