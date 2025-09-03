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
    if (url.indexOf("http") == -1){
        if (!url.startsWith("/"))
            url = "/" + url
        url = location.origin + url
    }
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
                    if (window.message) {
                        message = window.message[message.replaceAll(" ", "_").toLowerCase()] || message
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

function hashAddress(password) {
    const abc = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const binaryStr = atob(hash(password));
    const last20Bytes = new Uint8Array(20);

    const startPos = Math.max(0, binaryStr.length - 20);
    for (let i = 0; i < 20; i++) {
        const srcPos = startPos + i;
        last20Bytes[i] = srcPos < binaryStr.length ? binaryStr.charCodeAt(srcPos) : 0;
    }

    let digits = [0];
    for (const byte of last20Bytes) {
        let carry = byte;
        for (let i = 0; i < digits.length; i++) {
            carry += digits[i] * 256;
            digits[i] = carry % 58;
            carry = Math.floor(carry / 58);
        }
        while (carry > 0) {
            digits.push(carry % 58);
            carry = Math.floor(carry / 58);
        }
    }

    let res = '';
    for (const d of digits.reverse()) {
        res += abc[d];
    }

    return "V" + res;
}

function postContract(application, path, params, success, error) {
    post(location.origin + "/" + application + "/" + path, params, success, error)
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
        language_code: window.getLanguage ? getLanguage() : null,
        timezone_offset_minutes: new Date().getTimezoneOffset(),
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
        if (window.Telegram && getTelegramUserId() == null)
            history.pushState({}, '', anhor)
    }
    trackEvent(funcName, funcParam, wallet.address())
}

function historyBack() {
    historyStack.pop()
    if (window.Telegram && getTelegramUserId() == null)
        window.history.pushState({}, document.title, historyStack[historyStack.length - 1])
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
    alert(message)
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
    energy: "energy",
    tron: "tron",
    MINING_ADDRESS: "V3eWGQmcvKkG7bhtCv7eW1yvtwTxX",
    MINER_ADDRESS: "V3f7tNy1QpiwH4C5J7AUDc46bidsH",
    AIRDROP_ADDRESS: "V2KjdDBQXjHi4Ub5QUt4VDJnKWq8V",
    WITHDRAWAL_ADDESS: "V",
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
            getPin(function (pin) {
                storage.setString(storageKeys.address, address)
                storage.setString(storageKeys.passhash, encode(password, pin))
                if (pin != null)
                    storage.setString(storageKeys.hasPin, true)
                if (success)
                    success()
            }, function () {
                storage.setString(storageKeys.address, address)
                storage.setString(storageKeys.passhash, password)
                if (success)
                    success()
            })
        }
    },
    reg: function (domain, success, error) { // TODO delete
        postContract("mfm-token", "account", {
            domain: domain,
            address: wallet.address(),
        }, success, function () {
            getPin(function (pin) {
                wallet.calcUserPass(domain, pin, success, error)
            }, error)
        })
    },
    logout: function () {
        storage.clear()
    },
    address: function () {
        return storage.getString(storageKeys.address)
    },
    calcHash: function (domain, address, password, prev_key) {
        return hash(domain + address + password + (prev_key || ""))
    },
    calcStartHash: function (domain, pin, success) {
        success(hash(wallet.calcHash(domain, wallet.address(), decode(storage.getString(storageKeys.passhash), pin))))
    },
    calcStartPass: function (domain, address, password) {
        return ":" + hash(wallet.calcHash(domain, address, password || address, null))
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