export function debounce(cb, delay) {
    let timer = null;
    return function () {
        let args = [...arguments];
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(
            () => {
                cb.apply(this, args);
            },
            delay);
    }
}
export function throttling(cb, delay) {
    let iscalled = false;
    return function () {
        let args = [...arguments];
        let context = this;
        if (!iscalled) {
            iscalled = true;
            cb.apply(context, args);
            setTimeout(() => {
                iscalled = false;
            }, delay);
        }
    }
}