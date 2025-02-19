/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'
import runtimeCaching from 'next-pwa/cache.js'

const config = {}

const nextConfig = withPWA ({
    dest: 'public',
    disable: false,
    runtimeCaching
})( config );






export default nextConfig;
