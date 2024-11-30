function openSend(domain, to_address, amount, success) {
    trackCall(arguments)
    showBottomSheet('/mfm-wallet/wallet/send/index.html', success, function ($scope) {
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

        $scope.send = function () {
            getPin(function (pin) {
                calcPass(domain, pin, function (pass) {
                    postContract("mfm-token", "send.php", {
                        domain: domain,
                        from_address: wallet.address(),
                        to_address: $scope.to_address,
                        pass: pass,
                        amount: $scope.amount,
                    }, function (response) {
                        $scope.back()
                        openTran(response.next_hash, success)
                    }, function (message) {
                        if (message.indexOf("receiver doesn't exist") != -1) {
                            showError("This user dosent exist but you can invite him", function () {
                                openShare(domain, success)
                            })
                        }
                    })
                })
            })
        }

        $scope.$watch('amount', function () {
            $scope.amount = $scope.round($scope.amount, 2)
        })

        $scope.setMax = function () {
            $scope.amount = $scope.token.balance
        }

        function init() {
            getProfile(domain, function (response) {
                $scope.token = response
                $scope.$apply()
            })
        }

        init()
    })
}