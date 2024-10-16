function controller(callback) {
    let app = angular.module("App", ['ngMaterial', 'ngAnimate'])
    app.config(function ($mdThemingProvider) {
        $mdThemingProvider.disableTheming();
    })
    app.controller("Controller", function ($scope, $mdBottomSheet, $mdDialog, $mdToast) {
        addFormats($scope)
        window.$mdToast = $mdToast
        window.$mdBottomSheet = $mdBottomSheet
        window.$mdDialog = $mdDialog
        callback($scope)
    })
}

function showDialog(templateUrl, onClose, controller) {
    window.$mdDialog.show({
        templateUrl: templateUrl,
        escapeToClose: false,
        multiple: true,
        controller: function ($scope) {
            addFormats($scope)
            controller($scope)
        }
    }).then(function (result) {
        if (onClose)
            onClose(result)
    })
}

function showBottomSheet(templateUrl, onClose, controller) {
    window.$mdBottomSheet.show({
        templateUrl: templateUrl,
        escapeToClose: false,
        multiple: true,
        controller: function ($scope) {
            addFormats($scope)
            controller($scope)
        }
    }).then(function (result) {
        if (onClose)
            onClose(result)
    })
}


function selectFile(success, accept) {
    var input = document.createElement('input')
    input.type = 'file'
    input.accept = accept || "*/*"
    input.onchange = e => {
        if (success != null)
            success(e.target.files[0])
    }
    input.click()
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
}

function objectToForm(data) {
    var formData = new FormData();
    angular.forEach(data, function (value, key) {
        formData.append(key, value);
    });
    return formData;
}

function downloadFile(uri) {
    var link = document.createElement("a");
    link.setAttribute('download', uri.split(/(\\|\/)/g).pop());
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function animateFocus(id) {
    document.getElementById(id).animate(
        [
            {transform: "translateY(0px)"},
            {transform: "translateY(1px)"},
            {transform: "translateY(-1px)"},
            {transform: "translateY(0px)"},
        ],
        {
            duration: 300,
            iterations: 5,
        },
    )
}

function setFocus(id) {
    setTimeout(function () {
        document.getElementById(id).focus()
    }, 500)
}

function showError(message, error) {
    if (error) {
        error(message)
    } else {
        if (window.$mdToast != null) {
            window.$mdToast.show(window.$mdToast.simple().toastClass('red-toast').textContent(message))
        } else {
            alert(message)
        }
    }
}

function showSuccess(message, success) {
    if (window.$mdToast != null) {
        window.$mdToast.show(window.$mdToast.simple().toastClass('green-toast').textContent(message))
    } else {
        alert(message)
    }
    if (success)
        success(message)
}