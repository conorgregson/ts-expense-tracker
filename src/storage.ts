export class StorageManager<T> {
  constructor(private key: string) {}

  load(defaultValue: T): T {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  save(value: T): void {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}
