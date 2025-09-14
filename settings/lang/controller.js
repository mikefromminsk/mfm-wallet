window.languages = {
    "en": "English",
    "ru": "Русский",
    "zh": "中文",
    "hi": "हिन्दी",
    "es": "Español",
    "fr": "Français",
    "ar": "العربية",
    "bn": "বাংলা",
    "pt": "Português",
    "id": "Bahasa Indonesia",
    "ur": "اردو",
    "de": "Deutsch",
    "ja": "日本語",
    "sw": "Kiswahili",
    "mr": "मराठी",
    "te": "తెలుగు",
    "tr": "Türkçe",
    "ta": "தமிழ்",
    "vi": "Tiếng Việt",
    "ko": "한국어",
    "fa": "فارسی",
    "it": "Italiano",
    "th": "ไทย",
    "gu": "ગુજરાતી",
    "kn": "ಕನ್ನಡ",
    "pa": "ਪੰਜਾਬੀ",
    "ms": "Bahasa Melayu",
    "or": "ଓଡ଼ିଆ",
    "my": "ဗမာစာ"
}

function openLanguages(languages, success) {
    trackCall(arguments)
    showDialog("settings/lang", success, function ($scope) {
        $scope.languages = languages || window.languages

        $scope.setLanguage = function (key, val) {
            if (typeof val === 'object') {
                openLanguages(val, success)
            } else {
                storage.setString(storageKeys.language, key)
                setTimeout(function () {
                    location.reload()
                }, 500)
            }
        }
    })
}