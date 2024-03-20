import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
// import Link from "next/link";
// import Image from "next/image";
// import logo from "@/public/logo.png";
// import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Pi Code",
	description: "A Code Submission Platform",
};

// const Navbar = () => {
// 	const router = useRouter();

// 	// Determine the link URL and text based on the current route
// 	const linkUrl = router.pathname === "/all" ? "/" : "/all";
// 	const linkText =
// 		router.pathname === "/all"
// 			? "Create new Submission"
// 			: "All Submissions";

// 	return (
// 		<>
// 			<nav className="bg-white border-gray-200 dark:bg-gray-900">
// 				<div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
// 					<Link
// 						href="/"
// 						className="flex items-center space-x-3 rtl:space-x-reverse"
// 					>
// 						{/* <Image
//                             src={logo}
//                             width={30}
//                             height={30}
//                             alt="Picode Logo"
//                         /> */}
// 						<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
// 							PiCode
// 						</span>
// 					</Link>
// 					<div className="flex items-center space-x-6 rtl:space-x-reverse">
// 						<Link
// 							href={linkUrl}
// 							className="text-sm  text-blue-600 dark:text-blue-500 hover:underline"
// 						>
// 							{linkText}
// 						</Link>
// 					</div>
// 				</div>
// 			</nav>
// 		</>
// 	);
// };

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className}  min-h-screen flex flex-col`}>
				<Navbar />
				<main className="flex-grow">{children}</main>
				<div className="bg-white border-gray-200   mt-4 mb-1 px-4 text-center">
					Made with ❤️ by &nbsp;
					<a
						href="https://pvcodes.me/"
						className="text-blue-500 hover:text-blue-700 rounded underline"
						target="_blank"
					>
						pvcodes
					</a>
				</div>
			</body>
		</html>
	);
}
