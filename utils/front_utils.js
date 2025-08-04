function getParam(paramName, def) {
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    return params.get(paramName) || def
}

function getLanguage() {
    let lang = getParam('lang', storage.getString(storageKeys.language, navigator.language.split("-")[0]))
    return ["ru"].indexOf(lang) === -1 ? "en" : lang
}

function loadTranslations($scope) {
    let scriptTag = document.createElement('script')
    scriptTag.src = "/mfm-wallet/strings/lang/" + getLanguage() + ".js"
    scriptTag.onload = function () {
        $scope.str = window.str
        $scope.$apply()
    }
    scriptTag.onerror = function () {
        storage.setString(storageKeys.language, "en")
    }
    document.body.appendChild(scriptTag)
}

function controller(callback) {
    let app = angular.module("App", ['ngMaterial', 'ngAnimate'])
    app.config(function ($mdThemingProvider, $locationProvider) {
        $mdThemingProvider.disableTheming()
        // Включаем HTML5 Mode
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        })
    })
    app.controller("Controller", function ($scope, $mdBottomSheet, $mdDialog, $mdToast) {
        window.$mdToast = $mdToast
        window.$mdBottomSheet = $mdBottomSheet
        window.$mdDialog = $mdDialog
        addGlobalVars($scope, callback)
        loadTranslations($scope)
    })
    if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.expand()
        Telegram.WebApp.setHeaderColor("#0f1620")
    }
}

function addGlobalVars($scope, callback) {
    if (window.addFormats)
        window.addFormats($scope)
    if (typeof addNavigator !== 'undefined')
        addNavigator($scope)
    $scope.wallet = window.wallet
    $scope.user = window.user
    $scope.str = window.str
    $scope.bank_address = "bank"
    $scope.in_progress = false
    $scope.location = location
    $scope.startRequest = function () {
        $scope.in_progress = true
    }
    $scope.finishRequest = function (message) {
        if (message)
            showError(message)
        $scope.in_progress = false
        $scope.$apply()
    }
    callback($scope)
    if (!$scope.swipeToRefreshDisabled && typeof swipeToRefresh !== 'undefined')
        swipeToRefresh($scope.swipeToRefresh || $scope.close)
}

function showDialog(templateUrl, onClose, callback) {
        let path = location.pathname
        if (!path.endsWith("/"))
            path += "/"

        window.$mdDialog.show({
            templateUrl: (templateUrl[0] == "/" ? templateUrl : path + templateUrl) + "/index.html?v=9",
            escapeToClose: false,
            multiple: true,
            isolateScope: false,
            controller: function ($scope) {
                addGlobalVars($scope, callback)
            }
        }).then(function (result) {
            if (onClose)
                onClose(result)
        })
}

function showBottomSheet(templateUrl, onClose, callback) {
    setTimeout(function () {
        window.$mdBottomSheet.show({
            templateUrl: "/mfm-wallet/" + templateUrl + "/index.html",
            escapeToClose: false,
            clickOutsideToClose: false,
            controller: function ($scope) {
                addGlobalVars($scope, callback)
            }
        }).then(function (result) {
            try {
                if (onClose)
                    onClose(result)
            } catch (e) {
            }
        }).catch(function () { // для отслеживания свертывания окна
            if (onClose)
                onClose()
        })
    }, 100)
}

function showMessage(message, toastClass, callback) {
    if (message == null) message = ""
    let spaceCount = message.split(' ').length + 1
    let delay = spaceCount / 4 * 1000
    if (delay < 2000) delay = 2000
    if (delay > 5000) delay = 5000
    if (window.$mdToast != null) {
        window.$mdToast.show(window.$mdToast.simple()
            .toastClass(toastClass)
            .textContent(message)
            .hideDelay(delay))
    } else {
        alert(message)
    }
    if (callback)
        callback(message)
}

function showError(message, error) {
    showMessage(message, 'red-toast', error)
}

function showSuccess(message, success) {
    showMessage(message, 'green-toast', success)
}

function clearFocus() {
    document.body.focus()
}


function addPriceAmountTotal($scope) {
    $scope.setIsSell = function (is_sell) {
        $scope.is_sell = is_sell
    }

    $scope.changePrice = function (price) {
        if (price != null)
            $scope.price = price
        if ($scope.price != null && $scope.amount != null)
            $scope.total = $scope.round($scope.price * $scope.amount)
    }

    $scope.changeAmount = function (amount) {
        if (amount != null)
            $scope.amount = amount
        if ($scope.price != null && $scope.amount != null)
            $scope.total = $scope.round($scope.price * $scope.amount)
    }

    $scope.changeTotal = function (total) {
        if (total != null)
            $scope.total = total
        if ($scope.price != null && $scope.total != null)
            $scope.amount = $scope.round($scope.total / $scope.price)
    }

    $scope.$watch("price", function (newValue) {
        if (newValue != null)
            $scope.price = $scope.round($scope.price)
    })
    $scope.$watch("amount", function (newValue) {
        if (newValue != null)
            $scope.amount = $scope.round($scope.amount)
    })
    $scope.$watch("total", function (newValue) {
        if (newValue != null)
            $scope.total = $scope.round($scope.total)
    })
}