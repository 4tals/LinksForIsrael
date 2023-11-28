/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  async redirects() {
    return [
      {
        source: '/RedirectExample',
        destination: '/',
        permanent: true, // set to `false` if it's a temporary redirect
      },
    ];
  },
};

module.exports = nextConfig;
