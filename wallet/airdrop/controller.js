function openDrop(domain, success) {
    showDialog("wallet/airdrop", success, function ($scope) {
        domain = domain || wallet.gas_domain
        $scope.domain = domain
        $scope.receivers = 3
        $scope.promoCode = ""

        $scope.$watch("amount", function () {
            $scope.amount = $scope.round($scope.amount, 4)
        })

        $scope.create = function () {
            let password = md5($scope.promoCode)
            let address = md5(password)
            $scope.startRequest()
            postContract("mfm-token", "send", {
                domain: domain,
                from: wallet.genesis_address,
                to: address,
                amount: 0,
                pass: wallet.calcStartPass(domain, address, password),
                delegate: "mfm-token/airdrop/receive" + $scope.receivers,
            }, function () {
                getPin(function (pin) {
                    calcPass(domain, pin, function (pass) {
                        postContract("mfm-token", "send", {
                            domain: domain,
                            from: wallet.address(),
                            to: address,
                            pass: pass,
                            amount: $scope.amount
                        }, function () {
                            let link = location.origin + "/mfm-wallet#openPromo=" + domain + ":" + $scope.promoCode
                            showSuccessDialog(str.promo_link_was_generated, async () => {
                                try {
                                    await navigator.share({
                                        title: str.share,
                                        text: str.click_on_the_link_and_win + " " + $scope.amount + " " + $scope.formatDomain(domain),
                                        url: link,
                                    });
                                    $scope.close()
                                } catch (err) {
                                }
                            }, str.share)
                        }, $scope.finishRequest)
                    }, $scope.finishRequest)
                }, $scope.finishRequest)
            }, $scope.finishRequest)
        }

        $scope.copyUrl = function () {
            $scope.copy($scope.link)
        }

        $scope.setMax = function () {
            $scope.amount = $scope.account.balance
        }

        function init() {
            getProfile(domain, function (response) {
                $scope.token = response.token
                $scope.account = response.account
                $scope.$apply()
            })
        }

        subscribe("transactions", function (data) {
            if (data.from == wallet.address()) {
                init()
            }
        })

        init()

        setTimeout(function () {
            document.getElementById('promo').focus()
        }, 500)
    })
}