function openPro(domain, success) {
    showDialog('/mfm-wallet/wallet/launch/pro/index.html', success, function ($scope) {
        $scope.domain = domain

        $scope.pro_price = 9.99
        $scope.pro_max_price = 11.99

        $scope.pro = function (pin) {
            function sendToSpredBot() {
                postContract("mfm-exchange", "spred.php", {
                    domain: domain,
                }, function () {
                    let sendDomain = false
                    let sendGas = false

                    function checkFinish() {
                        if (sendDomain && sendGas) {
                            $scope.finish()
                        }
                    }

                    wallet.calcPass(domain, pin, function (pass) {
                        postContract("mfm-token", "send.php", {
                            domain: domain,
                            from_address: wallet.address(),
                            to_address: "bot_spred_" + domain,
                            amount: 1000,
                            pass: pass,
                        }, function () {
                            sendDomain = true
                            checkFinish()
                        })
                    })
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
                        amount: $scope.pro_max_price - $scope.pro_price,
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