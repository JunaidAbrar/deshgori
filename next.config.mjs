/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export only — Hard Constraint 2. No backend, no server runtime.
  output: 'export',
  // Each route becomes a folder with index.html → deploys unchanged to
  // Cloudflare Pages, Firebase Hosting, S3, or a bare nginx box (Constraint 6).
  trailingSlash: true,
  // No Image Optimization server in a static export.
  images: { unoptimized: true },
};

export default nextConfig;
