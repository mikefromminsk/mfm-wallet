function getParam(paramName, def) {
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    return params.get(paramName) || def
}

function getLanguage() {
    let lang = getParam('lang', storage.getString(storageKeys.language, navigator.language.split("-")[0]))
    return ["ru"].indexOf(lang) === -1 ? "en" : lang
}

function loadTranslations($scope, path, success) {
    if (!path.endsWith("/")) path += "/"
    let scriptTag = document.createElement('script')
    scriptTag.src = path + getLanguage() + ".js"
    scriptTag.onload = success
    document.body.appendChild(scriptTag)
}

function controller(callback) {
    let app = angular.module("App", ['ngMaterial', 'ngAnimate'])
    app.config(function ($mdThemingProvider, $locationProvider, $provide) {
        $mdThemingProvider.disableTheming()
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        })

        $provide.decorator('ngClickDirective', function ($delegate) {
            $delegate[0].compile = function () {
                return function (scope, element, attrs) {
                    element.on('touchend', function (event) {
                        event.preventDefault()
                    })
                    element.on('click', function (event) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngClick, {$event: event})
                        })
                    })
                }
            }
            return $delegate
        })
    })
    app.controller("Controller", function ($scope, $mdBottomSheet, $mdDialog, $mdToast) {
        window.$mdToast = $mdToast
        window.$mdBottomSheet = $mdBottomSheet
        window.$mdDialog = $mdDialog
        addGlobalVars($scope, callback)
        loadTranslations($scope, "/mfm-wallet/strings/base", function () {
            $scope.str = str
            $scope.$apply()
        })
        loadTranslations($scope, "/mfm-wallet/strings/lang", function () {
            $scope.str = str
            $scope.$apply()
        })
        loadTranslations($scope, "/mfm-wallet/strings/ticker", function () {
            $scope.ticker = ticker
            $scope.$apply()
        })
    })
    if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.expand()
        Telegram.WebApp.setHeaderColor("#0f1620")
    }
    app.directive('onScreen', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                const observer = new IntersectionObserver(function (entries) {
                    if (entries[0].isIntersecting) {
                        scope.$apply(attrs.onScreen)
                    }
                }, {
                    threshold: 0.1
                })
                observer.observe(element[0])
                element.on('$destroy', function () {
                    observer.unobserve(element[0])
                })
            }
        }
    })
}

function addGlobalVars($scope, callback) {
    if (window.addScopeUtils)
        window.addScopeUtils($scope)
    if (window.addNavigator)
        window.addNavigator($scope)
    callback($scope)
    if (!$scope.swipeToRefreshDisabled && typeof swipeToRefresh !== 'undefined')
        swipeToRefresh($scope.swipeToRefresh || $scope.close)
}

function showDialog(templateUrl, onClose, callback) {
    window.$mdDialog.show({
        templateUrl: (templateUrl[0] == "/" ? templateUrl : "/mfm-wallet/" + templateUrl) + "/index.html?v=15",
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
    window.$mdBottomSheet.show({
        templateUrl: "/mfm-wallet/" + templateUrl + "/index.html?v=15",
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
    }).catch(function () {
        if (onClose)
            onClose()
    })
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

function scrollTo(id) {
    setTimeout(function () {
        document.getElementById(id).scrollIntoView({behavior: 'smooth'})
    }, 100)
}