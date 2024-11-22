function openLanguages(success) {
    showDialog('/mfm-wallet/wallet/settings/lang/index.html?nocache', success, function ($scope) {

        $scope.languages = {
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
            "ru": "Русский",
            "tr": "Türkçe",
            "uk": "Українська",
            "ur": "اردو",
            "vi": "Tiếng Việt",
            "zh": "中文"
        }

        $scope.setLanguage = function (lang) {
            setTimeout(function () {
                storage.setString(storageKeys.language, lang)
                location.reload()
            }, 500)
        }
    })
}