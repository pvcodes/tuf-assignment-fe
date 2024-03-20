/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false, // 2 API call hori thi, isliye
	env: {
		API_URL: process.env.API_URL,
	},
};
export default nextConfig;