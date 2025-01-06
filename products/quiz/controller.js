function openGetCredit(success) {
    trackCall(arguments)
    showDialog("products/quiz", success, function ($scope) {
        $scope.pageIndex = 0

        function init() {
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            post("/mfm-wallet/products/quiz/text/" +
                storage.getString(storageKeys.language, navigator.language.split('-')[0]) + ".json", {},
                function (response) {
                    $scope.questions = []
                    for (const level of response) {
                        let question = level.questions[Math.floor(Math.random() * level.questions.length)]
                        question.answers = shuffleArray(question.answers)
                        $scope.questions.push(question)
                    }
                    $scope.$apply()
                })
        }

        $scope.setAnswer = function (item, answer) {
            item.answer = answer
            setTimeout(function () {
                $scope.next()
            }, 500)
        }

        $scope.next = function () {
            let question = $scope.questions[$scope.pageIndex - 1]
            if (question.answer == question.correct) {
                $scope.openTab($scope.pageIndex + 1)
            } else {
                $scope.openTab($scope.questions.length + 1)
            }
            $scope.$apply()
        }

        $scope.openTab = function(index) {
            $scope.pageIndex = index
        }

        $scope.$watch('pageIndex', function (newValue, oldValue) {
            if ($scope.questions != null && newValue == $scope.questions.length) {
                swipeToRefresh($scope.close)
                $scope.getRating()
            }
        })

        $scope.getRating = function () {
            $scope.rating = 0;
            for (let i = 0; i < $scope.questions.length; i++) {
                let answer = $scope.questions[i];
                if (answer.answer === answer.correct) {
                    $scope.rating += i + 1;
                }
            }
            $scope.$apply()
        }

        $scope.getCredit = function getCredit(rating) {
            trackCall(arguments)

        }

        init()
    })
}