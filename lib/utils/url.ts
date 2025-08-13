export async function getBaseUrl(): Promise<URL> {
  // In production, use the deployment URL
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`)
  }

  // In development, use localhost
  return new URL("http://localhost:3000")
}
