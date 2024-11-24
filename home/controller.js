function addHome($scope) {
    $scope.DEBUG = DEBUG

    function init() {
        postContract("mfm-wallet", "home/api/main.php", {}, function (response) {
            $scope.slides = response.slides
            $scope.tops = response.tops
            $scope.showBody = true
            if (!DEBUG)
                startAnimation()
            $scope.$apply()
        })
    }

    $scope.slideIndex = 0
    let interval = null

    function startAnimation() {
        if (interval != null)
            clearInterval(interval)
        interval = setInterval(function () {
            $scope.slideIndex = ($scope.slideIndex + 1) % $scope.slides.length
            $scope.$apply()
        }, 3000)
    }

    init()
}