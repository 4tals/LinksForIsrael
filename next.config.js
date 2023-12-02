/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  async redirects() {
    return [
      {
        source: '/Children',
        destination: '/FamilyAndPets',
        permanent: true,
      },
      {
        source: '/Donations',
        destination: '/Economic',
        permanent: true,
      },
      {
        source: '/Transportation',
        destination: '/SuppliesAndTransportation',
        permanent: true,
      },
      {
        source: '/Supplies',
        destination: '/SuppliesAndTransportation',
        permanent: true,
      },
      {
        source: '/Initiatives',
        destination: '/Aggregators',
        permanent: true,
      }
    ];
  },
};

module.exports = nextConfig;
