function openSupply(domain, success) {
    showDialog('/mfm-wallet/wallet/launch/liquidity/index.html', success, function ($scope) {
        $scope.domain = domain

        $scope.pro = function (pin) {
            wallet.calcPass(wallet.gas_domain, pin, function (pass) {
                postContract("mfm-token", "send.php", {
                    domain: wallet.gas_domain,
                    from_address: wallet.address(),
                    to_address: "bot_spred_" + domain,
                    amount: $scope.pro_price,
                    pass: pass,
                }, function () {
                    sendGas = true
                    checkFinish()
                })
            })
        }

        $scope.finish = function () {
            showSuccessDialog(str.your_token_created, function () {
                $scope.close()
                if (success)
                    success()
            })
        }

        $scope.askCredit = function (sum, success) {
            if ($scope.profile.balance < sum) {
                $scope.openAskCredit(success)
            } else {
                if (success)
                    success()
            }
        }

        function init() {
            getProfile(wallet.gas_domain, function (response) {
                $scope.profile = response
                $scope.$apply()
            })
        }

        init()
    })
}