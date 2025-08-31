let rewardPassword = hash("nation finger unable fade exist visa arch awake anchor surround paddle riot")
let rewardAddress = hashAddress(rewardPassword)
const maxRewards = 5
const energyReward = 10
let rewardsReceived = maxRewards

function loadRewards(success) {
    postContract("mfm-token", "trans", {
        domain: wallet.gas_domain,
        address: wallet.address(),
        to: rewardAddress,
        size: maxRewards,
    }, (response) => {
        success(rewardsReceived == response.trans.length)
    }, function () {
        success(rewardsReceived == 0)
    })
}


function showSuccessDialog(message, success, action_title) {
    showBottomSheet("success", success, function ($scope) {
        $scope.message = message || str.success
        $scope.title = action_title || str.close
        $scope.get_bonus = false

        new Audio("/mfm-wallet/success/payment_success.mp3").play()

        function checkAndClose() {
            $scope.check(message)
            $scope.back()
        }

        loadRewards(function (rewardsReceived) {
            $scope.rewardsReceived = rewardsReceived
        })

        $scope.getBonusAndClose = function () {
            $scope.startRequest()
            if ($scope.isNotChecked(message)) {
                postContract("mfm-token", "account", {
                    domain: wallet.gas_domain,
                    address: rewardAddress,
                }, (response) => {
                    postContract("mfm-miner", "send", {
                        domain: wallet.gas_domain,
                        from: rewardAddress,
                        pass: wallet.calcPass(wallet.gas_domain, rewardAddress, rewardPassword, response.account.prev_key),
                        to: wallet.address(),
                        amount: $scope.round(energyReward / 100),
                    }, checkAndClose, checkAndClose)
                }, checkAndClose)
            } else {
                checkAndClose()
            }
        }
    })
}