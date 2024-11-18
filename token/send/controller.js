function openSend(domain, to_address, amount, success) {
    trackCall(arguments)
    showBottomSheet('/mfm-wallet/token/send/index.html', success, function ($scope) {
        $scope.domain = domain
        if ((to_address || "") != "") {
            $scope.to_address = to_address
            $scope.block_to_address = true
        }

        if ((amount || "") != "") {
            $scope.amount = amount
        }

        $scope.send = function () {
            getPin(function (pin) {
                calcPass(domain, pin, function (pass) {
                    postContract("mfm-token", "send.php", {
                        domain: domain,
                        from_address: wallet.address(),
                        to_address: $scope.to_address,
                        pass: pass,
                        amount: $scope.getTotal(),
                    }, function () {
                        showSuccessDialog("Sent " + $scope.formatAmount($scope.amount, domain) + " success", success)
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

        $scope.getMax = function () {
            return $scope.round($scope.token.balance / (1 + $scope.token.fee / 100) * 100, 2)
        }

        $scope.setMax = function () {
            $scope.amount = $scope.getMax()
        }

        $scope.getTotal = function () {
            return $scope.round(($scope.amount || 0) * (1 + $scope.token.fee / 100), 2)
        }

        function init() {
            postContract("mfm-token", "profile.php", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.token = response
                $scope.$apply()
            })
        }

        init()
    })
}