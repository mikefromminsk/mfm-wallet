function openAirdrop(promo, success) {
    trackCall(arguments)
    showDialog("store/airdrop", success, function ($scope) {
        $scope.promo = promo

        $scope.parseDomain = function () {
            if ($scope.promo != null && $scope.promo != "")
                $scope.domain = $scope.promo.split(":")[0]
        }

        $scope.receive = function () {
            if ($scope.promo.indexOf(":") != -1) {
                let domain = $scope.promo.split(":")[0]
                let promoCode = $scope.promo.split(":")[1]
                $scope.startRequest()
                wallet.airdrop(domain, promoCode, function (response) {
                    showSuccessDialog(str.you_have_received + " " + $scope.formatAmount(response.received), $scope.finishRequest)
                }, function (message) {
                    showError(message)
                    $scope.finishRequest()
                })
            } else {
                showError("Promo code invalid")
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