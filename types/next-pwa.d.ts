declare module 'next-pwa' {
  import { NextConfig } from 'next';
  type PWAPluginConfig = Record<string, unknown>;
  export default function withPWAInit(config: PWAPluginConfig): (nextConfig: NextConfig) => NextConfig;
}
