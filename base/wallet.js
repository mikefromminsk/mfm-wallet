const DEBUG = location.hostname == "localhost"

function showError(message) {
    alert(message)
}

function post(url, params, success, error) {
    if (url.indexOf("http") == -1) {
        if (!url.startsWith("/"))
            url = "/" + url
        url = location.origin + url
    }
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (success)
                    success(JSON.parse(xhr.response))
            } else {
                try {
                    let response = JSON.parse(xhr.response)
                    let message = response.message
                    if (window.message)
                        message = window.message[message.replaceAll(" ", "_").toLowerCase()] || message
                    if (error) {
                        error(message)
                    } else {
                        showError(message, error)
                    }
                } catch (e) {
                    showError(xhr.responseText, error)
                }
            }
        }
    }
    xhr.send(JSON.stringify(params || {}))
}

function postContract(application, path, params, success, error) {
    post(location.origin + "/" + application + "/" + path, params, success, error)
}

function hash(str) {
    return CryptoJS.SHA256(str).toString()
}

function calcHash(domain, address, password, prev_key) {
    return hash(domain + address + password + (prev_key || ""))
}

function calcStartPass(domain, address, password) {
    return ":" + hash(calcHash(domain, address, password, null))
}

function calcPass(domain, address, password, prev_key) {
    let key = calcHash(domain, address, password, prev_key)
    let next_hash = hash(calcHash(domain, address, password, key))
    return key + ":" + next_hash
}

function hashAddress(password) {
    const abc = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    const hashBytes = new Uint8Array([...atob(hash(password))].map(c => c.charCodeAt(0)))
    const last20Bytes = hashBytes.slice(-20)
    let digits = [0]
    for (const byte of last20Bytes) {
        let carry = byte
        for (let i = 0; i < digits.length; i++) {
            carry += digits[i] * 256
            digits[i] = carry % 58
            carry = Math.floor(carry / 58)
        }
        while (carry > 0) {
            digits.push(carry % 58)
            carry = Math.floor(carry / 58)
        }
    }
    return "V" + digits.reverse().map(d => abc[d]).join('')
}

function getPin(success, cancel) {
    const pin = prompt("Enter your PIN:")
    if (pin)
        success(pin)
    else
        cancel()
}

var wallet = {
    gas_domain: "usdt",
    vavilon: "vavilon",
    energy: "energy",
    bitcoin: "bitcoin",
    tron: "tron",
    MINING_ADDRESS: "V3eWGQmcvKkG7bhtCv7eW1yvtwTxX",
    MINER_ADDRESS: "V3f7tNy1QpiwH4C5J7AUDc46bidsH",
    AIRDROP_ADDRESS: "V2KjdDBQXjHi4Ub5QUt4VDJnKWq8V",
    user_seed: "nation finger unable fade exist visa arch awake anchor surround paddle riot",
    WITHDRAWAL_ADDESS: "V",
    BOT_PREFIX: "bot_",
    login: function (address, password, success, error) {
        postContract("mfm-token", "account", {
            domain: wallet.gas_domain,
            address: address
        }, function (response) {
            if (hash(calcHash(
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
                pass: calcStartPass(wallet.gas_domain, address, password)
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
    reg: function (domain, pin, success, error) {
        postContract("mfm-token", "account", {
            domain: domain,
            address: wallet.address()
        }, success, function () {
            if (pin) {
                wallet.calcUserPass(domain, pin, success, error)
            } else {
                getPin(function (pin) {
                    wallet.calcUserPass(domain, pin, success, error)
                })
            }
        })
    },
    logout: function () {
        storage.clear()
    },
    address: function () {
        return storage.getString(storageKeys.address)
    },
    calcUserStartPass: function (domain, pin) {
        return calcStartPass(domain, wallet.address(), decode(storage.getString(storageKeys.passhash), pin))
    },
    calcUserPass: function (domain, pin, success, error) {
        let passhash = storage.getString(storageKeys.passhash)
        let password = decode(passhash, pin)
        postContract("mfm-token", "account", {
            domain: domain,
            address: wallet.address()
        }, function (response) {
            success(calcPass(domain, wallet.address(), password, response.account.prev_key))
        }, function () {
            postContract("mfm-token", "send", {
                domain: domain,
                to: wallet.address(),
                pass: wallet.calcUserStartPass(domain, pin)
            }, function () {
                wallet.calcUserPass(domain, pin, success, error)
            })
        })
    },
    calcUserPassList: function (domains, pin, success, error) {
        let passes = {}
        for (const domain of domains) {
            wallet.calcUserPass(domain, pin, (pass) => {
                passes[domain] = pass
                if (domains.length == Object.keys(passes).length) {
                    success(passes)
                }
            }, error)
        }
    }
}

function xorCipher(word, key) {
    if (!key) return word
    let output = ""
    for (let i = 0; i < word.length; i++) {
        let inp = word.charCodeAt(i)
        let k = key.charCodeAt(i % key.length)
        output += String.fromCharCode(inp ^ k)
    }
    return output
}

const encode = xorCipher
const decode = xorCipher