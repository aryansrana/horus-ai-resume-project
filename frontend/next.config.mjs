/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false, // Using temporary redirect for flexibility
      },
    ]
  },

  // Enable React strict mode for improved development experience
  reactStrictMode: true,

  // Disable x-powered-by header for security reasons
  poweredByHeader: false,

  // Add any other project-specific configurations here
}

export default nextConfig;