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
            }, function (response) {
                showSuccessDialog(str.you_block_tokens, $scope.refresh)
                $scope.finishRequest()
            }, $scope.finishRequest)
        }

        $scope.refresh = function () {
            postContract("mfm-contract", "epoch", {
                address: wallet.address()
            }, function (response) {
                $scope.reward = response.reward
                $scope.all_rewards = response.all_rewards
                $scope.participants = response.participants || {}
                $scope.gas = response.gas
                $scope.transList = response.trans
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.$apply()
            })
        }

        $scope.sumTrans = function () {
            let sum = 0
            for (const tran of $scope.transList || [])
                sum += tran.amount
            return sum
        }

        postContract("mfm-token", "account", {
            domain: wallet.vavilon,
            address: wallet.address(),
        }, function (response) {
            $scope.account = response.account
            $scope.$apply()
        }, function () {
        })

        $scope.refresh()
    })
}