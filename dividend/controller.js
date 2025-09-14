function openDividend(domain, success) {
    trackCall(arguments)
    showDialog("dividend", null, function ($scope) {
        $scope.domain = domain
        $scope.time = new Date().getTime() / 1000

        $scope.epochFinish = function () {
            $scope.startRequest()
            postContract("mfm-contract", "epoch_finish", {
                "domain": wallet.vavilon,
                "epoch_vavilon_stop_balance": $scope.participants ? $scope.participants.balance : 0
            }, function () {
                showSuccessDialog(str.epoch_finished, $scope.refresh)
                $scope.finishRequest()
            }, $scope.finishRequest)
        }

        $scope.participate = function () {
            openSend(wallet.vavilon, $scope.reward.to, null, function () {
                showSuccessDialog(str.you_block_tokens, function () {
                    if (success)
                        success()
                    $scope.close()
                })
            })
        }

        function loadEpoch() {
            postContract("mfm-contract", "epoch", {
                address: wallet.address()
            }, function (response) {
                $scope.reward = response.reward
                $scope.epoch_number = response.epoch_number
                $scope.all_rewards = response.all_rewards
                $scope.participants = response.participants || {}
                $scope.gas = response.gas
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.transList = response.trans
                $scope.$apply()
            })
        }

        $scope.sumTrans = function () {
            let sum = 0
            for (const tran of $scope.transList || [])
                sum += tran.amount
            return sum
        }

        function loadGasAccount() {
            postContract("mfm-token", "account", {
                domain: wallet.gas_domain,
                address: wallet.address(),
            }, function (response) {
                $scope.gas_account = response.account
                $scope.$apply()
            }, function () {})
        }

        function loadVavilonAccount() {
            postContract("mfm-token", "account", {
                domain: wallet.vavilon,
                address: wallet.address(),
            }, function (response) {
                $scope.account = response.account
                $scope.$apply()
            }, function () {})
        }

        $scope.refresh = function () {
            loadEpoch()
            loadGasAccount()
            loadVavilonAccount()
            loadRewards($scope)
        }

        $scope.refresh()
    })
}