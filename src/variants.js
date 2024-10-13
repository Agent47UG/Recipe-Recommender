export const fadeIn = (direction, delay, opacity, duration) => {
    return {
        hidden: {
            y: direction === 'up' ? 40 : direction === 'down' ? -40 : direction === 'up1' ? 20 : 0,
            x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
            opacity: opacity == true ? 0 : 1,
        },
        show: {
            y: 0,
            x: 0,
            opacity: 1,
            transition: {
                type: 'tween',
                duration: (typeof duration !== "undefined") ? duration : 1.2,
                delay: delay,
                ease: [0.25, 0.25, 0.25, 0.75],
            }
        }
    }
}