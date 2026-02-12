import AsyncStorage from "@react-native-async-storage/async-storage";

export async function get<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : null;
}

export async function set<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function multiGet(keys: string[]) {
  const pairs = await AsyncStorage.multiGet(keys);
  return pairs.reduce<Record<string, string | null>>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
}

export async function clear() {
  await AsyncStorage.clear();
}
