function getAccount(domain, success, error) {
    postContract("mfm-token", "profile", {
        domain: domain,
        address: wallet.address(),
    }, success, error)
}

function openTokenProfile(domain, success) {
    trackCall(arguments)
    showDialog("wallet/profile", success, function ($scope) {
        $scope.domain = domain

        addChart($scope, domain + "_pool_price", domain + "_pool_volume")
        addTokenProfile($scope, domain)

        $scope.subscribe("price:" + domain, function (data) {
            $scope.token.price = data.price
            $scope.updateChart()
            $scope.$apply()
        })

        $scope.init = function () {
            $scope.loadTokenProfile(domain)
            postContract("mfm-token", "trans_account", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.trans = $scope.groupByTimePeriod(response.trans)
                $scope.$apply()
            })
        }

        $scope.getMiningYearPercent = function (contract) {
            if (contract == "mfm-contract/mint10")
                return 10;
            if (contract == "mfm-contract/mint20")
                return 20;
            if (contract == "mfm-contract/mint100")
                return 100;
            return 0;
        }


        $scope.init()
    })
}

function addTokenProfile($scope) {

    $scope.loadTokenProfile = function (domain) {
        postContract("mfm-token", "token_info", {
            domain: domain,
            address: wallet.address()
        }, function (response) {
            $scope.token = response.token
            $scope.owner = response.owner
            $scope.mining = response.mining
            /*$scope.exchange_bot = response.exchange_bot
            $scope.staking = response.staking*/
            $scope.account = response.account
            $scope.analytics = response.analytics
            $scope.$apply()
        })
    }
}