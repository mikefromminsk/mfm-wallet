function openDividend(domain, success) {
    trackCall(arguments)
    showDialog("dividend", success, function ($scope) {
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
                showSuccessDialog(str.you_block_tokens, $scope.refresh)
            })
        }

        function loadEpoch() {
            postContract("mfm-contract", "epoch", {
                address: wallet.address()
            }, function (response) {
                $scope.reward = response.reward
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

        function loadVavilonAccount() {
            postContract("mfm-token", "account", {
                domain: wallet.vavilon,
                address: wallet.address(),
            }, function (response) {
                $scope.account = response.account
                $scope.$apply()
            }, function () {
            })
        }

        $scope.refresh = function () {
            loadEpoch()
            loadVavilonAccount()
            loadRewards(function (rewardsReceived) {
                $scope.rewardsReceived = rewardsReceived
                $scope.$apply()
            })
        }

        $scope.refresh()
    })
}