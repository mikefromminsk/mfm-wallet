function openDeposit(domain, success) {
    trackCall(arguments)
    showDialog("deposit", success, function ($scope) {
        $scope.domain = domain

        $scope.blockAddress = function () {
            postContract("mfm-deposit", "deposit_address_block", {
                domain: domain,
                address: wallet.address()
            }, function (response) {
                $scope.deposit_deadline = response.deposit_deadline
                $scope.copy($scope.deposit_address)
                $scope.check('copy_address')
                $scope.refresh()
            })
        }

        function loadToken() {
            postContract("mfm-token", "token", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.token = response.token
                $scope.network = getNetwork(response.token.delegate)
                $scope.deposit_address = getDepositAddress(response.token.delegate)
                $scope.$apply()
            })
        }

        function getNetwork(delegate) {
            let params = new URLSearchParams(delegate)
            if (params.get("n") == "t")
                return "usdt"
            if (params.get("n") == "b")
                return "bitcoin"
            return null
        }

        function getDepositAddress(delegate) {
            let params = new URLSearchParams(delegate)
            return params.get("a")
        }

        function loadLock() {
            postContract("mfm-deposit", "lock", {
                domain: domain,
            }, function (response) {
                $scope.lock = response.lock
                $scope.$apply()
            })
        }

        $scope.refresh = function () {
            loadToken()
            loadLock()
        }

        $scope.refresh()
    })
}