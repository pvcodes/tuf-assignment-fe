"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import * as Joi from "joi";
import Link from "next/link";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

interface FormData {
	username: string;
	language: string;
	language_id: Number;
	sourceCode: string;
	stdInput?: string;
}
interface Language {
	id: number;
	name: string;
	is_archived: boolean;
}

const UsernameInput: React.FC<{
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
	<div>
		<label
			htmlFor="username"
			className="block text-sm font-medium text-gray-700"
		>
			Username
		</label>
		<input
			type="text"
			id="username"
			name="username"
			value={value}
			onChange={onChange}
			placeholder="Enter your username"
			className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
			required
		/>
	</div>
);

const LanguageSelect: React.FC<{
	value: Number;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	languages: Language[];
}> = ({ value, onChange, languages }) => {
	return (
		<div>
			<label
				htmlFor="language"
				className="block text-sm font-medium text-gray-700"
			>
				Code Language
			</label>
			<select
				id="language"
				name="language"
				value={Number(value)}
				onChange={onChange}
				className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
				required
			>
				{languages.map((language) => (
					<option key={language.id} value={language.id}>
						{language.name}
					</option>
				))}
			</select>
		</div>
	);
};

const SourceCodeEditor: React.FC<{
	value: string;
	onChange: (value: string) => void;
	language: string;
}> = ({ value, onChange, language }) => (
	<div>
		<label
			htmlFor="sourceCode"
			className="block text-sm font-medium text-gray-700"
		>
			Source Code
		</label>
		<AceEditor
			mode={
				language === "javascript"
					? "javascript"
					: language === "python"
					? "python"
					: "c_cpp"
			}
			theme="tomorrow_night_eighties"
			value={value}
			onChange={onChange}
			className="mt-1 block w-full rounded-md"
			fontSize={14}
			showPrintMargin={true}
			showGutter={true}
			highlightActiveLine={true}
			setOptions={{
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: true,
				enableSnippets: true,
				showLineNumbers: true,
				tabSize: 2,
			}}
			width="100%"
			height="500px" // Adjust the height as needed
		/>
	</div>
);

const StdInput: React.FC<{
	value: string;
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ value, onChange }) => (
	<div>
		<label
			htmlFor="stdInput"
			className="block text-sm font-medium text-gray-700"
		>
			Standard Input (optional)
		</label>
		<textarea
			id="stdInput"
			name="stdInput"
			value={value}
			onChange={onChange}
			placeholder="Enter standard input"
			className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 h-32" // Increased height to h-32
		/>
	</div>
);

const Popup: React.FC<{ message: string; onClose: () => void }> = ({
	message,
	onClose,
}) => (
	<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
		<div className="bg-white p-4 rounded-md">
			<p>{message}</p>
			<p>
				View all submissions{" "}
				<Link href="/all" className="text-blue-600 hover:underline">
					here
				</Link>
				.
			</p>
			<button
				className="bg-indigo-600 text-white py-2 px-4 rounded-md ml-2"
				onClick={onClose}
			>
				Close
			</button>
		</div>
	</div>
);

const schema = Joi.object({
	username: Joi.string().alphanum().required(),
	language: Joi.string().required(),
	language_id: Joi.number().required(),
	sourceCode: Joi.string().required(),
	stdInput: Joi.string().optional(),
});

const CodeSubmissionForm: React.FC = () => {
	const [languages, setLanguages] = useState<Language[]>([]);
	const [formData, setFormData] = useState<FormData>({
		username: "",
		language: "Assembly (NASM 2.14.02)",
		sourceCode: "",
		stdInput: "",
		language_id: 45,
	});
	const [error, setError] = useState<string>("");
	const [submissionId, setSubmissionId] = useState<string>("");
	const [showPopup, setShowPopup] = useState<boolean>(false);
	const [popupMessage, setPopupMessage] = useState<string>("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [languagesResponse] = await Promise.all([
					axios.get<any>(`https://ce.judge0.com/languages/all`, {
						headers: { "Content-Type": "application/json" },
					}),
					// Add additional API calls here if needed
				]);

				let data: Language[] = languagesResponse.data;
				const nonArchivedLanguages = data.filter(
					(language) => !language.is_archived
				);

				setLanguages(nonArchivedLanguages);
				console.log(3, nonArchivedLanguages);
			} catch (error: any) {
				console.error("Error fetching data: ", error);
			}
		};
		fetchData();
	}, []);

	const handleChange = (key: keyof FormData, value: Number | string) => {
		if (key === "language_id") {
			const selectedLang = languages.find((lang) => lang.id === value);
			if (selectedLang) {
				setFormData({
					...formData,
					language: selectedLang.name,
					[key]: value as any,
				});
			} else {
				console.error("unable to set form");
			}
			return;
		}

		setFormData({ ...formData, [key]: value });
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Show loading state
		setPopupMessage("Submission in process...");
		setShowPopup(true);
		console.log(858, formData);
		if (!formData.stdInput) {
			delete formData.stdInput;
		}

		const { error: validationError } = schema.validate(formData, {
			abortEarly: false,
		});
		if (validationError) {
			setPopupMessage(
				validationError.details
					.map((err: any) => err.message)
					.join(", ")
			);
			setError(
				validationError.details.map((err) => err.message).join(", ")
			);
			return;
		}

		try {
			const response = await axios.post(
				`${process.env.API_URL}/submit`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.success) {
				setSubmissionId(response.data.data.submissionId);
				setPopupMessage(
					`Submission successful with id ${response.data.data.submissionId}.`
				);
				setError("");
			} else {
				setPopupMessage(response.data.error || "Something went wrong.");
				setSubmissionId("");
			}
		} catch (err) {
			setPopupMessage(`Something went wrong. Please try again.`);
			setSubmissionId("");
		}

		// Hide loading state
		setShowPopup(true);
		setTimeout(() => setShowPopup(false), 5000); // Hide the popup after 3 seconds

		setFormData({
			username: "",
			language: "Assembly (NASM 2.14.02)",
			sourceCode: "",
			stdInput: "",
			language_id: 45,
		});
	};

	const closePopup = () => {
		setShowPopup(false);
	};

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="w-9/12">
				<form onSubmit={handleSubmit} className="space-y-4">
					<UsernameInput
						value={formData.username}
						onChange={(e) =>
							handleChange("username", e.target.value as string)
						}
					/>
					<LanguageSelect
						value={formData.language_id}
						languages={languages}
						onChange={(e) =>
							handleChange(
								"language_id",
								parseInt(e.target.value)
							)
						}
					/>
					<SourceCodeEditor
						value={formData.sourceCode}
						onChange={(value) => handleChange("sourceCode", value)}
						language={formData.language}
					/>
					<StdInput
						value={formData.stdInput || ""}
						onChange={(e) =>
							handleChange("stdInput", e.target.value)
						}
					/>
					<button
						type="submit"
						className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
					>
						Save and Run
					</button>
				</form>
				{showPopup && (
					<Popup message={popupMessage} onClose={closePopup} />
				)}
				{error && <p className="mt-4 text-red-600">{error}</p>}
				{submissionId && (
					<p className="mt-4 text-green-600">
						Submission ID: {submissionId}
					</p>
				)}
			</div>
		</div>
	);
};

export default CodeSubmissionForm;
