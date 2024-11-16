const DEBUG = location.hostname == "localhost"

var subscriptions = {}

function subscribe(channel, callback) {
    if (subscriptions[channel] == null)
        subscriptions[channel] = []
    let subscribe_id = randomString(6)
    subscriptions[channel].push({
        subscribe_id: subscribe_id,
        callback: callback,
    })
    if (window.conn != null && window.conn.readyState === WebSocket.OPEN && subscriptions[channel].length == 1)
        window.conn.send(JSON.stringify({subscribe: channel}))
    return subscribe_id
}

function unsubscribe(subscribe_id) {
    for (let channel in subscriptions) {
        subscriptions[channel] = subscriptions[channel].filter(subscription => subscription.subscribe_id !== subscribe_id);
        if (subscriptions[channel].length === 0) {
            window.conn.send(JSON.stringify({unsubscribe: channel}))
            delete subscriptions[channel];
        }
    }
}

function connectWs() {
    if (window.WebSocket) {
        if (document.location.protocol === "https:") {
            window.conn = new WebSocket("wss://" + document.location.host + ":8887")
        } else {
            window.conn = new WebSocket("ws://" + document.location.host + ":8887")
        }
        window.conn.onopen = function () {
            //showSuccess("Websocket connected")
            for (var channel of Object.keys(subscriptions))
                window.conn.send(JSON.stringify({channel: channel}))
        }
        window.conn.onclose = function () {
            showError("Websocket disconnected")
        }
        window.conn.onmessage = function (evt) {
            var message = JSON.parse(evt.data)
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
                    var response = JSON.parse(xhr.response)
                    window.showError(response.message, error)
                } catch (e) {
                    window.showError(xhr.responseText, error)
                }
            }
        }
    };
    const formData = new FormData()
    for (var key of Object.keys(params))
        formData.append(key, params[key])
    xhr.send(formData)
}

function postContract(domain, path, params, success, error) {
    post("/" + domain + "/" + path, params, success, error)
}

function dataObject(path, success, error) {
    postContract("mfm-data", "object.php", {
        path: path,
    }, (response) => {
        if (success)
            success(response.object)
    }, error)
}

function dataGet(path, success, error) {
    postContract("mfm-data", "get.php", {
        path: path,
    }, function (response) {
        if (success)
            success(response.value)
    }, error)
}

function dataInfo(path, success, error) {
    postContract("mfm-data", "info.php", {
        path: path,
    }, function (response) {
        if (success)
            success(response.info)
    }, error)
}

var session = randomString(6)

function trackEvent(type, name, value, success, error) {
    postContract("mfm-analytics", "track.php", {
        type: type,
        name: name || "",
        value: value || "",
        version: window.package_json.version,
        session: session,
        username: wallet.address(),
    }, function (response) {
        if (success)
            success(response.info)
    }, error)
}

function trackStart(){
    get("/mfm-wallet/package.json", function (text) {
        window.package_json = JSON.parse(text)
        // TODO change in tg bot hook bot param to af_source
        trackEvent("ui_start", getParam("af_source"), getParam("af_campaign"))
    })
}

function trackCall(args){
    trackEvent("ui_call", args.callee.name, typeof args[0] === "string" ? args[0] : "")
}

function dataExist(path, success, error) {
    dataInfo(path, success, error)
}

const storageKeys = {
    username: "STORE_USERNAME",
    passhash: "STORE_PASSHASH",
    hasPin: "STORE_HAS_PIN",
    hideBalances: "STORE_HIDE_BALANCES",
    domains: "STORE_DOMAINS",
    bonuses: "STORE_BONUSES",
    categories: "STORE_CATEGORIES",
    selectedCoin: "STORE_SELECTED_COIN",
    onboardingShowed: "STORE_ONBOARDING_SHOWED",
}

function postContractWithGas(domain, path, params, success, error) {
    if (wallet.requestInProcess) {
        wallet.requestQueue.push({domain: domain, path: path, params: params, success: success, error: error})
    } else {
        wallet.postContractWithGas(domain, path, params, success, error)
    }
}

function calcPass(domain, pin, success, error) {
    wallet.calcPass(domain, pin, success, error)
}

function calcPassList(domain, pin, success, error) {
    wallet.calcPassList(domain, pin, success, error)
}

var wallet = {
    gas_domain: "usdt",
    logout: function () {
        storage.clear()
    },
    address: function () {
        return storage.getString(storageKeys.username)
    },
    // rename to calcKey
    calcHash: function (domain, username, password, prev_key) {
        return CryptoJS.MD5(domain + username + password + (prev_key || "")).toString()
    },
    calcStartHash: function (domain, pin, success) {
        success(CryptoJS.MD5(wallet.calcHash(domain, wallet.address(), decode(storage.getString(storageKeys.passhash), pin))).toString())
    },
    calcKeyHash: function (domain, prev_key, pin, success) {
        var passhash = storage.getString(storageKeys.passhash)
        var password = decode(passhash, pin)
        var key = wallet.calcHash(domain, wallet.address(), password, prev_key)
        var next_hash = CryptoJS.MD5(wallet.calcHash(domain, wallet.address(), password, key)).toString()
        success(key, next_hash)
    },
    calcPass: function (domain, pin, success, error) {
        postContract("mfm-token", "account.php", {
            domain: domain,
            address: wallet.address(),
        }, function (response) {
            wallet.calcKeyHash(domain, response.prev_key, pin, function (key, next_hash) {
                success(key + ":" + next_hash, key, next_hash)
            })
        }, function () {
            wallet.calcStartHash(domain, pin, function (next_hash) {
                postContract("mfm-token", "send.php", {
                    domain: domain,
                    from_address: "owner",
                    to_address: wallet.address(),
                    amount: 0,
                    pass: ":" + next_hash
                }, function () {
                    wallet.calcPass(domain, pin, success, error)
                })
            })
        })
    },
    calcPassList: function (domains, pin, success, error) {
        var passes = {}
        for (const domain of domains) {
            wallet.calcPass(domain, pin, (pass) => {
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
        var isParamsFunction = typeof params === 'function'
        getPin(function (pin) {
            if (isParamsFunction) {
                calcPass(domain, pin, function (pass, key) {
                    params = params(pass)
                    if (domain == wallet.gas_domain) {
                        wallet.calcKeyHash(wallet.gas_domain, key, pin, function (gas_key, gas_next_hash) {
                            send(params, gas_key + ":" + gas_next_hash)
                        })
                    } else {
                        calcGas(params)
                    }
                })
            } else {
                calcGas(params)
            }

            function calcGas(params) {
                calcPass(wallet.gas_domain, pin, function (pass) {
                    send(params, pass)
                })
            }

            function checkNextRequest(afterCallback) {
                var nextRequest = wallet.requestQueue.shift()
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
                        afterCallback()
                }
            }

            function send(params, pass) {
                if (params == null) return
                params.gas_address = wallet.address()
                params.gas_pass = pass
                postContract(domain, path, params, () => {
                    checkNextRequest(success)
                }, () => {
                    checkNextRequest(error)
                })
            }
        })
    },
}


var storage = {
    getString: function (key, def) {
        var value = new URLSearchParams(window.location.search).get(key)
        if ((value == null || value == "") && window.NativeAndroid != null) {
            value = window.NativeAndroid.getItem(key)
        } else if ((value == null || value == "") && localStorage != null) {
            value = localStorage.getItem(key)
        }
        if (value == null) value = ""
        if (value == "" && def != null)
            return def
        return value
    },
    setString: function (key, val) {
        if (window.NativeAndroid != null) {
            window.NativeAndroid.setItem(key, val)
        } else {
            localStorage.setItem(key, val)
        }
    },
    getObject: function (key, def) {
        return JSON.parse(storage.getString(key, JSON.stringify(def)))
    },
    setObject: function (key, obj) {
        storage.setString(key, JSON.stringify(obj))
    },
    getStringArray: function (key) {
        var string = this.getString(key)
        return string == null || string == "" ? [] : string.split(',')
    },
    pushToArray: function (key, value) {
        if (this.isArrayItemExist(key, value)) return;
        var array = this.getStringArray(key)
        array.push(value)
        this.setString(key, array.join(","))
    },
    removeFromArray: function (key, value) {
        if (!this.getStringArray(key, value)) return;
        var array = this.getStringArray(key)
        array.splice(array.indexOf(value), 1);
        this.setString(key, array.join(","))
    },
    isArrayItemExist: function (key, value) {
        return this.getStringArray(key).indexOf(value) != -1
    },
    clear: function () {
        if (window.NativeAndroid != null) {
            window.NativeAndroid.clear()
        } else {
            localStorage.clear()
        }
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