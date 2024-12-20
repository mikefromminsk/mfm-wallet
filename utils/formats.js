function addFormats($scope) {
    $scope.round = function (num, precision) {
        return +(Math.round(num + "e+" + precision) + "e-" + precision);
    }

    function shortNumber(number, precision) {
        if (precision == null) precision = 2
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
        return "$" + shortNumber(number, precision)
    }
    $scope.formatAmount = function (number, domain, precision) {
        if (number == null)
            number = 0;
        let result = shortNumber(number, precision)
        if (domain != null && domain.length > 0) {
            if (domain.length > 5)
                domain = domain.substr(0, 3)
            return result + " " + domain.toUpperCase()
        }
        return result
    }

    $scope.watchAmount = function (newValue, oldValue) {
        if (newValue == null) return;
        if (newValue != oldValue && $scope.formatAmount(newValue, '', 2) != newValue) {
            newValue = $scope.formatAmount(newValue, '', 2)
        }
        return newValue;
    }
    $scope.formatHash = function (hash) {
        if (hash == null) return ""
        return hash.substr(0, 5) + "..." + hash.substr(-5)
    }
    $scope.formatTickerShort = function (domain) {
        if (domain == null) return ""
        if (domain.length > 8)
            domain = domain.substr(0, 7) + ".."
        return $scope.formatTicker(domain)
    }
    $scope.formatTicker = function (domain) {
        return (domain || "").toUpperCase()
    }
    $scope.formatChange = function (number) {
        if (number == 0)
            return ""
        let str = $scope.formatPercent(number, 2)
        if (number > 0)
            str = "+" + str;
        return str;
    }

    $scope.formatPercent = function (number, precision) {
        number = $scope.round(number, precision || 1)
        if (number == 0) return "0%";
        if (number < 0)
            return number + "%";
        else if (number > 0)
            return number + "%";
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

    $scope.formatTime = function (number) {
        return new Date(number * 1000).toLocaleString()
    }

    $scope.formatTimeDiff = function (seconds) {
        function round(num, precision) {
            return +(Math.round(num + "e+" + precision) + "e-" + precision);
        }

        var diff = new Date().getTime() / 1000 - seconds
        var string = ""
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
        return (string + " " + str.ago).toLowerCase()
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    $scope.formatDate = function (number) {
        if (number == "") return ""
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
        var objPeriod = {};
        var oneDay = 24 * 60 * 60;
        for (var i = 0; i < obj.length; i++) {
            var d = new Date(obj[i]['time']);
            d = Math.floor(d.getTime() / oneDay);
            objPeriod[d] = objPeriod[d] || [];
            objPeriod[d].push(obj[i]);
        }
        var result = []
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
        return "https://storage.mytoken.space/" + domain + ".png"
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
            style['background-image'] = "url('" + $scope.getLogoLink(domain) + "')"
            style['background-size'] = 'cover'
            style['background-repeat'] = 'no-repeat'
            style['background-position'] = 'center center'
        }
        return style
    }

    $scope.getBack = function (domain) {
        if (domain == null) return {}
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
            "#795548",
            "#607D8B",
            "#9E9E9E",
        ]
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
        if (callback){
            keyPressCallback = callback
            document.addEventListener('keypress', keyPressListener);
        }
    }

    $scope.removePressEnter = function () {
        if (keyPressCallback)
            document.removeEventListener('keypress', keyPressListener);
    }
}