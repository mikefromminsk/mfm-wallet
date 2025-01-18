function openHome($scope) {

    function init() {
            postContract("mfm-analytics", "home", {
            empty: true,
        }, function (response) {
            $scope.tops = response.tops
            $scope.showBody = true
            //if (!DEBUG)
            startAnimation()
            $scope.$apply()
        })
    }

    $scope.host = location.host

    $scope.slides = []
    $scope.addSlide = function (title, text, image) {
        $scope.slides.push({
            title: title,
            text: text,
            image: image,
        })
    }
    $scope.addSlide("VAVILON.org", str.first_hashchain_network)
    $scope.addSlide("0%", str.only_miners_pays_fees)
    $scope.addSlide("1000 TPS", str.on_one_core)


    $scope.slideIndex = 0
    $scope.lastAutoIndex = 0

    function startAnimation() {
        if ($scope.interval == null) {
            $scope.interval = setInterval(function () {
                if ($scope.lastAutoIndex != $scope.slideIndex) {
                    clearInterval($scope.interval)
                } else {
                    if (($scope.tops.top_search || []).length > 0){
                        $scope.slideIndex = ($scope.slideIndex + 1) % $scope.tops.top_search.length
                        $scope.lastAutoIndex = $scope.slideIndex
                        $scope.$apply()
                    }
                }
            }, 5000)
        }
    }


    init()
}