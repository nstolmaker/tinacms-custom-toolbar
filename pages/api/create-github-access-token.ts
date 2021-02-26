import { createAuthHandler } from 'next-tinacms-github'
console.log({'thing':process.env})
export default createAuthHandler(
  process.env.GITHUB_CLIENT_ID || "",
  process.env.GITHUB_CLIENT_SECRET || "",
  process.env.SIGNING_KEY || ""
)


