function openSendDialog(domain, to_address, amount, success) {
    showBottomSheet('/mfm-wallet/token/send/index.html', success, function ($scope) {
        addFormats($scope)
        $scope.domain = domain
        if ((to_address || "") != "") {
            $scope.to_address = to_address
            $scope.block_to_address = true
        }

        if ((amount || "") != "") {
            $scope.amount = amount
        }

        $scope.send = function () {
            if (!$scope.to_address || !$scope.amount) {
                return
            }
            getPin(function (pin) {
                calcPass(domain, pin, function (pass) {
                    postContract("mfm-token", "send.php", {
                        domain: domain,
                        from_address: wallet.address(),
                        to_address: $scope.to_address,
                        pass: pass,
                        amount: $scope.amount,
                    }, function () {
                        showSuccessDialog("Sent " + $scope.formatAmount($scope.amount, domain) + " success", success)
                    }, function (message) {
                        if (message.indexOf("receiver doesn't exist") != -1) {
                            showInfoDialog("This user dosent exist but you can invite him", function () {
                                openShare(domain, success)
                            })
                        }
                    })
                })
            })
        }

        $scope.getMax = function () {
            return $scope.token.balance
        }

        $scope.setMax = function () {
            $scope.amount = $scope.getMax()
        }

        function init() {
            postContract("mfm-wallet", "api/profile.php", {
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