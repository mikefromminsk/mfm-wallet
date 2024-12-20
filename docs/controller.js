function openDoc(link, success) {
    showDialog("docs", success, function ($scope) {
        get(link, function (text) {
            setMarkdown("doc_body", text)
        })
    })
}