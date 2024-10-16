function main($scope) {

    function loadProfile(domain){
        getProfile(domain, function (response) {
            $scope.profile = response
            $scope.$apply()
        })
    }

    $scope.domain = getParam("domain") || 'data'
    loadProfile($scope.domain)
}