import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
// import Image from "next/image";
// import logo from "@/public/logo.png";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Pi Code",
	description: "A Code Submission Platform",
};

const Navbar = () => {
	return (
		<>
			<nav className="bg-white border-gray-200 dark:bg-gray-900">
				<div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
					<Link
						href="/"
						className="flex items-center space-x-3 rtl:space-x-reverse"
					>
						{/* <Image
							src={logo}
							width={30}
							height={30}
							alt="Picode Logo"
						/> */}
						<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
							PiCode
						</span>
					</Link>
					<div className="flex items-center space-x-6 rtl:space-x-reverse">
						<Link
							href="/all"
							className="text-sm  text-blue-600 dark:text-blue-500 hover:underline"
						>
							All Submission
						</Link>
					</div>
				</div>
			</nav>
		</>
	);
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
