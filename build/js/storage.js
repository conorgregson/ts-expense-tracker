export class StorageManager {
    constructor(key) {
        this.key = key;
    }
    load(defaultValue) {
        try {
            const raw = localStorage.getItem(this.key);
            return raw ? JSON.parse(raw) : defaultValue;
        }
        catch {
            return defaultValue;
        }
    }
    save(value) {
        localStorage.setItem(this.key, JSON.stringify(value));
    }
    clear() {
        localStorage.removeItem(this.key);
    }
}
