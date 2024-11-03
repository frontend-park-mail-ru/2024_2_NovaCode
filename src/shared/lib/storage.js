export class Storage {
  static load(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  static save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key) {
    localStorage.removeItem(key);
  }
}
