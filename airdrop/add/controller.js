function openAirdropAdd(domain, success) {
    trackCall(arguments)
    showDialog("airdrop/add", success, function ($scope) {
        $scope.domain = domain
        $scope.budget = null
        $scope.participants = null
        $scope.airdrop = {}

        $scope.add = function () {
            getPin(function (pin) {
                wallet.calcUserPass(domain, pin, function (pass) {
                    postContract("mfm-airdrop", "add", {
                        domain: domain,
                        address: wallet.address(),
                        pass: pass,
                        budget: $scope.budget,
                        participants: $scope.participants,
                        telegram: $scope.airdrop.telegram,
                        language: $scope.airdrop.language,
                    }, function () {
                        showSuccessDialog(str.giveaway_created, $scope.close)
                    })
                })
            })
        }

        $scope.checkTokenName = function () {
            if (!$scope.airdrop.telegram) return null;
            return $scope.airdrop.telegram.indexOf(domain) != -1
        }

        $scope.setMax = function () {
            $scope.budget = $scope.account.balance
        }

        $scope.setParticipants = function (count) {
            $scope.participants = count
        }

        $scope.setLanguage = function (language) {
            $scope.airdrop.language = language
        }

        function loadToken() {
            getToken(domain, function (response) {
                $scope.token = response.token
                $scope.account = response.account
                $scope.$apply()
            })
        }

        function loadAirdrop() {
            postContract("mfm-airdrop", "get", {
                domain: domain,
            }, function (response) {
                $scope.airdrop = response.airdrop
                $scope.$apply()
            })
        }

        $scope.refresh = function () {
            loadToken()
            loadAirdrop()
        }

        $scope.refresh()
    })
}