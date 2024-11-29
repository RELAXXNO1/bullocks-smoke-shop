class SafeTimer {
  constructor() {
    this.timers = new Map();
  }

  setTimeout(callback, delay) {
    const id = Math.random().toString(36).substring(7);
    const timeoutId = window.setTimeout(() => {
      this.clearTimeout(id);
      callback();
    }, delay);

    this.timers.set(id, timeoutId);
    return id;
  }

  clearTimeout(id) {
    const timeoutId = this.timers.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      this.timers.delete(id);
    }
  }

  clearAll() {
    this.timers.forEach((timeoutId, id) => {
      this.clearTimeout(id);
    });
  }
}

export const timer = new SafeTimer();