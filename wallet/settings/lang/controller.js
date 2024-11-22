window.languages = {
    "title": "Languages",
    "ar": "العربية",
    "bn": "বাংলা",
    "de": "Deutsch",
    "es": "Español",
    "fa": "فارسی",
    "fr": "Français",
    "he": "עברית",
    "hi": "हिन्दी",
    "id": "Bahasa Indonesia",
    "it": "Italiano",
    "ja": "日本語",
    "ko": "한국어",
    "nl": "Nederlands",
    "pl": "Polski",
    "pt": "Português",
    "ru": {
        "title": "Русский",
        "ru": "Стандартный",
        "ru-ussr": "СССР",
        "ru-goblin": "Перевод Гоблина",
    },
    "tr": "Türkçe",
    "uk": "Українська",
    "ur": "اردو",
    "vi": "Tiếng Việt",
    "zh": "中文",
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