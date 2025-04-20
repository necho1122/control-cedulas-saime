/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // No es necesario agregar dominios para imágenes en la carpeta public
    unoptimized: true, // Desactiva la optimización de imágenes para entornos como Netlify
  },
};

export default nextConfig;
