const storageKeys = {
    address: "STORE_ADDRESS_V2",
    passhash: "STORE_PASSHASH_V2",
    hasPin: "STORE_HAS_PIN_V2",
    language: "STORE_LANGUAGE",
    send_history: "STORE_SEND_HISTORY",
    check_prefix: "STORE_CHECK_PREFIX_",
    chart_period: "STORE_CHART_PERIOD_"
}

var storage = {
    getString: function (key, def) {
        let value = new URLSearchParams(window.location.search).get(key)
        if ((value == null || value == "") && localStorage != null) {
            value = localStorage.getItem(key)
        }
        if (value == null) value = ""
        if (value == "" && def != null)
            return def
        return value
    },
    setString: function (key, val) {
        localStorage.setItem(key, val)
    },
    getObject: function (key, def) {
        return JSON.parse(storage.getString(key, JSON.stringify(def)))
    },
    setObject: function (key, obj) {
        storage.setString(key, JSON.stringify(obj))
    },
    getStringArray: function (key) {
        let string = this.getString(key)
        return string == null || string == "" ? [] : string.split(',')
    },
    pushToArray: function (key, value, limit) {
        if (this.isArrayItemExist(key, value)) return
        let array = this.getStringArray(key)
        if (limit != null && array.length >= limit)
            array.shift()
        array.push(value)
        this.setString(key, array.join(','))
    },
    removeFromArray: function (key, value) {
        if (!this.isArrayItemExist(key, value)) return
        let array = this.getStringArray(key)
        array.splice(array.indexOf(value), 1)
        this.setString(key, array.join(','))
    },
    isArrayItemExist: function (key, value) {
        return this.getStringArray(key).indexOf(value) != -1
    },
    clear: function () {
        localStorage.clear()
    }
}