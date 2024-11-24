function openDistribution(domain, success) {
    showDialog('/mfm-wallet/wallet/launch/distribution/index.html', success, function ($scope) {
        $scope.domain = domain

        $scope.mining = function () {
            getPin(function (pin) {
                wallet.calcStartHash(domain, pin, function (next_hash) {
                    postContract("mfm-token", "send.php", {
                        domain: domain,
                        from_address: "owner",
                        to_address: "mining",
                        amount: "0",
                        pass: ":" + next_hash,
                        delegate: "mfm-mining/mint.php",
                    }, function () {
                        calcPass(domain, pin, function (pass) {
                            postContract("mfm-token", "send.php", {
                                domain: domain,
                                from_address: wallet.address(),
                                to_address: "mining",
                                pass: pass,
                                amount: $scope.profile.balance,
                            }, function () {
                                openPro(domain, function () {
                                    $scope.close()
                                    if (success)
                                        success()
                                })
                            })
                        })
                    })
                })
            })
        }

        function init() {
            getProfile(domain, function (response) {
                $scope.profile = response
                $scope.$apply()
            })
        }

        init()
    })
}