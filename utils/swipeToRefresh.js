function swipeToRefresh(onRefresh) {
    setTimeout(() => {
        const containers = document.querySelectorAll(`.scroll`)
        containers.forEach(container => {
            const content = container.querySelector(`.block`)
            const refreshIcon = container.querySelector(`.refresh-icon`)
            let startY = 0
            let currentY = 0
            let isTouching = false

            if (!container.swipeEventAttached) {
                container.addEventListener('touchstart', function (event) {
                    if (container.scrollTop > 0 || container.classList.contains('no-swipe')) return
                    startY = event.touches[0].clientY
                    isTouching = true
                    content.style.transition = 'none'
                })

                container.addEventListener('touchmove', function (event) {
                    if (!isTouching || container.classList.contains('no-swipe')) return
                    currentY = event.touches[0].clientY
                    const translateY = Math.min(100, Math.max(0, currentY - startY))
                    content.style.transform = `translateY(${translateY}px)`
                    if (translateY > 50) {
                        refreshIcon.classList.add('visible')
                    } else {
                        refreshIcon.classList.remove('visible')
                    }
                })

                container.addEventListener('touchend', function () {
                    if (container.classList.contains('no-swipe')) return
                    if (currentY - startY > 150) {
                        if (onRefresh) {
                            onRefresh()
                        }
                    }
                    content.style.transition = 'transform 0.3s ease'
                    content.style.transform = 'translateY(0px)'
                    refreshIcon.classList.remove('visible')
                    isTouching = false
                })

                container.addEventListener('touchcancel', function () {
                    if (container.classList.contains('no-swipe')) return
                    content.style.transition = 'transform 0.3s ease'
                    content.style.transform = 'translateY(0px)'
                    refreshIcon.classList.remove('visible')
                    isTouching = false
                })

                container.swipeEventAttached = true
            }
        })
    }, 100)
}