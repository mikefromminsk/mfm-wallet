function getParam(paramName, def) {
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    return params.get(paramName) || def
}

function getLanguage() {
    return getParam('lang', storage.getString(storageKeys.language, navigator.language.split("-")[0]))
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
            $scope.str = window.str
            $scope.$apply()
        })
        loadTranslations($scope, "/mfm-wallet/strings/str", function () {
            $scope.str = window.str
            $scope.$apply()
        })
        loadTranslations($scope, "/mfm-wallet/strings/ticker", function () {
            $scope.ticker = window.ticker
            $scope.$apply()
        })
        loadTranslations($scope, "/mfm-wallet/strings/message")
        loadTranslations($scope, "/mfm-pigeon/strings/ticker", function () {
            $scope.ticker = window.ticker
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

function showDialog(templateUrl, onClose, controller, onComplete) {
    window.$mdDialog.show({
        templateUrl: (templateUrl[0] == "/" ? templateUrl : "/mfm-wallet/" + templateUrl) + "/index.html?v=15",
        escapeToClose: false,
        multiple: true,
        isolateScope: false,
        controller: function ($scope) {
            addGlobalVars($scope, controller)
        },
        onComplete: onComplete
    }).then(function (result) {
        if (onClose)
            onClose(result)
    })
}

function showBottomSheet(templateUrl, onClose, controller, onComplete) {
    window.$mdBottomSheet.show({
        templateUrl: "/mfm-wallet/" + templateUrl + "/index.html?v=15",
        escapeToClose: false,
        clickOutsideToClose: false,
        controller: function ($scope) {
            addGlobalVars($scope, controller)
        },
        onComplete: onComplete
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

function hideKeyboard() {
    const active = document.activeElement
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        active.blur()
    }
}

function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Современный метод
        return navigator.clipboard.writeText(text).catch(err => {
            console.error("Clipboard write failed:", err);
        });
    } else {
        // Фолбэк для Safari и старых браузеров
        let textArea = document.createElement("textarea");
        textArea.value = text;

        // скрываем элемент
        textArea.style.position = "fixed";
        textArea.style.top = "-1000px";
        textArea.style.left = "-1000px";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand("copy");
        } catch (err) {
            console.error("Fallback: Unable to copy", err);
        }

        document.body.removeChild(textArea);
    }
}

function share(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error))
    }
}