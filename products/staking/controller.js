function openStaking(domain, success) {
    trackCall(arguments)
    let rewardTimer = null
    showDialog("products/staking", function () {
        if (rewardTimer)
            clearInterval(rewardTimer)
        if (success)
            success()
    }, function ($scope) {
        $scope.domain = domain
        $scope.staking_address = 'de4e3daf6acddab48fe5cb446e1dc80b'

        $scope.$watch("amount", function () {
            $scope.amount = $scope.round($scope.amount, 4)
        })

        $scope.openStake = function () {
            getPin(function (pin) {
                calcPass(domain, pin, function (pass) {
                    $scope.startRequest()
                    postContract("mfm-token", "stake", {
                        domain: domain,
                        amount: $scope.amount,
                        address: wallet.address(),
                        pass: pass,
                    }, function (response) {
                        showSuccessDialog(str.you_have_staked + " " + $scope.formatAmount(response.staked, domain), init)
                        $scope.finishRequest()
                    }, $scope.finishRequest)
                })
            })
        }

        $scope.openUnstake = function () {
            getPin(function (pin) {
                calcPass(domain, pin, function (pass) {
                    $scope.startRequest()
                    postContract("mfm-token", "unstake", {
                        domain: domain,
                        address: wallet.address(),
                        pass: pass,
                    }, function (response) {
                        $scope.finishRequest()
                        showSuccessDialog(str.you_have_unstaked + " " + $scope.formatAmount(response.unstaked, domain), init)
                    }, $scope.finishRequest)
                })
            })
        }

        $scope.setMax = function () {
            $scope.amount = $scope.account.balance
        }

        function getStakes() {
            postContract("mfm-token", "staked", {
                address: wallet.address(),
            }, function (response) {
                $scope.stake = null
                for (const stake_tran of response.staked) {
                    if (stake_tran.domain == domain) {
                        $scope.stake = stake_tran
                        if (rewardTimer == null)
                            rewardTimer = setInterval(function () {
                                let SEC_IN_DAY = 60 * 60 * 24
                                let period_percent = (new Date() / 1000 - stake_tran.time) / SEC_IN_DAY / $scope.period_days
                                $scope.reward = $scope.stake.amount * response.percent / 100 * period_percent
                                $scope.$apply()
                            }, 1000)
                        break
                    }
                }
                $scope.period_days = response.period_days
                $scope.percent = response.percent
                $scope.$apply()
            })
        }

        function init() {
            getStakes()
            getProfile(domain, function (response) {
                $scope.token = response.token
                $scope.account = response.account
                $scope.$apply()
            })
        }

        init()

    })
}