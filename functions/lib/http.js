// ========================================================
//  Shared HTTP utilities for Pages Functions API
//  Adapted from player-site-starter.
// ========================================================

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

export const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init.headers || {})
    }
  });

export const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

export const readJson = async (request) => {
  const text = await request.text();
  if (!text.trim()) return {};

  try {
    return JSON.parse(text);
  } catch (error) {
    const err = new Error("Request body must be valid JSON.");
    err.status = 400;
    throw err;
  }
};

const decodeBase64Url = (value) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const decoded = atob(padded);
  return decodeURIComponent(
    Array.from(decoded, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join("")
  );
};

const emailFromJwt = (token) => {
  if (!token || !token.includes(".")) return "";
  try {
    const payload = JSON.parse(decodeBase64Url(token.split(".")[1]));
    return normalizeEmail(payload.email);
  } catch (error) {
    return "";
  }
};

const cookieValue = (request, name) => {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookieHeader.split(";").map((part) => part.trim());
  const match = cookies.find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
};

export const getEmailFromRequest = (request) => {
  const headerEmail = request.headers.get("cf-access-authenticated-user-email");
  if (headerEmail) return normalizeEmail(headerEmail);

  const assertionEmail = emailFromJwt(request.headers.get("cf-access-jwt-assertion"));
  if (assertionEmail) return assertionEmail;

  return emailFromJwt(cookieValue(request, "CF_Authorization"));
};

const isLocalRequest = (request) => {
  const { hostname } = new URL(request.url);
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
};

export const requireUser = (request, env = {}) => {
  const accessEmail = getEmailFromRequest(request);
  if (accessEmail) return { email: accessEmail };

  if (isLocalRequest(request) && env.DEV_AUTH_EMAIL) {
    return { email: normalizeEmail(env.DEV_AUTH_EMAIL) };
  }

  return null;
};

export const requireDb = (env = {}) => {
  if (!env.PLAYER_DB) {
    const err = new Error("PLAYER_DB D1 binding is not configured.");
    err.status = 500;
    throw err;
  }
  return env.PLAYER_DB;
};

export const handleError = (error) => {
  const status = Number(error.status || 500);
  const message = status === 500 ? "Internal server error." : error.message;
  return json({ error: message }, { status });
};
