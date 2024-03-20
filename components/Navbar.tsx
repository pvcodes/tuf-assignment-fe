"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
	const path = usePathname();

	// Determine the link URL and text based on the current route
	const linkUrl = path === "/all" ? "/" : "/all";
	const linkText =
		path === "/all" ? "Create new Submission" : "All Submissions";

	return (
		<>
			<nav className="bg-white border-gray-200 dark:bg-gray-900">
				<div className="flex justify-between items-center mx-auto max-w-screen-xl p-4">
					<Link
						href="/"
						className="flex items-center space-x-3 rtl:space-x-reverse"
					>
						<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
							PiCode
						</span>
					</Link>
					<div className="flex items-center space-x-6 rtl:space-x-reverse">
						<Link
							href={linkUrl}
							className="text-sm  text-blue-600 dark:text-blue-500 hover:underline"
						>
							{linkText}
						</Link>
					</div>
				</div>
			</nav>
		</>
	);
}
