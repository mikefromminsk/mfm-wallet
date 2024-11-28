function openLaunchToken(success) {
    showDialog("/mfm-wallet/wallet/launch/name/index.html", success, function ($scope) {
        $scope.domain = ""
        $scope.amount = 1000000
        if (DEBUG) {
            $scope.domain = "super"
        }

        $scope.$watch('domain', function (newValue, oldValue) {
            if (newValue == null) return
            if (newValue != newValue.toLowerCase())
                $scope.domain = newValue.toLowerCase()
            if (newValue.match(new RegExp("\\W")))
                $scope.domain = oldValue
            if (newValue.indexOf(' ') != -1)
                $scope.domain = oldValue
        })

        $scope.launch = function () {
            getPin(function (pin) {
                wallet.calcStartHash($scope.domain, pin, function (next_hash) {
                    postContract("mfm-token", "send.php", {
                        domain: $scope.domain,
                        from_address: "owner",
                        to_address: wallet.address(),
                        pass: ":" + next_hash,
                        amount: 1000000,
                    }, function () {
                        openLogoChange($scope.domain, function () {
                            $scope.close()
                            if (success)
                                success()
                        })
                    }, function () {
                        showError("Token name exists")
                    })
                })
            })
        }

        setTimeout(function () {
            document.getElementById("launch_name_input").focus()
        }, 500)
    })
}
