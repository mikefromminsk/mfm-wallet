function getToken(domain, success, error) {
    postContract("mfm-token", "token", {
        domain: domain,
        address: wallet.address()
    }, success, error)
}

function getAccount(domain, success, error) {
    postContract("mfm-token", "account", {
        domain: domain,
        address: wallet.address()
    }, success, error)
}

function openProfile(domain, success, mode) {
    trackCall(arguments)
    showDialog("profile", success, function ($scope) {
        $scope.domain = domain

        $scope.subscribe("price:" + domain, function (data) {
            $scope.token.price = data.price
            $scope.updateChart()
            $scope.$apply()
        })

        $scope.isAdmin = function () {
            if ($scope.account && $scope.account.balance > $scope.supply.balance * 0.01
                || DEBUG || wallet.address() == "V3eivE4A91sj1u5o1D4fbKcADJttV") {
                return true
            }
            return false
        }

        $scope.getTokenNetwork = function (token) {
            return new URLSearchParams(token.delegate).get("n")
        }

        $scope.addToWallet = function () {
            addToWallet(domain, function () {
                if (mode == "airdrop")
                    $scope.close()
                else
                    $scope.refresh()
            })
        }

        function loadTopAccounts() {
            postContract("mfm-token", "accounts_top", {
                domain: domain
            }, function (response) {
                $scope.accounts = response.accounts
            })
        }

        function loadProfile() {
            postContract("mfm-token", "profile", {
                domain: domain,
                address: wallet.address()
            }, function (response) {
                $scope.token = response.token
                $scope.supply = response.supply
                $scope.account = response.account
                $scope.gas_account = response.gas_account
                $scope.airdrop = response.airdrop
                $scope.analytics = response.analytics
                $scope.$apply()
            })
        }

        function loadRecommendation() {
            postContract("mfm-analytics", "recommendations", {
                from: domain
            }, function (res) {
                $scope.recommended = res.recommended
                $scope.$apply()
            })
        }

        $scope.selectRecommended = function (domain) {
            openProfile(domain)
        }

        $scope.refresh = function () {
            loadProfile()
            loadRecommendation()
            loadTopAccounts()
        }

        $scope.refresh()
    }, function ($scope) {
        addChart($scope, 'exchange', $scope.domain + "_price", $scope.domain + "_volume")
    })
}

function addToWallet(domain, success, error) {
    getPin(function (pin) {
        postContract("mfm-token", "send", {
            domain: domain,
            to: wallet.address(),
            pass: wallet.calcUserStartPass(domain, pin)
        }, success, error)
    })
}