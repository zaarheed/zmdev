import Technologies from "../technologies";
import TECHNOLOGIES_DICTIONARY from "@/constants/technologies";

export default function ProjectCard({ project }) {
	const { title, iconUrl, subtitle, link, technologies = [], githubLink } = project;
	return (
		<div
			className={`
                relative group bg-white border border-1 border-gray-300 rounded-2xl
                flex flex-col pt-14 cursor-pointer hover:shadow w-full md:w-[350px]
            `}
		>
			<div className="absolute overflow-hidden h-20 w-20 -top-8 left-5">
				<img
					src={iconUrl}
					className="object-cover h-full w-full"
					alt=""
				/>
			</div>
			<div className="px-5 flex flex-col pb-4">
				<p className="text-xl font-semibold">
					{title}
				</p>
				<p className="text-gray-700">
					{subtitle}
				</p>
			</div>
			<div className="border-t border-gray-300 px-5 py-3 flex flex-row items-center">
				{link && (
					<a
						className=""
						rel="noreferrer"
						target="_blank"
						href={link}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2 transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
						</svg>
						<span>Learn more</span>
					</a>
				)}
				{!link && githubLink && (
					<a
						className="flex flex-row items-center"
						rel="noreferrer"
						target="_blank"
						href={githubLink}
					>
						<img
							src="/assets/github-icon.svg"
							className="h-4 w-4 inline-block mr-2 transform duration-300 group-hover:translate-x-1"
							alt=""
						/>
						<span>GitHub</span>
					</a>
				)}
				{!link && !githubLink && technologies.length > 0 && (
					<Technologies technologies={technologies.map(name => TECHNOLOGIES_DICTIONARY.find(t => t.name === name)).filter(Boolean)} />
				)}
			</div>
		</div>
	);
}