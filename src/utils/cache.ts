/**
 * 缓存管理类
 */
class Cache {
  private storage: Storage;

  constructor(storageEngine: "local" | "session") {
    this.storage = storageEngine === "local" ? localStorage : sessionStorage;
  }

  /**
   * 写入
   */
  set(key: string, value: any, expire = 0) {
    const ttl = expire > 0 ? Date.now() + expire * 1000 : 0;
    this.storage.setItem(key, JSON.stringify({ value, ttl }));
  }

  /**
   * 读取
   */
  get(key: string, defaultValue: any = null) {
    const item = this.storage.getItem(key);
    if (!item) return defaultValue;
    try {
      const parsed = JSON.parse(item);
      if (typeof parsed === "object" && "ttl" in parsed && "value" in parsed) {
        return parsed.ttl === 0 || Date.now() <= parsed.ttl
          ? parsed.value
          : defaultValue;
      } else {
        return item;
      }
    } catch {
      return item;
    }
  }

  /**
   * 删除
   */
  delete(key: string) {
    this.storage.removeItem(key);
  }

  /**
   * 清空
   */
  clear() {
    this.storage.clear();
  }
}

export const localCache = new Cache("local");
export const sessionCache = new Cache("session");
