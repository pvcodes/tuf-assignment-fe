"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Submission {
	id: string;
	username: string;
	language: string;
	timestamp: string;
	sourceCode: string;
}

const SubmissionTable: React.FC = () => {
	const [submissions, setSubmissions] = useState<Submission[]>([]);
	const [selectedSubmission, setSelectedSubmission] =
		useState<Submission | null>(null);
	const [searchUsername, setSearchUsername] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<any>(
					// "https://tuf-assignment-be.onrender.com/all"
					"http://localhost:3001/all"
				);
				const sortedSubmissions = response.data.data.response.sort(
					(a: Submission, b: Submission) => {
						return (
							new Date(b.timestamp).getTime() -
							new Date(a.timestamp).getTime()
						);
					}
				);
				setSubmissions(sortedSubmissions);
				setError(null); // Reset error state if successful
			} catch (error) {
				console.error("Error fetching data: ", error);
				setError(error.message); // Set error message in case of failure
			} finally {
				setLoading(false); // Set loading to false when done fetching
			}
		};

		fetchData();
	}, []);

	const handleSubmissionClick = (submission: Submission) => {
		setSelectedSubmission(submission);
	};

	const closeModal = () => {
		setSelectedSubmission(null);
	};

	const copyCodeToClipboard = () => {
		if (selectedSubmission) {
			navigator.clipboard.writeText(selectedSubmission.sourceCode);
		}
	};

	useEffect(() => {
		const handleCloseModalOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeModal();
			}
		};

		window.addEventListener("keydown", handleCloseModalOnEscape);

		return () => {
			window.removeEventListener("keydown", handleCloseModalOnEscape);
		};
	}, []);

	const filteredSubmissions = submissions.filter((submission) =>
		submission.username.toLowerCase().includes(searchUsername.toLowerCase())
	);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">Code Submissions</h1>
				{loading && (
					<div className="animate-pulse space-y-4">
						{[1, 2, 3].map((index) => (
							<div
								key={index}
								className="bg-gray-200 p-4 rounded-lg"
							>
								<div className="h-6 bg-gray-300 w-3/4 mb-2"></div>
								<div className="h-4 bg-gray-300 w-1/2"></div>
							</div>
						))}
					</div>
				)}
				{error && (
					<div className="text-red-600 mb-4">
						<p>{error}</p>
						<p>Please try again later.</p>
					</div>
				)}
				{!loading && (
					<div>
						<div className="mb-4">
							<input
								type="text"
								className="border border-gray-300 rounded-lg px-4 py-2"
								placeholder="Search by username"
								value={searchUsername}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setSearchUsername(e.target.value)
								}
							/>
						</div>
						<table className="w-full border-collapse border border-gray-300">
							<thead>
								<tr className="bg-gray-200">
									<th className="border border-gray-300 px-4 py-2">
										Submission ID
									</th>
									<th className="border border-gray-300 px-4 py-2">
										Username
									</th>
									<th className="border border-gray-300 px-4 py-2">
										Language
									</th>
									<th className="border border-gray-300 px-4 py-2">
										Submission Time (IST)
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredSubmissions.map((submission) => (
									<tr
										key={submission.id}
										className="hover:bg-gray-100 cursor-pointer"
									>
										<td
											className="border border-gray-300 px-4 py-2 text-blue-600 hover:underline"
											onClick={() =>
												handleSubmissionClick(
													submission
												)
											}
										>
											{submission.id}
										</td>
										<td className="border border-gray-300 px-4 py-2">
											{submission.username}
										</td>
										<td className="border border-gray-300 px-4 py-2">
											{submission.language}
										</td>
										<td className="border border-gray-300 px-4 py-2">
											{new Date(
												submission.timestamp
											).toLocaleString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{selectedSubmission && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
						<div className="bg-white p-8 max-w-lg mx-auto rounded-lg">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-bold">
									Code Submission ID: {selectedSubmission.id}
								</h2>
								<button
									onClick={closeModal}
									className="text-gray-500 hover:text-gray-700 focus:outline-none"
								>
									Close
								</button>
							</div>
							<div className="max-h-96 overflow-auto">
								<SyntaxHighlighter
									language={selectedSubmission.language}
									style={darcula}
									customStyle={{ width: "100%" }}
								>
									{selectedSubmission.sourceCode}
								</SyntaxHighlighter>
							</div>
							<button
								className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								onClick={copyCodeToClipboard}
							>
								Copy Code
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SubmissionTable;
