function addWallet($scope) {
    $scope.menuIndex = 0

    function tokens() {
        postContract("mfm-token", "accounts.php", {
            address: wallet.address(),
        }, function (response) {
            $scope.accounts = response.accounts
            $scope.$apply()
        })
    }

    $scope.getTotalBalance = function () {
        let totalBalance = 0
        if ($scope.accounts != null)
            for (const account of $scope.accounts)
                totalBalance += account.price * account.balance
        return totalBalance
    }

    setTimeout(() => {
        $scope.subscribe("transactions", function (data) {
            if (data.to == wallet.address()) {
                if (data.amount != 0) {
                    showSuccess(str.you_have_received + " " + $scope.formatAmount(data.amount, data.domain))
                    setTimeout(function () {
                        new Audio("/mfm-wallet/dialogs/success/payment_success.mp3").play()
                    })
                }
                tokens()
            }
        })

        $scope.subscribe("price", function (data) {
            if ($scope.accounts != null) {
                for (let account of $scope.accounts) {
                    if (account.domain == data.domain) {
                        account.price = data.price
                        $scope.$apply()
                        break;
                    }
                }
            }
        })
    }, 1000)

    $scope.init = function () {
        get("/mfm-wallet/readme.md", function (text) {
            setTimeout(function () {
                setMarkdown("markdown-container", text)
            }, 1000)
        })
        tokens()
    }

    $scope.init()
}