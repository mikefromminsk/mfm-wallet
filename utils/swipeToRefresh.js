function swipeToRefresh(onRefresh) {
    setTimeout(() => {
        const containers = document.querySelectorAll(`.scroll`)
        containers.forEach(container => {
            const content = container.querySelector(`.block`)
            let startY = 0
            let currentY = 0
            let isTouching = false

            if (!container.swipeEventAttached) {
                container.addEventListener('touchstart', function (event) {
                    if (container.scrollTop > 0) return
                    startY = event.touches[0].clientY
                    isTouching = true
                    content.style.transition = 'none'
                })

                container.addEventListener('touchmove', function (event) {
                    if (!isTouching) return
                    currentY = event.touches[0].clientY
                    const translateY = Math.min(100, Math.max(0, currentY - startY))
                    content.style.transform = `translateY(${translateY}px)`
                })

                container.addEventListener('touchend', function () {
                    if (currentY - startY > 150) {
                        if (onRefresh)
                            onRefresh()
                    }
                    content.style.transition = 'transform 0.3s ease'
                    content.style.transform = 'translateY(0px)'
                    isTouching = false
                })

                container.addEventListener('touchcancel', function () {
                    content.style.transition = 'transform 0.3s ease'
                    content.style.transform = 'translateY(0px)'
                    isTouching = false
                })

                container.swipeEventAttached = true
            }
        })
    }, 100)
}