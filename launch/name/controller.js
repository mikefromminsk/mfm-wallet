function openLaunchToken(success) {
    trackCall(arguments)
    showDialog("launch/name", null, function ($scope) {
        $scope.search_text = ''

        $scope.search = function () {
            if ($scope.search_text.length < 3) {
                $scope.tokens = []
            } else {
                postContract("mfm-token", "search", {
                    search_text: $scope.search_text,
                    size: 1,
                }, function (response) {
                    $scope.tokens = response.tokens
                    $scope.$apply()
                })
            }
        }

        $scope.hasTheSameToken = function () {
            return ($scope.tokens || []).filter(function (token) {
                return token.domain === $scope.search_text;
            }).length == 0;
        }

        $scope.check3Symbuls = function () {
            if (!$scope.search_text) return null;
            return $scope.search_text.length >= 3
        }

        $scope.checkEnglish = function () {
            if (!$scope.search_text) return null;
            return true
        }

        $scope.checkFreeName = function () {
            if (!$scope.search_text) return null;
            return $scope.tokens.length == 0
        }

        $scope.next = function () {
            $scope.close()
            openLogoChange($scope.search_text, success)
        }

        setTimeout(function () {
            document.getElementById('search_input').focus()
        }, 500)
    })
}
