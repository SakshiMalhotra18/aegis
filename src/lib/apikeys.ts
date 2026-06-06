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
