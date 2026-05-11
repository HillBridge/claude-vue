type StorageType = 'local' | 'session'

class Storage {
  private prefix: string

  constructor(prefix = 'app_') {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  private getStorage(type: StorageType): globalThis.Storage {
    return type === 'local' ? localStorage : sessionStorage
  }

  set<T>(key: string, value: T, type: StorageType = 'local'): void {
    const storage = this.getStorage(type)
    const item = {
      value,
      timestamp: Date.now(),
    }
    storage.setItem(this.getKey(key), JSON.stringify(item))
  }

  get<T>(key: string, type: StorageType = 'local'): T | null {
    const storage = this.getStorage(type)
    const raw = storage.getItem(this.getKey(key))
    if (!raw) return null

    try {
      const item = JSON.parse(raw)
      return item.value as T
    } catch {
      return null
    }
  }

  remove(key: string, type: StorageType = 'local'): void {
    this.getStorage(type).removeItem(this.getKey(key))
  }

  clear(type: StorageType = 'local'): void {
    const storage = this.getStorage(type)
    const keys = Object.keys(storage).filter((k) => k.startsWith(this.prefix))
    keys.forEach((k) => storage.removeItem(k))
  }
}

export const storage = new Storage()
export const sessionStorageUtil = new Storage()
