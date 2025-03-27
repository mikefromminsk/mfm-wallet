function createOdometer(el, start, finish, duration, animation) {
    // animation = 'count'
    if (el == null) return
    const odometer = new Odometer({
        el: el,
        value: start,
        duration: duration || 3000,
        animation: animation,
    })
    const observer = new IntersectionObserver((entries) => {
        let hasRun = false
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!hasRun) {
                    odometer.update(finish)
                    hasRun = true
                }
            }
        })
    }, {
        threshold: [0, 0.9],
    })
    observer.observe(el)
}