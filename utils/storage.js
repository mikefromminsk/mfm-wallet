const storageKeys = {
    address: "STORE_ADDRESS",
    passhash: "STORE_PASSHASH",
    hasPin: "STORE_HAS_PIN",
    hideBalances: "STORE_HIDE_BALANCES",
    bonuses: "STORE_BONUSES",
    onboardingShowed: "STORE_ONBOARDING_SHOWED",
    language: "STORE_LANGUAGE",
    send_history: "STORE_SEND_HISTORY",
    user_history: "EXCHANGE_SEND_HISTORY",
    search_history: "STORE_SEARCH_HISTORY",
    first_review: "STORE_FIRST_REVIEW",
    defaultOfferDomain: "STORE_DEFAULT_OFFER_DOMAIN",
    default_payment_type: "STORE_DEFAULT_PAYMENT_TYPE",
    check_prefix: "STORE_CHECK_PREFIX_",
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
        if (this.isArrayItemExist(key, value)) return;
        let array = this.getStringArray(key)
        if (limit != null && array.length >= limit)
            array.shift()
        array.push(value)
        this.setString(key, array.join(","))
    },
    removeFromArray: function (key, value) {
        if (!this.getStringArray(key, value)) return;
        let array = this.getStringArray(key)
        array.splice(array.indexOf(value), 1);
        this.setString(key, array.join(","))
    },
    isArrayItemExist: function (key, value) {
        return this.getStringArray(key).indexOf(value) != -1
    },
    clear: function () {
        localStorage.clear()
    }
}
