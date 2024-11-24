function openPro(domain, success) {
    showDialog('/mfm-wallet/wallet/launch/pro/index.html', success, function ($scope) {
        $scope.domain = domain

        $scope.pro = function (pin) {
            function sendToSpredBot() {
                wallet.calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-token", "send.php", {
                        domain: wallet.gas_domain,
                        from_address: wallet.address(),
                        to_address: "bot_spred_" + domain,
                        amount: 19.99,
                        pass: pass,
                    }, $scope.finish)
                })
            }

            if (pin) {
                sendToSpredBot(pin)
            } else {
                getPin(function (pin) {
                    sendToSpredBot(pin)
                })
            }
        }

        $scope.proMax = function () {
            getPin(function (pin) {
                wallet.calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-token", "send.php", {
                        domain: wallet.gas_domain,
                        from_address: wallet.address(),
                        to_address: "slides",
                        amount: 20,
                        pass: pass,
                    }, function () {
                        $scope.pro(pin)
                    })
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

        $scope.askCredit = function () {
            if ($scope.profile.balance < 19.99) {
                $scope.openAskCredit($scope.finish)
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