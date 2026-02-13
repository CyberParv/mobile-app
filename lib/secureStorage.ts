import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

type SecureKey = string;

export async function getSecureItem(key: SecureKey): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
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
      if (typeof window !== "undefined") window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
    return;
  }

  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK
  });
}

export async function removeSecureItem(key: SecureKey): Promise<void> {
  if (Platform.OS === "web") {
    try {
      if (typeof window !== "undefined") window.localStorage.removeItem(key);
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
