function openAirdropCreate(domain, success) {
    trackCall(arguments)
    showDialog("store/airdrop/create", success, function ($scope) {
        domain = domain || wallet.gas_domain
        $scope.domain = domain
        $scope.dropAmount = 1
        $scope.promoCode = ""

        $scope.$watch("amount", function (newValue) {
            if (newValue != null)
                $scope.amount = $scope.round(newValue, 4)
        })

        $scope.create = function () {
            let password = hash($scope.promoCode)
            let address = hash(password)
            $scope.startRequest()
            postContract("mfm-token", "send", {
                domain: domain,
                to: address,
                pass: wallet.calcStartPass(domain, address, password),
                delegate: "mfm-contract/airdrop" + $scope.dropAmount,
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
                            let link = location.origin + "/mfm-wallet#openAirdrop=" + domain + ":" + $scope.promoCode
                            showSuccessDialog(str.promo_link_was_generated, async () => {
                                $scope.copy(link)
                                try {
                                    await navigator.share({
                                        title: str.share,
                                        text: str.click_on_the_link_and_win + " " + $scope.amount + " " + $scope.formatDomain(domain),
                                        url: link,
                                    });
                                    $scope.close()
                                } catch (err) {
                                }
                            }, str.copy_and_share)
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

        $scope.setDropAmount = function (dropAmount) {
            $scope.dropAmount = dropAmount
        }

        function init() {
            getAccount(domain, function (response) {
                $scope.token = response.token
                $scope.account = response.account
                $scope.$apply()
            })
        }

        subscribe("account:" + wallet.address(), function (data) {
            init()
        })

        init()

        setTimeout(function () {
            document.getElementById('promo').focus()
        }, 500)
    })
}