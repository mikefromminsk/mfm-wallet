function openLaunchDialog(domain, success) {
    showDialog("/mfm-wallet/token/launch/index.html", success, function ($scope) {
            addFormats($scope)
            $scope.domain = domain
            $scope.amount = 1000000
            if (DEBUG) {
                $scope.domain = "super"
            }

            $scope.selectedIndex = 0

            $scope.$watch('domain', function (newValue, oldValue) {
                if (newValue != newValue.toLowerCase())
                    $scope.domain = newValue.toLowerCase()
                if (newValue.match(new RegExp("\\W")))
                    $scope.domain = oldValue
                if (newValue.indexOf(' ') != -1)
                    $scope.domain = oldValue
            })

            $scope.next = function () {
                if ($scope.selectedIndex == 0) {
                    $scope.in_progress = true
                    postContract("mfm-token", "account.php", {
                        domain: $scope.domain,
                        address: "owner",
                    }, function (response) {
                        showError($scope.domain.toUpperCase() + " domain exists")
                        $scope.in_progress = false
                        $scope.$apply()
                    }, function () {
                        $scope.selectedIndex += 1;
                        $scope.checkLaunch()
                    })
                } else if ($scope.selectedIndex == 1) {
                    $scope.checkLaunch()
                }
            }

            $scope.checkLaunch = function () {
                getPin(function (pin) {
                    wallet.calcStartHash($scope.domain, pin, function (next_hash) {
                        postContract("mfm-token", "send.php", {
                            domain: $scope.domain,
                            from_address: "owner",
                            to_address: wallet.address(),
                            pass: ":" + next_hash,
                            amount: 1000000,
                        }, function () {
                            storage.pushToArray(storageKeys.domains, $scope.domain)
                            $scope.startLaunching()
                        })
                    })
                })
            }


            $scope.stages = [
                "Upload contracts",
                "Initializing token",
                "Global registration",
            ]
            $scope.stageIndex = -1
            $scope.in_progress = false
            $scope.startLaunching = function () {
                $scope.in_progress = true
                $scope.stageIndex += 1
                $scope.$apply()
                setTimeout(function () {
                    if ($scope.stageIndex < $scope.stages.length - 1) {
                        $scope.startLaunching()
                    } else {
                        openTokenSettings($scope.domain, success)
                    }
                }, DEBUG ? 100 : 3000)
            }


    })
}
