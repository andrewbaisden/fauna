/**
 * Neon/pg currently treat sslmode=require as verify-full and warn on every
 * connection. Pin remote URLs to verify-full; leave local Postgres alone.
 */
export function withVerifiedTls(connectionString: string): string {
  if (
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1")
  ) {
    return connectionString;
  }

  try {
    const url = new URL(connectionString);
    const mode = url.searchParams.get("sslmode");
    if (
      mode === null ||
      mode === "require" ||
      mode === "prefer" ||
      mode === "verify-ca"
    ) {
      url.searchParams.set("sslmode", "verify-full");
    }
    return url.toString();
  } catch {
    return connectionString;
  }
}
