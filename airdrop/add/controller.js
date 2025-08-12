function openAirdropAdd(domain, success) {
    trackCall(arguments)
    showDialog("airdrop/add", success, function ($scope) {
        $scope.domain = domain
        $scope.budget = null
        $scope.participants = null

        $scope.add = function () {
            getPin(function (pin) {
                calcPass(domain, pin, function (pass) {
                    postContract("mfm-airdrop", "add", {
                        domain: domain,
                        address: wallet.address(),
                        pass: pass,
                        budget: $scope.budget,
                        participants: $scope.participants,
                    }, function () {
                        showSuccessDialog(str.success, $scope.close)
                    })
                })
            })
        }

        $scope.setMax = function () {
            $scope.budget = $scope.account.balance
        }

        $scope.setParticipants = function (count) {
            $scope.participants = count
        }

        getProfile(domain, function (response) {
            $scope.token = response.token
            $scope.account = response.account
            $scope.$apply()
        })

    })
}