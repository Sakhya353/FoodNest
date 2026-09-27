import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/api';

// A single place that every service in /services goes through, so loading,
// timeout and error handling are consistent instead of re-implemented in
// every screen. Mirrors the routes actually exposed by server/index.js —
// no endpoint here is invented.

export class ApiError extends Error {
  constructor(message, { status, isNetworkError = false, isTimeout = false } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
  }
}

function friendlyMessage(error, status) {
  if (error?.isTimeout) return "That's taking too long. Please check your connection and try again.";
  if (error?.isNetworkError) return "We can't reach FoodNest right now. Check your internet connection or try again shortly.";
  if (status === 400) return 'Please check the details you entered and try again.';
  if (status && status >= 500) return 'Something went wrong on our end. Please try again in a moment.';
  return 'Something went wrong. Please try again.';
}

/**
 * POST helper matching the backend's convention (every existing Crust-main
 * route in server/Routes is a POST endpoint, so this app follows the same
 * contract rather than assuming REST verbs the backend doesn't implement).
 */
export async function apiPost(path, body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      const e = new ApiError('Request timed out', { isTimeout: true });
      e.friendlyMessage = friendlyMessage(e);
      throw e;
    }
    const e = new ApiError('Network request failed', { isNetworkError: true });
    e.friendlyMessage = friendlyMessage(e);
    throw e;
  }
  clearTimeout(timeout);

  let json = null;
  try {
    json = await response.json();
  } catch {
    // Some existing routes (see OrderData.js error branches) respond with
    // plain text instead of JSON on failure. Treat that as an empty body
    // rather than crashing the parser.
    json = null;
  }

  if (!response.ok) {
    const message = json?.errors
      ? (Array.isArray(json.errors) ? json.errors.map((e) => e.msg || e).join(', ') : json.errors)
      : `Request failed (${response.status})`;
    const e = new ApiError(message, { status: response.status });
    e.friendlyMessage = friendlyMessage(e, response.status);
    e.details = json;
    throw e;
  }

  return json;
}

export default { apiPost, ApiError };
