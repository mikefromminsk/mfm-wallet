function createOdometer(el, value) {
    const odometer = new Odometer({
        el: el,
        value: 0,
    });

    let hasRun = false;

    const options = {
        threshold: [0, 0.9],
    };

    const callback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!hasRun) {
                    odometer.update(value);
                    hasRun = true;
                }
            }
        });
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(el);
}

function addWallet($scope) {
    function getTokens() {
        postContract("mfm-token", "accounts.php", {
            address: wallet.address(),
        }, function (response) {
            $scope.accounts = response.accounts
            setTimeout(function () {
                createOdometer(document.getElementById("total"), $scope.getTotalBalance())
            }, 100)
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

    $scope.walletInit = function () {
        get("/mfm-wallet/readme.md", function (text) {
            setTimeout(function () {
                setMarkdown("markdown-container", text)
            }, 1000)
        })
        getTokens()
        getCredits()
    }

    if (wallet.address() == "") {
        openLogin($scope.walletInit)
    } else {
        $scope.walletInit()
    }
}