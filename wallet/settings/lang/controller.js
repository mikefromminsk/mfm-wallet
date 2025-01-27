window.languages = {
    "title": "Languages",
    "en": "English",
    "ru": "Русский",
}

function openLanguages(languages, success) {
    trackCall(arguments)
    showDialog("wallet/settings/lang", success, function ($scope) {
        $scope.languages = languages || window.languages

        $scope.getTitle = function (lang) {
            if (typeof lang === 'object') {
                return lang.title
            } else {
                return lang
            }
        }

        $scope.setLanguage = function (key, val) {
            if (typeof val === 'object') {
                openLanguages(val, success)
            } else {
                setTimeout(function () {
                    storage.setString(storageKeys.language, key)
                    location.reload()
                }, 500)
            }
        }
    })
}