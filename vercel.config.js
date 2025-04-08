export default {
  version: 3,
  builds: [
    // Frontend build
    {
      src: "package.json",
      use: "@vercel/static-build",
      config: {
        distDir: "dist",
        buildCommand: "npm run build:frontend"
      }
    },
    // Backend serverless functions
    {
      src: "backend/src/api/**/*.js",
      use: "@vercel/node"
    }
  ],
  routes: [
    // API routes
    {
      src: "/api/(.*)",
      dest: "/backend/src/api/$1.js"
    },
    // Frontend routes
    {
      src: "/(.*)",
      dest: "/dist/$1"
    },
    // SPA fallback
    {
      src: "/(.*)",
      dest: "/dist/index.html"
    }
  ]
}