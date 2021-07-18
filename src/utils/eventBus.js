class EventEmitBus {
    constructor() {
        this.handlers = {}
    }
    on(name, cb) {
        this.handlers[name] || (this.handlers[name] = []);
        this.handlers[name].push(cb);
    }
    emit(name, ...args) {
        if (this.handlers[name]) {
            this.handlers[name].forEach(fn => {
                fn.apply(this, args);
            })
        }
    }
    off(name, cb) {
        if (cb) {
            this.handlers[name] &&
                (this.handlers[name].forEach((el, i) => {
                    if (el === cb)
                        this.handlers[name].splice(i, 1);
                }))
        }
        else
            this.handlers[name] && (this.handlers[name] = []);

    }
    once(name, cb) {
        let iscalled = false;
        this.handlers[name] || (this.handlers[name] = []);
        this.handlers[name].push((...args) => {
            if (!iscalled)
                cb(...args);
            iscalled = true;
        })
    }
}
export default EventEmitBus;
