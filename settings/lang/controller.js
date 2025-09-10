window.languages = {
    "en": "English",
    "ru": "Русский"
}

function openLanguages(languages, success) {
    trackCall(arguments)
    showDialog("settings/lang", success, function ($scope) {
        $scope.languages = languages || window.languages

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