import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ---------------------------------------------------------------------------
// FoodNest API configuration
// ---------------------------------------------------------------------------
// The existing Crust-main backend (server/) is reused as-is. This file is the
// ONLY place that decides which base URL the mobile app talks to, so nothing
// else in the app should hard-code a URL.
//
// Priority order:
//   1. EXPO_PUBLIC_API_URL  (set in a local .env file, see .env.example)
//   2. A sensible per-platform default for local development
//
// IMPORTANT — read before running on a physical device:
//   "localhost" / "127.0.0.1" on a physical phone refers to the PHONE itself,
//   not your development computer. If you are testing on a real Android
//   device over Wi-Fi, set EXPO_PUBLIC_API_URL to your computer's LAN IP,
//   e.g. http://192.168.1.23:5000/api  (find it with `ipconfig`/`ifconfig`).
//
//   The Android EMULATOR is different: it runs in a virtual machine, so it
//   uses the special alias 10.0.2.2 to reach the host machine's localhost.
// ---------------------------------------------------------------------------

const ENV_URL = process.env.EXPO_PUBLIC_API_URL;

const PRODUCTION_URL = process.env.EXPO_PUBLIC_API_URL || 'https://YOUR-FOODNEST-BACKEND.onrender.com/api';

function getDevelopmentDefault() {
  if (Platform.OS === 'android') {
    // Are we running inside the Android emulator or a real device?
    // Expo Go on a real device reports a LAN-style debugger host; the
    // emulator's loopback alias is 10.0.2.2.
    const isEmulator = !Constants.executionEnvironment
      || Constants.executionEnvironment === 'standalone'
      || Constants.deviceName === 'Android SDK built for x86'
      || Constants.deviceName === 'sdk_gphone64_arm64';
    return isEmulator
      ? 'http://10.0.2.2:5000/api'
      : PRODUCTION_URL; // safest default on a real device until EXPO_PUBLIC_API_URL is set
  }
  // iOS simulator (and web, for quick testing) can reach the host machine
  // directly via localhost.
  return 'http://localhost:5000/api';
}

export const API_BASE_URL = ENV_URL || getDevelopmentDefault();

export const REQUEST_TIMEOUT_MS = 12000;

export default { API_BASE_URL, REQUEST_TIMEOUT_MS };
