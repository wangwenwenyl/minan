
const EventEmitterProvider = require('events').EventEmitter

class EventEmitter extends EventEmitterProvider {
    eventName= false;
    toggleCollapsed = () => {
        this.emit('toggle',!this.eventName)
    }
    toggle() {
        this.toggleCollapsed()
    }
}

export default new EventEmitter()