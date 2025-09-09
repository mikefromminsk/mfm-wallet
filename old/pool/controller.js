function openPool(domain, success) {
    trackCall(arguments)
    showDialog("pool", success, function ($scope) {
        $scope.domain = domain
        $scope.base_amount = null
        $scope.quote_amount = null

        $scope.price = 0
        $scope.pool_token = 0
        $scope.pool_gas = 0
        $scope.tvl = 0
        $scope.price_impact = 0

        $scope.base_balance = 0
        $scope.quote_balance = 0
        $scope.liquidity_share = 0

        $scope.loadPoolData = function () {
            postContract("mfm-contract", "pool_impact", {
                domain: $scope.domain
            }, function (response) {
                $scope.price = response.price
                $scope.pool_token = response.pool_token
                $scope.pool_gas = response.pool_gas
                $scope.price_impact = 0
                $scope.loadUserBalances()
            })
        }

        $scope.loadUserBalances = function () {
            getToken($scope.domain, function (response) {
                $scope.base_balance = response.account.balance
                $scope.$apply()
            })
            getToken(wallet.gas_domain, function (response) {
                $scope.quote_balance = response.account.balance
                $scope.$apply()
            })
        }

        $scope.setMaxBase = function () {
            $scope.base_amount = $scope.base_balance
        }

        $scope.setMaxQuote = function () {
            $scope.quote_amount = $scope.quote_balance
        }

        $scope.setTab = function (index) {
            $scope.selectedIndex = index
        }

        function addSwap() {
            $scope.is_sell = 1

            $scope.calculateSwap = function () {
                if (!$scope.base_amount || $scope.base_amount <= 0) {
                    $scope.quote_amount = null
                    return
                }
                postContract("mfm-contract", "pool_impact", {
                    domain: $scope.domain,
                    is_sell: $scope.is_sell,
                    amount: $scope.base_amount
                }, function (response) {
                    $scope.price_impact = response.price_impact
                    if ($scope.is_sell == 1) {
                        $scope.quote_amount = parseFloat(response.amount_out) || 0
                    }
                    $scope.$apply()
                })
            }

            $scope.calculateBuy = function () {
                if (!$scope.quote_amount || $scope.quote_amount <= 0) {
                    $scope.base_amount = null
                    return
                }
                postContract("mfm-contract", "pool_impact", {
                    domain: $scope.domain,
                    is_sell: 0,
                    amount: $scope.quote_amount
                }, function (response) {
                    $scope.price_impact = parseFloat(response.price_impact) || 0
                    $scope.fee = parseFloat(response.fee) || 0
                    $scope.base_amount = parseFloat(response.amount_out) || 0
                    $scope.$apply()
                })
            }

            $scope.$watch("base_amount", function (newVal) {
                console.log(1)
                if ($scope.is_sell == 1 && newVal > 0) {
                    $scope.calculateSwap()
                }
            })

            $scope.$watch("quote_amount", function (newVal) {
                console.log(2)
                if ($scope.is_sell == 0 && newVal > 0) {
                    $scope.calculateBuy()
                }
            })

            $scope.toggleDirection = function () {
                $scope.is_sell = $scope.is_sell == 1 ? 0 : 1
                if ($scope.is_sell == 1) {
                    $scope.calculateSwap()
                } else if ($scope.quote_amount) {
                    $scope.calculateBuy()
                }
            }

            $scope.executeSwap = function () {
                getPin(function (pin) {
                    wallet.calcUserPassList([$scope.domain, wallet.gas_domain], pin, function (passes) {
                        postContract("mfm-contract", "pool_swap", {
                            is_sell: $scope.is_sell,
                            domain: $scope.domain,
                            token_amount: $scope.base_amount,
                            token_pass: passes[$scope.domain],
                            gas_amount: $scope.quote_amount,
                            gas_address: wallet.address(),
                            gas_pass: passes[wallet.gas_domain]
                        }, function () {
                            showSuccessDialog("Swap completed", function () {
                                $scope.loadPoolData()
                                $scope.base_amount = null
                                $scope.quote_amount = null
                            })
                        })
                    })
                })
            }
        }

        function addLiquidity() {
            $scope.addLiquidity = function () {
                getPin(function (pin) {
                    wallet.calcUserPassList([$scope.domain, wallet.gas_domain], pin, function (passes) {
                        postContract("mfm-contract", "pool_add", {
                            domain: $scope.domain,
                            token_amount: $scope.base_amount,
                            token_pass: passes[$scope.domain],
                            gas_amount: $scope.quote_amount,
                            gas_address: wallet.address(),
                            gas_pass: passes[wallet.gas_domain]
                        }, function () {
                            showSuccessDialog("Liquidity added", function () {
                                $scope.loadPoolData()
                                $scope.base_amount = null
                                $scope.quote_amount = null
                            })
                        })
                    })
                })
            }
        }

        addSwap()
        addLiquidity()

        $scope.loadPoolData()
    })
}