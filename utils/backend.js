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

function connectWs(port, onOpen) {
    if (window.WebSocket) {
        if (document.location.protocol === "https:") {
            window.conn = new WebSocket("wss://" + document.location.host + ":" + port)
        } else {
            window.conn = new WebSocket("ws://" + document.location.host + ":" + port)
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
                    if (error) {
                        error(response.message)
                    } else {
                        window.showError(response.message, error)
                    }
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

const session = randomString(8)

function trackEvent(name, value, user_id, success, error) {
    postContract("mfm-analytics", "track.php", {
        app: "ui",
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
    if (args.callee.name.startsWith("open")){
        let anhor = "#" + funcName + (funcParam != "" ? "=" + funcParam : "")
        historyStack.push(anhor)
        history.pushState({}, '', anhor)
    }
    trackEvent(funcName, funcParam, wallet.address())
}

const storageKeys = {
    username: "STORE_USERNAME",
    passhash: "STORE_PASSHASH",
    hasPin: "STORE_HAS_PIN",
    hideBalances: "STORE_HIDE_BALANCES",
    bonuses: "STORE_BONUSES",
    onboardingShowed: "STORE_ONBOARDING_SHOWED",
    language: "STORE_LANGUAGE",
    send_history: "STORE_SEND_HISTORY",
    search_history: "STORE_SEARCH_HISTORY",
    first_review: "STORE_FIRST_REVIEW",
    web_socket_port: "STORE_WEB_SOCKET_PORT",
    mining_auto_start: "STORE_MINING_AUTO_START",
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
    genesis_address: "owner",
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
        let passhash = storage.getString(storageKeys.passhash)
        let password = decode(passhash, pin)
        let key = wallet.calcHash(domain, wallet.address(), password, prev_key)
        let next_hash = CryptoJS.MD5(wallet.calcHash(domain, wallet.address(), password, key)).toString()
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
            // reg account in other tokens
            wallet.calcStartHash(domain, pin, function (next_hash) {
                postContract("mfm-token", "send.php", {
                    domain: domain,
                    from_address: wallet.genesis_address,
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
        let isParamsFunction = typeof params === 'function'
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