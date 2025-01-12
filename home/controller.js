function addHome($scope) {
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
    $scope.addSlide("VAVILON.org", "Innovate HashChain network.")
    $scope.addSlide("0% fees", "Only miners pays fees.")
    $scope.addSlide("1000 TPS", "HashChain solve scale problems.")


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

    get("/mfm-wallet/docs/white_paper.md", function (text) {
        setMarkdown("white_paper", text)
    })

    init()
}