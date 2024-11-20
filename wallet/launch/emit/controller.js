function openDelegate(domain, success) {
    showDialog('/mfm-wallet/wallet/launch/emit/index.html', success, function ($scope) {
        $scope.domain = domain

        function init() {
            getProfile(domain, function (response) {
                $scope.profile = response
                $scope.$apply()
            })
        }

        init()
    })
}