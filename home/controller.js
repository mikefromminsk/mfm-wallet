function addHome($scope) {
    function init() {
        postContract("mfm-wallet", "home/api/main", {
            empty: true,
        }, function (response) {
            $scope.slides = response.tops.top_exchange
            $scope.tops = response.tops
            $scope.showBody = true
            //if (!DEBUG)
            startAnimation()
            $scope.$apply()
        })
    }


    $scope.openSlide = function (domain) {
        trackCall(arguments)
        openTokenProfile(domain)
        clearInterval($scope.interval)
    }

    $scope.slideIndex = 0
    $scope.lastAutoIndex = 0

    function startAnimation() {
        if ($scope.interval == null) {
            $scope.interval = setInterval(function () {
                if ($scope.lastAutoIndex != $scope.slideIndex) {
                    clearInterval($scope.interval)
                } else {
                    $scope.slideIndex = ($scope.slideIndex + 1) % $scope.tops.top_search.length
                    $scope.lastAutoIndex = $scope.slideIndex
                    $scope.$apply()
                }
            }, 5000)
        }
    }

    init()
}