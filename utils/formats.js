function addFormats($scope) {
    $scope.round = function (num, precision) {
        const factor = Math.pow(10, precision)
        return (Math.ceil(num * factor) / factor)
    }

    $scope.shortNumber = function (number, precision) {
        if (precision == null) precision = 4
        number = $scope.round(number, precision)
        let numberFormat = new Intl.NumberFormat()
        let result
        if (number >= 1_000_000_000)
            result = numberFormat.format($scope.round(number / 1_000_000_000, 2)) + str.billion_short
        else if (number >= 1_000_000)
            result = numberFormat.format($scope.round(number / 1_000_000, 2)) + str.million_short
        else if (number >= 1_000)
            result = numberFormat.format($scope.round(number, 0))
        else
            result = number
        return result
    }

    $scope.formatSec = function (sec) {
        let d = new Date(sec * 1000);

        function format_two_digits(n) {
            return n < 10 ? '0' + n : n;
        }

        let hours = format_two_digits(d.getHours());
        let minutes = format_two_digits(d.getMinutes());
        return hours + ":" + minutes;
    }

    $scope.formatPrice = function (number, precision) {
        if (number == null)
            number = 0;
        return "$" + $scope.shortNumber(number, precision)
    }
    $scope.formatAmount = function (number, domain, precision) {
        if (number == null)
            number = 0;
        let result = $scope.shortNumber(number, precision)
        if (domain != null && domain.length > 0) {
            if (domain.length > 5)
                domain = domain.substr(0, 3)
            return result + " " + domain.toUpperCase()
        }
        return result
    }

    $scope.formatAddress = function (address) {
        if (address == null) return ""
        if (address.length < 32) return address
        return address.substr(0, 4) + "..." + address.substr(-4)
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
            "background-image": "url(data:image/png;base64,"
                + new Identicon(address, {
                    background: [255, 255, 255, 0],         // rgba white
                    margin: 0.2,                              // 20% margin
                    size: size,                                // 420px square
                }).toString() + ")",
        }
    }

    $scope.formatHash = function (hash) {
        if (hash == null) return ""
        return hash.substr(0, 5) + "..." + hash.substr(-5)
    }

    $scope.formatDomainShort = function (domain) {
        if (domain == null) return ""
        if (domain.length > 8)
            domain = domain.substr(0, 7) + ".."
        return $scope.formatDomain(domain)
    }

    $scope.formatDomain = function (domain) {
        return (domain || "").replace("_", " ").toUpperCase()
    }

    $scope.formatChange = function (number) {
        if (number == 0) return ""
        let str = $scope.formatPercent(number, 0)
        if (number > 0)
            str = "+" + str;
        return str;
    }

    $scope.formatPercent = function (number, precision) {
        if (number == 0 || isNaN(number)) return "0%";
        return $scope.round(number, precision || 1) + "%";
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

    $scope.formatTime = function (seconds) {

        function round(num, precision) {
            return +(Math.round(num + "e+" + precision) + "e-" + precision);
        }

        let diff = new Date().getTime() / 1000 - seconds
        let string = ""
        if (diff < 60) {
            string = round(diff, 0)
            string += " " + (string == 1 ? str.second : str.seconds)
        } else if (diff < 60 * 60) {
            string = round(diff / 60, 0)
            string += " " + (string == 1 ? str.minute : str.minutes)
        } else if (diff < 60 * 60 * 24) {
            string = round(diff / 60 / 60, 0)
            string += " " + (string == 1 ? str.hour : str.hours)
        } else if (diff < 60 * 60 * 24 * 7) {
            string = round(diff / 60 / 60 / 24, 0)
            string += " " + (string == 1 ? str.day : str.days)
        } else if (diff < 60 * 60 * 24 * 30) {
            string = round(diff / 60 / 60 / 24 / 7, 0)
            string += " " + (string == 1 ? str.week : str.weeks)
        } else if (diff < 60 * 60 * 24 * 365) {
            string = round(diff / 60 / 60 / 24 / 30, 0)
            string += " " + (string == 1 ? str.month : str.months)
        } else {
            string = round(diff / 60 / 60 / 24 / 365, 0)
            string += " " + (string == 1 ? str.year : str.years)
        }
        return string
    }

    $scope.formatTimeDiff = function (seconds) {
        return ($scope.formatTime(seconds) + " " + str.ago).toLowerCase()
    }


    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    $scope.formatDate = function (number) {
        if (number == "") return str.unset
        let date = new Date(number * 1000)
        if (new Date().toDateString() === date.toDateString())
            return str.today
        return [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
        ].join('.');
    }

    $scope.percentFormat = function (number) {
        return $scope.round(number, 0) + "%";
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

    $scope.random = function (from, to) {
        return Math.floor(Math.random() * to) + from;
    }

    $scope.groupByTimePeriod = function (obj) {
        let objPeriod = {};
        let oneDay = 24 * 60 * 60;
        for (let i = 0; i < obj.length; i++) {
            let d = new Date(obj[i]['time']);
            d = Math.floor(d.getTime() / oneDay);
            objPeriod[d] = objPeriod[d] || [];
            objPeriod[d].push(obj[i]);
        }
        let result = []
        for (day of Object.keys(objPeriod).sort().reverse()) {
            result.push({
                day: $scope.formatDate(day * 24 * 60 * 60),
                items: objPeriod[day].sort((a, b) => b['time'] - a['time']),
            })
        }
        return result;
    }

    $scope.max = function (a, b) {
        return Math.max(a, b)
    }

    // this is not a formats

    $scope.getLogoLink = function (domain) {
        return "/storage/" + domain + ".png"
    }

    $scope.getLogo = function (domain, width) {
        if (width == null)
            width = '32px'
        let style = {
            'width': width,
            'height': width,
            'min-width': width,
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
        "#FF5722",
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
            'transform': 'translate3d(0, 0, 0)',
        }
    }


    let keyPressCallback = null
    let keyPressListener = function (e) {
        if (e.key === 'Enter') {
            if (keyPressCallback)
                keyPressCallback()
        }
    }

    $scope.pressEnter = function (callback) {
        if (callback) {
            keyPressCallback = callback
            document.addEventListener('keypress', keyPressListener);
        }
    }

    $scope.removePressEnter = function () {
        if (keyPressCallback)
            document.removeEventListener('keypress', keyPressListener);
    }

    $scope.formatAntiPrice = function (number, precision) {
        if (precision == null) precision = 2
        if (number < 1)
            return $scope.formatPrice(1 / number, precision).substr(1)
        return $scope.formatPrice(number, precision).substr(1)
    }
}