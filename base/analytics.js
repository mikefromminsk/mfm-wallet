const session = Math.random().toString(36).substring(2, 2 + 6/*length*/)

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
