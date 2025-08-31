function openRecipe(domain, success) {
    trackCall(arguments)
    showDialog("crafting/recipe", success, function ($scope) {
        $scope.domain = domain

        $scope.craft = function () {
            getPin(function (pin) {
                calcPassList(Object.keys($scope.recipe.items), pin, function (passes) {
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
        }

        $scope.decraft = function () {
            getPin(function (pin) {
                calcPass($scope.recipe.domain, pin, function (pass) {
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
                $scope.accounts = response.recipe.accounts
                $scope.$apply()
            })
        }

        $scope.refresh = function () {
            loadRecipe()
            loadTokenProfile($scope, domain)
        }

        $scope.refresh()

    })
}