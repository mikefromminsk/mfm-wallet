const DEBUG = location.hostname == "localhost"

let subscriptions = {}

function connectChannel(channel) {
    if (window.conn != null && window.conn.readyState === WebSocket.OPEN && subscriptions[channel].length == 1)
        window.conn.send(JSON.stringify({subscribe: channel}))
}

function subscribe(channel, callback) {
    if (subscriptions[channel] == null)
        subscriptions[channel] = []
    let subscriber_id = randomString(6)
    subscriptions[channel].push({
        subscriber_id: subscriber_id,
        callback: callback,
    })
    connectChannel(channel)
    return subscriber_id
}

function unsubscribe(subscriber_id) {
    for (let channel in subscriptions) {
        subscriptions[channel] = subscriptions[channel].filter(subscription => subscription.subscriber_id !== subscriber_id);
        if (subscriptions[channel].length === 0) {
            window.conn.send(JSON.stringify({unsubscribe: channel}))
            delete subscriptions[channel];
        }
    }
}

function connectWs(onOpen) {
    if (window.WebSocket) {
        if (document.location.protocol === "https:") {
            window.conn = new WebSocket("wss://" + document.location.host + "/ws")
        } else {
            window.conn = new WebSocket("ws://" + document.location.host + "/ws")
        }
        window.conn.onopen = function () {
            for (let channel of Object.keys(subscriptions))
                connectChannel(channel)
            if (onOpen)
                onOpen()
        }
        window.conn.onclose = function () {
            setTimeout(connectWs, 5000)
        }
        window.conn.onmessage = function (evt) {
            let message = JSON.parse(evt.data)
            if (subscriptions == null || subscriptions[message.channel] == null) return
            for (let subscription of subscriptions[message.channel]) {
                subscription.callback(message.data)
            }
        }
    }
}

function randomString(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

async function get(url, success, error) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        if (success)
            success(text);
    } catch (e) {
        if (error)
            error(e)
    }
}

function post(url, params, success, error) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (success)
                    success(JSON.parse(xhr.response))
            } else {
                try {
                    let response = JSON.parse(xhr.response)
                    let message = response.message
                    if (message.length < 100) {
                        try {
                            let translate_key = message.replaceAll(" ", "_").toLowerCase()
                            message = window.str[translate_key] || message
                        } catch (e) {
                        }
                    }
                    if (error) {
                        error(message)
                    } else {
                        window.showError(message, error)
                    }
                } catch (e) {
                    window.showError(xhr.responseText, error)
                }
            }
        }
    };
    xhr.send(JSON.stringify(params || {}))
}

function hash(str) {
    return CryptoJS.SHA256(str).toString()
}

function postContract(application, path, params, success, error) {
    post(location.origin + "/" + application + "/" + path, params, success, error)
}

function tradeApi(path, params, success, error) {
    params = params || {}
    params.address = wallet.address()
    post((DEBUG ? "http://localhost" : "https://mytoken.space") + "/mfm-exchange/" + path, params, success, error)
}

function getParam(paramName, def) {
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    return params.get(paramName) || def
}

const session = getParam("o") || randomString(8)

function trackEvent(name, value, user_id, success, error) {
    postContract("mfm-analytics", "track", {
        name: name,
        value: value || "",
        user_id: user_id || "",
        session: session,
    }, function (response) {
        if (success)
            success(response.info)
    }, error)
}

let historyStack = ["#"]

function trackCall(args) {
    let funcName = args.callee.name
    let funcParam = typeof args[0] === "string" ? args[0] : ""
    if (args.callee.name.startsWith("open")) {
        let anhor = "#" + funcName + (funcParam != "" ? "=" + funcParam : "")
        historyStack.push(anhor)
        history.pushState({}, '', anhor)
    }
    trackEvent(funcName, funcParam, wallet.address())
}

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

function postContractWithGas(domain, path, params, success, error) {
    if (wallet.requestInProcess) {
        wallet.requestQueue.push({domain: domain, path: path, params: params, success: success, error: error})
    } else {
        wallet.postContractWithGas(domain, path, params, success, error)
    }
}

function calcPass(domain, pin, success, error) {
    wallet.calcUserPass(domain, pin, success, error)
}

function calcPassList(domain, pin, success, error) {
    wallet.calcPassList(domain, pin, success, error)
}

function showSuccess(message) {
    console.log("success:" + message)
}

function showError(message) {
    console.log(message)
}

function getPin(success, cancel) {
    if (cancel)
        cancel()
}

var wallet = {
    gas_domain: "usdt",
    vavilon: "vavilon",
    tron: "tron",
    STAKING_ADDRESS: "cba1ac1c73a9d6b717484e774ff85845d343713580cc46b9ae57f801aef729d3",
    MINING_ADDRESS: "e40d3d5318cc88b3874561521992c580300eeb3cc2e2a0c6c7b1a574dc1ae99c",
    MINER_ADDRESS: "32fbfb43bb993947ed36747f564f4a54f8e9a767bb3f972fe1d3498b352e061c",
    BOT_PREFIX: "bot_",
    login: function (address, password, success, error) {
        postContract("mfm-token", "account", {
            domain: wallet.gas_domain,
            address: address,
        }, function (response) {
            if (hash(wallet.calcHash(
                wallet.gas_domain,
                address,
                password,
                response.account.prev_key)) == response.account.next_hash) {
                loginSuccess()
            } else {
                error("invalid password")
            }
        }, function () {
            postContract("mfm-token", "send", {
                domain: wallet.gas_domain,
                to: address,
                pass: wallet.calcStartPass(wallet.gas_domain, address, password)
            }, loginSuccess, error)
        })

        function loginSuccess() {
            if (storage.getString(storageKeys.passhash) == "") {
                getPin(function (pin) {
                    // set pin
                    storage.setString(storageKeys.address, address)
                    storage.setString(storageKeys.passhash, encode(password, pin))
                    if (pin != null)
                        storage.setString(storageKeys.hasPin, true)
                    if (success)
                        success()
                }, function () {
                    // skip pin
                    storage.setString(storageKeys.address, address)
                    storage.setString(storageKeys.passhash, password)
                    if (success)
                        success()
                })
            } else {
                if (success)
                    success()
            }
        }
    },
    reg: function (domain, success, error) {
        postContract("mfm-token", "account", {
            domain: domain,
            address: wallet.address(),
        }, success, function () {
            getPin(function (pin) {
                wallet.calcUserPass(domain, pin, success, error)
            }, error)
        })
    },
    airdrop: function (domain, promocode, success, error){
        let password = hash(promocode)
        let address = hash(password)
        wallet.reg(domain, () => {
            postContract("mfm-token", "account", {
                domain: domain,
                address: address,
            }, (response) => {
                let path = response.account.delegate.split("/")
                let app = path.shift()
                postContract(app, path.join("/"), {
                    domain: domain,
                    address: address,
                    pass: wallet.calcPass(domain, address, password, response.account.prev_key),
                    receiver: wallet.address(),
                }, success, error)
            }, error)
        }, error)
    },
    getBotAddress: function (domain) {
        return hash(hash(this.BOT_PREFIX + domain))
    },
    logout: function () {
        storage.clear()
    },
    address: function () {
        return storage.getString(storageKeys.address)
    },
    // rename to calcKey
    calcHash: function (domain, username, password, prev_key) {
        return hash(domain + username + password + (prev_key || ""))
    },
    calcStartHash: function (domain, pin, success) {
        success(hash(wallet.calcHash(domain, wallet.address(), decode(storage.getString(storageKeys.passhash), pin))))
    },
    calcStartPass: function (domain, address, password, prev_key) {
        return ":" + hash(wallet.calcHash(domain, address, password || address, prev_key))
    },
    calcPass: function (domain, address, password, prev_key) {
        let key = wallet.calcHash(domain, address, password, prev_key)
        let next_hash = hash(wallet.calcHash(domain, address, password, key))
        return key + ":" + next_hash
    },
    calcUserPass: function (domain, pin, success, error) {
        let passhash = storage.getString(storageKeys.passhash)
        let password = decode(passhash, pin)
        postContract("mfm-token", "account", {
            domain: domain,
            address: wallet.address(),
        }, function (response) {
            success(wallet.calcPass(domain, wallet.address(), password, response.account.prev_key))
        }, function () {
            // reg account in other tokens
            wallet.calcStartHash(domain, pin, function (next_hash) {
                postContract("mfm-token", "send", {
                    domain: domain,
                    to: wallet.address(),
                    pass: ":" + next_hash
                }, function () {
                    wallet.calcUserPass(domain, pin, success, error)
                })
            })
        })
    },
    calcPassList: function (domains, pin, success, error) {
        var passes = {}
        for (const domain of domains) {
            wallet.calcUserPass(domain, pin, (pass) => {
                passes[domain] = pass
                if (Object.keys(domains).length == Object.keys(passes).length) {
                    success(passes)
                }
            }, error)
        }
    },
    requestQueue: [],
    requestInProcess: false,
    postContractWithGas: function (domain, path, params, success, error) {
        wallet.requestInProcess = true
        let isParamsFunction = typeof params === 'function'
        getPin(function (pin) {
            if (isParamsFunction) {
                /*calcPass(domain, pin, function (pass, key) {
                    params = params(pass)
                    if (domain == wallet.gas_domain) {
                        wallet.calcPass(wallet.gas_domain, key, pin, function (gas_key, gas_next_hash) {
                            send(params, gas_key + ":" + gas_next_hash)
                        })
                    } else {
                        calcGas(params)
                    }
                })*/
            } else {
                calcGas(params)
            }

            function calcGas(params) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    send(params, pass)
                })
            }

            function checkNextRequest(afterCallback, data) {
                let nextRequest = wallet.requestQueue.shift()
                if (nextRequest != null) {
                    wallet.postContractWithGas(
                        nextRequest.domain,
                        nextRequest.path,
                        nextRequest.params,
                        nextRequest.success,
                        nextRequest.error)
                } else {
                    wallet.requestInProcess = false
                    if (afterCallback)
                        afterCallback(data)
                }
            }

            function send(params, pass) {
                if (params == null) return
                params.gas_address = wallet.address()
                params.gas_pass = pass
                postContract(domain, path, params, (data) => {
                    checkNextRequest(success, data)
                }, (data) => {
                    checkNextRequest(error, data)
                })
            }
        })
    },
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

function reverse(s) {
    return s.split("").reverse().join("");
}

function encode(word, key) {
    if (key == null) return word
    var output = "";
    for (var i = 0; i < word.length; i++) {
        var inp = word.charCodeAt(i);
        var k = key.charCodeAt(i);
        output += String.fromCharCode(inp ^ k);
    }
    return output
}

function decode(word, key) {
    if (key == null) return word
    var output = "";
    for (var i = 0; i < word.length; i++) {
        var inp = word.charCodeAt(i);
        var k = key.charCodeAt(i);
        output += String.fromCharCode(inp ^ k);
    }
    return output
}