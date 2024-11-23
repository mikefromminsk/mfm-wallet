function addWallet($scope) {
    $scope.menuIndex = 0

    function getTokens() {
        postContract("mfm-token", "accounts.php", {
            address: wallet.address(),
        }, function (response) {
            $scope.accounts = response.accounts
            $scope.$apply()
        })
    }

    function getCredits() {
        postContract("mfm-token", "trans.php", {
            domain: wallet.gas_domain,
            from_address: wallet.address(),
            to_address: $scope.bank_address,
        }, function (response) {
            $scope.credit = 0
            $scope.pay_off = 0
            for (const tran of response.trans) {
                if (tran.from == $scope.bank_address)
                    $scope.credit += tran.amount
                if (tran.to == $scope.bank_address)
                    $scope.pay_off += tran.amount
            }
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
                getTokens()
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
        getTokens()
        getCredits()
    }

    $scope.init()
}