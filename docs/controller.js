function openDoc(link, success) {
    showDialog('/mfm-wallet/docs/index.html', success, function ($scope) {
        get(link, function (text) {
            setMarkdown("doc_body", text)
        })
    })
}