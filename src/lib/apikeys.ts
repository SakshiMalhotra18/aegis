import crypto from "crypto"

export function generateApiKey(): {
  raw: string
  hash: string
  prefix: string
} {
  const raw =
    "aeg_live_" +
    crypto.randomBytes(32).toString("hex")
  const hash = crypto
    .createHash("sha256")
    .update(raw)
    .digest("hex")
  const prefix = raw.substring(0, 16) + "..."
  return { raw, hash, prefix }
}

export function hashApiKey(key: string): string {
  return crypto
    .createHash("sha256")
    .update(key)
    .digest("hex")
}

export function getApiKeyFromHeader(req: { headers: { get(name: string): string | null } }): string | null {
  const auth = req.headers.get("authorization") ?? req.headers.get("Authorization")
  if (!auth) return null
  const parts = auth.split(" ")
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") return null
  return parts[1] ?? null
}
