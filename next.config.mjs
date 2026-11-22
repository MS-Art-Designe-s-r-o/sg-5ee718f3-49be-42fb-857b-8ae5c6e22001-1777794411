/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Zabalenie ESM utility balíkov priamo do buildu. Bez tohto Next necháva v
  // serverovom výstupe (_document.js a pod.) externé importy typu `import 'clsx'`,
  // ktoré na hostingu Polar55 padajú na "Cannot find package 'clsx'" a zhodia
  // CELÝ web (verejný aj portál, lebo _document je zdieľaný). Transpiláciou sa
  // tieto balíky stanú súčasťou výstupných chunkov — žiadny runtime import.
  transpilePackages: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "lucide-react",
    "tailwindcss-animate",
  ],
  // Obmedzenie počtu worker procesov pri builde — nutné na zdieľanom hostingu
  // (CloudLinux NPROC limit), inak `next build` padá s chybou spawn EAGAIN.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  i18n: {
    // Nový jazyk: pridajte kód sem a vytvorte slovník v src/locales (pozri src/locales/index.ts).
    locales: ["sk", "en", "de", "hu"],
    defaultLocale: "sk",
    localeDetection: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Obrázky blogu sú na disku (data/blog-images) — verejná URL mimo /api/ (robots.txt blokuje /api/).
  async rewrites() {
    return [{ source: "/blog/obrazky/:file", destination: "/api/blog/image/:file" }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
