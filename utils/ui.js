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
}

function addGlobalVars($scope, callback) {
    addFormats($scope)
    addNavigator($scope)
    $scope.wallet = window.wallet
    $scope.str = window.str
    $scope.bank_address = "bank"
    $scope.staking_address = "staking"
    $scope.in_progress = false
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
    if (!$scope.swipeToRefreshDisabled)
        swipeToRefresh($scope.swipeToRefresh || $scope.close)
}

function showDialog(templateUrl, onClose, callback) {
    setTimeout(function () {
        window.$mdDialog.show({
            templateUrl: "/mfm-wallet/" + templateUrl + "/index.html?nocache",
            escapeToClose: false,
            multiple: true,
            controller: function ($scope) {
                addGlobalVars($scope, callback)
            }
        }).then(function (result) {
            if (onClose)
                onClose(result)
        })
    }, 100)
}

function showBottomSheet(templateUrl, onClose, callback) {
    setTimeout(function () {
        window.$mdBottomSheet.show({
            templateUrl: "/mfm-wallet/" + templateUrl + "/index.html?nocache",
            escapeToClose: false,
            clickOutsideToClose: false,
            controller: function ($scope) {
                addGlobalVars($scope, callback)
            }
        }).then(function (result) {
            if (onClose)
                onClose(result)
        }).catch(function () {
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
