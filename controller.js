function enableSwipeToRefresh(containerClass, contentClass) {
    const containers = document.querySelectorAll(`.${containerClass}`);

    containers.forEach(container => {
        const content = container.querySelector(`.${contentClass}`);
        let startY = 0;
        let currentY = 0;
        let isTouching = false;

        if (!container.swipeEventAttached) {
            container.addEventListener('touchstart', function(event) {
                startY = event.touches[0].clientY;
                isTouching = true;
                content.style.transition = 'none'; // Отключаем анимацию во время перемещения
            });

            container.addEventListener('touchmove', function(event) {
                if (!isTouching) return;
                currentY = event.touches[0].clientY;
                const translateY = Math.min(100, Math.max(0, currentY - startY));
                content.style.transform = `translateY(${translateY}px)`;
            });

            container.addEventListener('touchend', function() {
                if (currentY - startY > 50) {
                    // Здесь можно добавить логику обновления контента
                }
                content.style.transition = 'transform 0.3s ease'; // Добавляем плавный переход
                content.style.transform = 'translateY(0px)';
                isTouching = false;
            });

            container.addEventListener('touchcancel', function() {
                content.style.transition = 'transform 0.3s ease'; // Добавляем плавный переход
                content.style.transform = 'translateY(0px)';
                isTouching = false;
            });

            container.swipeEventAttached = true;
        }
    });
}


function start($scope) {
    trackCall(arguments)

    function setIcon() {
        let link = document.createElement('link');
        link.rel = 'icon';
        link.href = DEBUG ? 'logo-debug.png' : 'logo.png';
        document.head.appendChild(link);
    }

    setIcon()

    $scope.menu = ["history", "home", "wallet"]
    $scope.selectedIndex = 1
    $scope.selectTab = function (tab) {
        $scope.selectedIndex = tab
        if (tab == 0) {
            addHistory($scope)
        } else if (tab == 1) {
            addHome($scope)
        } else if (tab == 2) {
            addWallet($scope)
        }
        setTimeout(function () {
            enableSwipeToRefresh('scroll', 'block');
        }, 100)
    }

    $scope.selectTab($scope.selectedIndex)

    if (getParam("o")) {
        trackEvent("email_referer", getParam("o"), getParam("email"))
        window.history.pushState({}, document.title, "/mfm-wallet");
    }

    if (window.Telegram != null) {
        setTimeout(function () {
            let userData = window.Telegram.WebApp.initDataUnsafe
            if (userData.user != null) {
                window.telegram_username = userData.user.username
                trackEvent("tg_referer", null, window.telegram_username)
            }
        })
    }


    connectWs();
}