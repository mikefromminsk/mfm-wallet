function openPromo(promo, success) {
    trackCall(arguments)
    showDialog("wallet/promo", success, function ($scope) {
        $scope.promo = promo

        $scope.parseDomain = function () {
            if ($scope.promo != null && $scope.promo != "")
                $scope.domain = $scope.promo.split(":")[0]
        }

        $scope.receive = function () {
            if ($scope.promo != null && $scope.promo != "") {
                if ($scope.promo.indexOf(":") != -1) {
                    $scope.startRequest()
                    getPin(function (pin) {
                        wallet.reg($scope.domain, pin, function () {
                            postContract("mfm-token", "airdrop/receive3", {
                                domain: $scope.promo.split(":")[0],
                                address: md5(md5($scope.promo.split(":")[1])),
                                receiver: wallet.address(),
                            }, function (response) {
                                $scope.finishRequest()
                                showSuccessDialog(str.you_have_received + " " + $scope.formatAmount(response.received), $scope.close)
                            }, $scope.finishRequest)
                        }, $scope.finishRequest)
                    }, $scope.finishRequest)
                } else {
                    showError("Promo code invalid")
                }
            }
        }

        if (wallet.address() == "") {
            $scope.openLogin()
        } else {
            if (promo == null) {
                setTimeout(function () {
                    document.getElementById("enter_promo").focus()
                }, 100)
            }
        }

        $scope.pressEnter($scope.receive)
    })
}