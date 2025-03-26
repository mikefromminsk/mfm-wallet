function openHome($scope) {

    $scope.refresh = function () {
        if ($scope.search_text == "") {
            postContract("mfm-token", "home", {
                filter: "top_exchange",
            }, function (response) {
                $scope.tokens = response.tokens
                $scope.$apply()
            })
        } else {
            postContract("mfm-token", "search", {
                search_text: $scope.search_text,
            }, function (response) {
                $scope.tokens = response.tokens
                $scope.$apply()
            })
        }
    }

    $scope.swipeToRefresh = function () {
        $scope.refresh()
    }

    $scope.selectedTop = "top_exchange"
    $scope.selectTop = function (top) {
        $scope.selectedTop = top
        $scope.refresh()
    }

    $scope.refresh()

    $scope.subscribe("price", function (data) {
        for (const token of $scope.tokens) {
            if (token.domain == data.domain) {
                token.price = data.price
                token.price24 = data.price24
                $scope.$apply()
                break
            }
        }
    })


}