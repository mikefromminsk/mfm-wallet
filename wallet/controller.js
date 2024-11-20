function addTokens($scope) {
    $scope.menuIndex = 0

    $scope.login = function () {
        openLogin(init)
    }

    $scope.openTokenProfile = function (domain) {
        openTokenProfile(domain, init)
    }

    $scope.openAccount = function () {
        openAccount(init)
    }

    $scope.openLaunchToken = function () {
        openLaunchToken(init)
    }

    $scope.openDeposit = function () {
        openDeposit(init)
    }

    $scope.openWithdrawal = function () {
        openWithdrawal(init)
    }

    $scope.openSend = function () {
        openSend()
    }

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
        if ($scope.activeTokens != null)
            for (const token of $scope.activeTokens)
                totalBalance += token.price * token.balance
        return totalBalance
    }

    setTimeout(() => {
        $scope.subscribe("transactions", function (data) {
            if (data.to == wallet.address()) {
                if (data.amount != 0) {
                    showSuccess("You have received " + $scope.formatAmount(data.amount, data.domain))
                    setTimeout(function () {
                        new Audio("/mfm-wallet/dialogs/success/payment_success.mp3").play()
                    })
                }
                tokens()
            }
        })

        $scope.subscribe("price", function (data) {
            function updateTokens(tokenList, domain, price) {
                if (tokenList != null)
                    for (let token of tokenList) {
                        if (token.domain == domain) {
                            token.price = price
                            $scope.$apply()
                            break;
                        }
                    }
            }

            updateTokens($scope.activeTokens, data.domain, data.price)
            updateTokens($scope.recTokens, data.domain, data.price)
        })
    }, 1000)

    function init() {
        get("/mfm-wallet/readme.md", function (text) {
            setTimeout(function () {
                setMarkdown("markdown-container", text)
            }, 1000)
        })
        tokens()
    }

    init()
}