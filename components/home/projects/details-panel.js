import { MDXRemote } from "next-mdx-remote";

export default function DetailsPanel({ details, excerpt }) {
	return (
		<div
			className={`
                relative border border-gray-300 rounded-2xl overflow-hidden
                bg-white w-[378px] lg:w-[550px]
            `}
		>
			<div className="border-b border-gray-300 px-5 py-3 flex flex-row items-center">
                Details
			</div>
			<div className="w-full prose p-4">
				<MDXRemote {...details} />
			</div>
		</div>
	);
}