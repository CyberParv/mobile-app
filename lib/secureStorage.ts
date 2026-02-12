import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

type SecureKey = string;

const webPrefix = "secure:";

export async function getSecureItem(key: SecureKey): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return window.localStorage.getItem(`${webPrefix}${key}`);
    } catch {
      return null;
    }
  }

  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function setSecureItem(key: SecureKey, value: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      window.localStorage.setItem(`${webPrefix}${key}`, value);
    } catch {
      // ignore
    }
    return;
  }

  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
}

export async function removeSecureItem(key: SecureKey): Promise<void> {
  if (Platform.OS === "web") {
    try {
      window.localStorage.removeItem(`${webPrefix}${key}`);
    } catch {
      // ignore
    }
    return;
  }

  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // ignore
  }
}
