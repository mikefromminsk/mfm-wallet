function addTokens($scope) {
    $scope.searchMode = false
    $scope.menuIndex = 0

    $scope.toggleSearchMode = function () {
        $scope.searchMode = !$scope.searchMode
    }

    if (getParam("domain")) {
        storage.setString(storageKeys.selectedCoin, getParam("domain"))
    }

    $scope.login = function () {
        openLogin(init)
    }

    $scope.selectToken = function (domain) {
        openTokenProfile(domain, init)
    }

    $scope.openAccount = function () {
        openAccount(init)
    }

    $scope.newCoin = function ($event) {
        window.angularEvent = $event
        openLaunchDialog($scope.search_text, init)
    }

    $scope.openDeposit = function () {
        openDeposit(init)
    }

    $scope.openWithdrawal = function () {
        openWithdrawal(init)
    }

    function tokens(search_text) {
        postContract("mfm-wallet", "token/api/tokens.php", {
            address: wallet.address(),
            search_text: search_text || "",
        }, function (response) {
            $scope.activeTokens = response.active
            $scope.recTokens = response.recs
            $scope.showBody = true
            $scope.$apply()
        })
    }

    $scope.search_text = ''
    $scope.$watch('search_text', function (newValue) {
        if (newValue == null) return
        tokens(newValue)
    })

    $scope.getTotalBalance = function () {
        var totalBalance = 0
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


    $scope.mode = "tokens"
    $scope.setMode = function (mode) {
        $scope.mode = mode
        if (mode == "tokens") {
            tokens()
        } else if (mode == "recipes") {
            recipes()
        }
    }

    $scope.recipes = {}

    function recipes() {
        post("/mfm-wallet/token/api/recepes.php", {}, function (response) {
            $scope.recipes = response.recipes
            $scope.$apply()
        })
    }

    function init() {
        $scope.setMode($scope.mode)
        get("/mfm-wallet/readme.md", function (text) {
            setTimeout(function () {
                setMarkdown("markdown-container", text)
            }, 1000)
        })
        tokens()
    }

    /*setTimeout(function () {
        openReviews()
    }, 300)*/

    init()
}