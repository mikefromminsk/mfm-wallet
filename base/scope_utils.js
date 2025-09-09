function addScopeUtils($scope) {
    $scope.location = location
    $scope.wallet = window.wallet
    $scope.user = window.user
    $scope.str = window.str
    $scope.ticker = window.ticker
    $scope.maxRewards = window.maxRewards || 5
    $scope.energyReward = window.energyReward || 100
    $scope.in_progress = false

    $scope.getLanguage = getLanguage
    $scope.startRequest = function () {
        $scope.in_progress = true
    }
    $scope.finishRequest = function (message) {
        if (message)
            showError(message)
        $scope.in_progress = false
        $scope.$apply()
    }

    $scope.round = function (num, precision) {
        const factor = Math.pow(10, precision != null ? precision : 4)
        return Math.round(num * factor) / factor
    }

    $scope.pow = function (base, factor) {
        return Math.pow(base, factor)
    }

    $scope.shortNumber = function (number, precision) {
        let numberFormat = new Intl.NumberFormat()
        if (number >= 1000000000)
            return numberFormat.format($scope.round(number / 1000000000, precision != null ? precision : 1)) + str.billion_short
        else if (number >= 1000000)
            return numberFormat.format($scope.round(number / 1000000, precision != null ? precision : 1)) + str.million_short
        else if (number >= 100000)
            return numberFormat.format($scope.round(number / 1000, precision != null ? precision : 1)) + str.thousand_short
        else if (number >= 1000)
            return numberFormat.format($scope.round(number, precision != null ? precision : 2))
        else
            return $scope.round(number, precision != null ? precision : 4)
    }

    $scope.formatSec = function (sec) {
        let d = new Date(sec * 1000)

        function format_two_digits(n) {
            return n < 10 ? '0' + n : n
        }

        let hours = format_two_digits(d.getHours())
        let minutes = format_two_digits(d.getMinutes())
        return hours + ":" + minutes
    }

    $scope.formatPrice = function (number, precision) {
        if (number == null)
            number = 0
        return "$" + $scope.shortNumber(number, precision)
    }

    $scope.formatAmount = function (number, domain, precision) {
        if (number == null)
            number = 0
        let result = $scope.shortNumber(number, precision)
        if (ticker[domain] != null)
            domain = ticker[domain]
        if (domain != null && domain.length > 0) {
            if (domain.length > 5)
                domain = domain.substr(0, 3)
            return result + " " + domain.toUpperCase()
        }
        return result
    }

    $scope.formatDifficulty = function (difficulty) {
        return $scope.shortNumber(difficulty) + "H"
    }

    $scope.formatAddress = function (address) {
        if (address == null) return ""
        return address.substr(0, 4) + ".." + address.substr(-3)
    }

    $scope.getIdenticon = function (address, size) {
        if (address == null)
            return ""
        if (size == null)
            size = 32
        if (address.length < 32)
            address = CryptoJS.SHA256(address).toString()
        return {
            "min-width": size + "px",
            "min-height": size + "px",
            "max-width": size + "px",
            "max-height": size + "px",
            "background-image": "url(data:image/png;base64," +
                new Identicon(address, {
                    background: [255, 255, 255, 0],
                    margin: 0.2,
                    size: size
                }).toString() + ")"
        }
    }

    $scope.formatHash = function (hash) {
        if (hash == null) return ""
        return hash.substr(0, 4) + ".." + hash.substr(-4)
    }

    $scope.formatDomain = function (domain) {
        let translation = ticker[domain]
        if (translation)
            return translation
        else
            return (domain || "").replaceAll("_", " ").toUpperCase()
    }

    $scope.formatChange = function (number) {
        if (number == 0) return ""
        let str = $scope.formatPercent(number, 0)
        if (number > 0)
            str = "+" + str
        return str
    }

    $scope.formatPercent = function (number, precision) {
        if (number == 0 || isNaN(number)) return "0%"
        return $scope.round(number, precision || 1) + "%"
    }

    $scope.percentColor = function (number) {
        if (number === undefined) return ""
        if (number == 0)
            return {'text-gray': true}
        if (number > 0)
            return {'text-green': true}
        if (number < 0)
            return {'text-red': true}
    }

    $scope.formatColor = function (func) {
        if (typeof func === "function") {
            let val = func()
            if (val === true) return {'text-green': true}
            if (val === false) return {'text-red': true}
        }
        return {'text-gray': true}
    }

    $scope.formatTime = function (seconds, language) {
        let diff = (seconds < 1000000000 ? seconds : new Date().getTime() / 1000 - seconds)

        language = !language ? "en" : language
        if (language.startsWith("ru")) {
            return $scope.formatTimeRussian(diff)
        } else {
            return $scope.formatTimeEnglish(diff)
        }
    }

    $scope.formatTimeEnglish = function (diff) {
        if (diff < 60) {
            return Math.floor(diff) + " " + (diff == 1 ? "second" : "seconds")
        } else if (diff < 60 * 60) {
            let minutes = Math.floor(diff / 60)
            return minutes + " " + (minutes == 1 ? "minute" : "minutes")
        } else if (diff < 60 * 60 * 24) {
            let hours = Math.floor(diff / (60 * 60))
            return hours + " " + (hours == 1 ? "hour" : "hours")
        } else if (diff < 60 * 60 * 24 * 7) {
            let days = Math.floor(diff / (60 * 60 * 24))
            return days + " " + (days == 1 ? "day" : "days")
        } else if (diff < 60 * 60 * 24 * 30) {
            let weeks = Math.floor(diff / (60 * 60 * 24 * 7))
            return weeks + " " + (weeks == 1 ? "week" : "weeks")
        } else if (diff < 60 * 60 * 24 * 365) {
            let months = Math.floor(diff / (60 * 60 * 24 * 30))
            return months + " " + (months == 1 ? "month" : "months")
        } else {
            let years = Math.floor(diff / (60 * 60 * 24 * 365))
            return years + " " + (years == 1 ? "year" : "years")
        }
    }

    $scope.formatTimeRussian = function (diff) {
        if (diff < 60) {
            return Math.floor(diff) + " " + $scope.getRussianWord(diff, "секунду", "секунды", "секунд")
        } else if (diff < 60 * 60) {
            let minutes = Math.floor(diff / 60)
            return minutes + " " + $scope.getRussianWord(minutes, "минуту", "минуты", "минут")
        } else if (diff < 60 * 60 * 24) {
            let hours = Math.floor(diff / (60 * 60))
            return hours + " " + $scope.getRussianWord(hours, "час", "часа", "часов")
        } else if (diff < 60 * 60 * 24 * 7) {
            let days = Math.floor(diff / (60 * 60 * 24))
            return days + " " + $scope.getRussianWord(days, "день", "дня", "дней")
        } else if (diff < 60 * 60 * 24 * 30) {
            let weeks = Math.floor(diff / (60 * 60 * 24 * 7))
            return weeks + " " + $scope.getRussianWord(weeks, "неделю", "недели", "недель")
        } else if (diff < 60 * 60 * 24 * 365) {
            let months = Math.floor(diff / (60 * 60 * 24 * 30))
            return months + " " + $scope.getRussianWord(months, "месяц", "месяца", "месяцев")
        } else {
            let years = Math.floor(diff / (60 * 60 * 24 * 365))
            return years + " " + $scope.getRussianWord(years, "год", "года", "лет")
        }
    }

    $scope.getRussianWord = function (number, form1, form2, form5) {
        number = Math.abs(number) % 100
        if (number > 10 && number < 20) {
            return form5
        }
        number = number % 10
        if (number == 1) {
            return form1
        }
        if (number >= 2 && number <= 4) {
            return form2
        }
        return form5
    }

    $scope.formatTimeDiff = function (seconds) {
        return ($scope.formatTime(seconds) + " " + str.ago).toLowerCase()
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0')
    }

    $scope.formatDate = function (number) {
        if (number == "") return str.unset
        let date = new Date(number * 1000)
        if (new Date().toDateString() === date.toDateString())
            return str.today
        return [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear()
        ].join('.')
    }

    $scope.percentFormat = function (number) {
        return $scope.round(number, 0) + "%"
    }

    $scope.random = function (from, to) {
        return Math.floor(Math.random() * to) + from
    }

    $scope.groupByTimePeriod = function (obj) {
        const oneDay = 24 * 60 * 60
        let lastDay = 0
        if (obj) {
            for (let i = 0; i < obj.length; i++) {
                let day = Math.floor(obj[i]['time'] / oneDay) * oneDay
                if (day != lastDay) {
                    obj[i]['day'] = day
                    lastDay = day
                }
            }
        }
        return obj
    }

    $scope.max = function (a, b) {
        return Math.max(a, b)
    }

    $scope.getLogoLink = function (domain) {
        let server = ""
        /*if (location.host != "vavilon.org")
            server = "https://vavilon.org"*/
        return server + "/storage/" + domain + ".png"
    }

    $scope.getLogo = function (domain, width) {
        if (width == null)
            width = 32
        let style = {
            'width': width + 'px',
            'height': width + 'px',
            'flex-shrink': 0
        }
        if (domain != null) {
            style['background-image'] = "url('" + $scope.getLogoLink(domain.toLowerCase()) + "')"
            style['background-size'] = 'cover'
            style['background-repeat'] = 'no-repeat'
            style['background-position'] = 'center center'
        }
        return style
    }

    let colors = [
        "#F44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#03A9F4",
        "#00BCD4",
        "#009688",
        "#4CAF50",
        "#CDDC39",
        "#FFEB3B",
        "#FFC107",
        "#FF9800",
        "#FF5722"
    ]

    $scope.getColor = function (domain) {
        return colors[domain.charCodeAt(0) % colors.length]
    }

    $scope.getBack = function (domain) {
        if (domain == null) return {}
        let random4colors = []
        for (let i = 0; i < 4; i++) {
            random4colors.push(colors[domain.charCodeAt(i) % colors.length])
        }
        return {
            'background': 'linear-gradient(90deg, ' + random4colors.join(', ') + ')',
            'background-size': '400% 400%',
            'animation': 'gradient 10s ease infinite',
            'transform': 'translate3d(0, 0, 0)'
        }
    }

    $scope.channels = []
    $scope.subscription_id_list = []
    $scope.subscribe = function (channel, callback) {
        if ($scope.channels.indexOf(channel) == -1) {
            $scope.subscription_id_list.push(subscribe(channel, callback))
            $scope.channels.push(channel)
        }
    }

    $scope.unsubscribeAll = function () {
        for (let subscription_id of $scope.subscription_id_list) {
            unsubscribe(subscription_id)
        }
    }

    $scope.subscribeAccount = function () {
        $scope.subscribe("account:" + wallet.address(), function (data) {
            if (data.amount != 0 && data.to == wallet.address()) {
                showSuccess(str.you_have_received +
                    (data.amount == 1 ? "" : " " + $scope.formatAmount(data.amount)) +
                    " " + $scope.formatDomain(data.domain))
                setTimeout(function () {
                    new Audio("/mfm-wallet/success/payment_success.mp3").play()
                })
            }
            if ($scope.refresh)
                $scope.refresh()
        })
    }

    $scope.back = function (result) {
        window.$mdBottomSheet.hide(result)
        $scope.unsubscribeAll()
        hideKeyboard()
    }

    $scope.close = function (result) {
        window.$mdDialog.hide(result)
        $scope.back()
        historyBack()
    }

    $scope.closeAll = function (success) {
        for (let i = 0; i < 10; i++) {
            window.$mdDialog.hide()
            historyBack()
        }
        $scope.back()
        if (success)
            success()
    }

    $scope.swipeToRefreshDisable = function () {
        $scope.swipeToRefreshDisabled = true
    }

    $scope.copy = function (text) {
        copy(text)
        showSuccess(str.copied + " " + text)
    }

    $scope.stringHash = function (string) {
        let hash = 0
        if (string != null) {
            for (const char of string) {
                hash = (hash << 5) - hash + char.charCodeAt(0)
                hash |= 0
            }
        }
        return hash
    }

    $scope.check = function (value) {
        storage.setString(storageKeys.check_prefix + $scope.stringHash(value), "true")
    }

    $scope.isChecked = function (value) {
        return storage.getString(storageKeys.check_prefix + $scope.stringHash(value)) == "true"
    }

    $scope.isNotChecked = function (value) {
        return !$scope.isChecked(value)
    }

    $scope.isDepositToken = function (token) {
        return token?.delegate?.startsWith("mfm-token/send")
            && token?.delegate?.indexOf("&a=") != -1
    }

    $scope.isMiningToken = function (token) {
        return token?.delegate?.startsWith("mfm-contract/mint")
    }

    $scope.isCraftToken = function (token) {
        return token?.delegate?.startsWith("mfm-contract/craft")
    }

    $scope.isSimpleToken = function (token) {
        return token?.delegate == ''
    }
}