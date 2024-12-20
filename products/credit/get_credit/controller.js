function openGetCredit(success) {
    trackCall(arguments)
    showDialog("products/credit/get_credit", success, function ($scope) {
        $scope.pageIndex = 0

        function init() {
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            postContract("mfm-bank", "quiz.php", {
                lang: storage.getString(storageKeys.language, navigator.language.split('-')[0])
            }, function (response) {
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
            let question = $scope.questions[$scope.pageIndex]
            if (question.answer == question.correct) {
                openTab($scope.pageIndex + 1)
            } else {
                openTab($scope.questions.length)
            }
        }

        function openTab(index) {
            $scope.pageIndex = index
            $scope.$apply()
        }

        $scope.$watch('pageIndex', function (newValue, oldValue) {
            if ($scope.questions != null && newValue == $scope.questions.length) {
                swipeToRefresh($scope.close)
                $scope.getRating()
            }
        })

        $scope.getRating = function () {
            postContract("mfm-bank", "rating.php", {
                address: wallet.address(),
                answers: JSON.stringify($scope.questions),
            }, function (response) {
                $scope.pay_off_period_days = response.pay_off_period_days
                $scope.rating = response.rating
                $scope.percent = response.percent
                $scope.$apply()
            })
        }

        $scope.getCredit = function getCredit(rating) {
            trackCall(arguments)
            $scope.startRequest()
            getPin(function (pin) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    postContract("mfm-bank", "owner.php", {
                        redirect: "/mfm-bank/credit.php",
                        address: wallet.address(),
                        pass: pass,
                        answers: JSON.stringify($scope.questions),
                    }, function () {
                        $scope.close()
                    }, $scope.finishRequest)
                }, $scope.finishRequest)
            }, $scope.finishRequest)
        }

        init()
    })
}