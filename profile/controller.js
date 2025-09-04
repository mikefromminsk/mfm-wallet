function getToken(domain, success, error) {
    postContract("mfm-token", "token", {
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

function openProfile(domain, success, mode) {
    trackCall(arguments)
    showDialog("profile", success, function ($scope) {
        $scope.domain = domain

        storage.pushToArray(storageKeys.search_history, domain, 10)
        $scope.recent = storage.getStringArray(storageKeys.search_history).reverse()

        $scope.isMiningToken = function () {
            return $scope.supply?.delegate?.startsWith("mfm-contract/mint")
        }

        $scope.isCraftToken = function () {
            return $scope.supply?.delegate?.startsWith("mfm-contract/craft")
        }

        $scope.isSimpleToken = function () {
            return $scope.supply?.delegate == ''
        }

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
            addToWallet(domain, function () {
                if (mode == "airdrop")
                    $scope.close()
                else
                    $scope.refresh()
            })
        }

        function loadTopAccounts() {
            postContract("mfm-token", "accounts_top", {
                domain: domain,
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

        $scope.refresh = function () {
            loadProfile()
            loadTopAccounts()
        }

        $scope.refresh()
    }, function ($scope) {
        addChart($scope, 'exchange', $scope.domain + "_price", $scope.domain + "_volume")
    })
}

function addToWallet(domain, success, error) {
    getPin(function (pin) {
        wallet.calcStartHash(domain, pin, function (next_hash) {
            postContract("mfm-token", "send", {
                domain: domain,
                to: wallet.address(),
                pass: ":" + next_hash,
            }, success, error)
        })
    })
}