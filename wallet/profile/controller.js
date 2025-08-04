function getProfile(domain, success, error) {
    postContract("mfm-token", "profile", {
        domain: domain,
        address: wallet.address(),
    }, success, error)
}

function getAccount(domain, success, error) {
    postContract("mfm-token", "account", {
        domain: domain,
        address: wallet.address(),
    }, success, error)
}

function openTokenProfile(domain, success, mode) {
    trackCall(arguments)
    showDialog("wallet/profile", success, function ($scope) {
        $scope.domain = domain

        storage.pushToArray(storageKeys.search_history, domain, 10)
        $scope.recent = storage.getStringArray(storageKeys.search_history).reverse()

        addChart($scope, domain + "_price", domain + "_volume")
        addTokenProfile($scope, domain)

        $scope.subscribe("price:" + domain, function (data) {
            $scope.token.price = data.price
            $scope.updateChart()
            $scope.$apply()
        })

        $scope.getMiningYearPercent = function (contract) {
            if (contract == "mfm-contract/mint10")
                return 10;
            if (contract == "mfm-contract/mint20")
                return 20;
            if (contract == "mfm-contract/mint100")
                return 100;
            return 0;
        }

        $scope.addToWallet = function () {
            getPin(function (pin) {
                wallet.calcStartHash($scope.domain, pin, function (next_hash) {
                    postContract("mfm-token", "send", {
                        domain: $scope.domain,
                        to: wallet.address(),
                        pass: ":" + next_hash,
                    }, function () {
                        if (mode == "airdrop")
                            $scope.close()
                        else
                            $scope.refresh()
                    })
                })
            })
        }

        $scope.refresh = function () {
            $scope.loadTokenProfile(domain)
        }

        $scope.refresh()
    })
}

function addTokenProfile($scope) {
    $scope.loadTokenProfile = function (domain) {
        postContract("mfm-token", "token", {
            domain: domain,
            address: wallet.address()
        }, function (response) {
            $scope.token = response.token
            $scope.owner = response.owner
            $scope.mining = response.mining
            $scope.account = response.account
            $scope.gas_account = response.gas_account
            $scope.analytics = response.analytics
            $scope.$apply()
        })
    }
}