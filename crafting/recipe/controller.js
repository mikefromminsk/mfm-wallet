function openRecipe(domain, success) {
    trackCall(arguments)
    showDialog("crafting/recipe", success, function ($scope) {
        $scope.domain = domain

        $scope.craft = function () {
            getPin(function (pin) {
                wallet.reg(domain, pin, function () {
                    wallet.calcUserPassList(Object.keys($scope.recipe.items), pin, function (passes) {
                        let params = {}
                        for (const domain of Object.keys(passes))
                            params[domain + "Pass"] = passes[domain]
                        post($scope.recipe.recipe, {
                            ...params,
                            is_craft: 1,
                            domain: $scope.recipe.domain,
                            address: wallet.address(),
                        }, loadRecipe)
                    })
                })
            })
        }

        $scope.decraft = function () {
            getPin(function (pin) {
                wallet.calcUserPass($scope.recipe.domain, pin, function (pass) {
                    let params = {}
                    params[$scope.recipe.domain + "Pass"] = pass
                    post($scope.recipe.recipe, {
                        ...params,
                        is_craft: 0,
                        domain: $scope.recipe.domain,
                        address: wallet.address(),
                    }, loadRecipe)
                })
            })
        }


        function loadRecipe() {
            postContract("mfm-craft", "recipe", {
                domain: domain,
                address: wallet.address(),
            }, function (response) {
                $scope.recipe = response.recipe
                $scope.balances = response.recipe.balances
                $scope.$apply()
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

        function loadRecommendation(){
            postContract("mfm-analytics", "recommendations", {
                from: domain,
            }, function(res) {
                $scope.recommended = res.recommended
                $scope.$apply()
            })
        }

        $scope.refresh = function () {
            loadRecipe()
            loadProfile()
            loadRecommendation()
        }

        $scope.refresh()

    })
}