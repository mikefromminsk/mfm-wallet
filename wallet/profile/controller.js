function getProfile(domain, success, error) {
    postContract("mfm-token", "profile.php", {
        domain: domain,
        address: wallet.address(),
    }, success, error)
}

function openTokenProfile(domain, success) {
    trackCall(arguments)
    showDialog('/mfm-wallet/wallet/profile/index.html', success, function ($scope) {
        $scope.siteExist = false

        /*checkFileExist("/" + domain + "/index.html", function () {
            $scope.siteExist = true
            $scope.$apply()
        }, function () {
            $scope.siteExist = false
            $scope.$apply()
        })*/

        $scope.openSend = function () {
            openSend(domain, "", "", init)
        }

        $scope.openMining = function () {
            openWeb(location.origin + "/mining/console?domain=" + domain, init)
        }

        $scope.sell = function () {
            openExchange(domain, 1, init)
        }

        $scope.buy = function () {
            openExchange(domain, 0, init)
        }

        $scope.openDeposit = function () {
            openDeposit()
        }

        $scope.openSite = function () {
            window.open("/" + domain)
        }

        $scope.openTokenSettings = function () {
            openLogoChange(domain, function (result) {
                if (result == "success")
                    location.reload()
            })
        }

        $scope.openWithdrawal = function () {
            openWithdrawal(init)
        }

        $scope.openCredit = function () {
            openCredit(init)
        }

        $scope.donate = function () {
            openSend(domain, $scope.token.owner, "", init)
        }

        function loadProfile() {
            getProfile(domain, function (response) {
                $scope.token = response
                $scope.$apply()
            })
        }

        addChart($scope, domain + "_price")

        $scope.subscribe("price", function (data) {
            if (data.domain == domain) {
                $scope.token.price = data.price
                $scope.updateChart()
                $scope.$apply()
            }
        })

        $scope.openChart = function (key) {
            openChart(key)
        }

        function init() {
            loadProfile()
            get("/mfm-token/readme.md", function (text) {
                setMarkdown("token-readme", text)
            })
        }

        init()
    })
}