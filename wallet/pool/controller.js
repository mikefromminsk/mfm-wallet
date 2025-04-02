function openPool(domain, success) {
    trackCall(arguments)
    showDialog("wallet/pool", success, function ($scope) {
        $scope.domain = domain || "vavilon";

        $scope.base_amount = null
        $scope.quote_amount = null
        $scope.is_sell = 1
        $scope.selectedIndex = 0

        $scope.$watch("base_amount", function (newValue) {
            if (newValue != null && $scope.is_sell == 1)
                $scope.quote_amount = $scope.round($scope.base_amount * ($scope.pool.price || 1))
        })

        $scope.$watch("quote_amount", function (newValue) {
            if (newValue != null && $scope.is_sell == 0) {
                $scope.base_amount = $scope.round(newValue / ($scope.pool.price || 1))
                if ($scope.base_amount > $scope.base.balance)
                    $scope.base_amount = $scope.base.balance
            }
        })

        $scope.toggleIsSell = function () {
            $scope.is_sell = $scope.is_sell == 1 ? 0 : 1
        }

        function updatePrice() {
            postContract("mfm-contract", "pool_impact", {
                is_sell: $scope.is_sell,
                domain: $scope.domain,
                amount: $scope.base_amount || 0,
            }, function (response) {
                $scope.pool = response
                $scope.$apply()
            })
        }

        $scope.setTab = function (tab) {
            $scope.selectedIndex = tab
            init()
        }

        $scope.swap = function () {
            getPin(function (pin) {
                calcPassList([$scope.domain, wallet.gas_domain], pin, function (passes) {
                    postContract("mfm-contract", "pool_swap", {
                        is_sell: $scope.is_sell,
                        domain: $scope.domain,
                        token_amount: $scope.base_amount,
                        token_pass: passes[$scope.domain],
                        gas_amount: $scope.quote_amount,
                        gas_address: wallet.address(),
                        gas_pass: passes[wallet.gas_domain],
                    }, function () {
                        showSuccessDialog("Swap finished", init)
                    })
                })
            })
        }

        $scope.addLiquidity = function () {
            getPin(function (pin) {
                calcPassList([$scope.domain, wallet.gas_domain], pin, function (passes) {
                    postContract("mfm-contract", "pool_add", {
                        domain: $scope.domain,
                        token_amount: $scope.base_amount,
                        token_pass: passes[$scope.domain],
                        gas_amount: $scope.quote_amount,
                        gas_pass: passes[wallet.gas_domain],
                        gas_address: wallet.address(),
                    }, function () {
                        showSuccessDialog("Liquidity added", init)
                    })
                })
            })
        }

        $scope.setMaxBase = function () {
            $scope.base_amount = $scope.base.balance
        }

        $scope.setMaxQuote = function () {
            $scope.quote_amount = $scope.quote.balance
        }

        function init() {
            getAccount($scope.domain, function (response) {
                $scope.base = response.account
                $scope.$apply()
            })
            getAccount(wallet.gas_domain, function (response) {
                $scope.quote = response.account
                $scope.$apply()
            })
            updatePrice()
        }

        init()
    })
}