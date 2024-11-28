window.languages = {
    "title": "Languages",
    "en": "English",
    "ru": {
        "title": "Русский",
        "ru": "Стандартный",
        "ru-ussr": "СССР",
        "ru-goblin": "Перевод Гоблина",
    },
}

function openLanguages(languages, success) {
    showDialog('/mfm-wallet/wallet/settings/lang/index.html?nocache', success, function ($scope) {
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