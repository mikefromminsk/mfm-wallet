function openShitShop(success) {
    trackCall(arguments)
    showDialog("crafting/shit", success, function ($scope) {
        $scope.title = "ShitShop"
        $scope.apps = {
            "base": [{domain: "water"}, {domain: "dick"}],
            "gold": [{domain: "7dicks_soup"}],
        }

        $scope.selectApp = function (link) {
            if (link[0] == "/") {
                window.open(link, '_blank');
            } else if (typeof link === "function") {
                link()
            } else {
                postContract("mfm-token", "profile", {
                    domain: link
                }, function (response) {
                    if (response.supply.delegate?.startsWith("mfm-contract/craft")) {
                        openRecipe(link)
                    } else {
                        openProfile(link)
                    }
                })
            }
        }
    })
}