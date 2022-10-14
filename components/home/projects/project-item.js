import DesktopScreenshot from "./desktop-screenshot";
import DetailsPanel from "./details-panel";
import Media from "./media";
import MobileScreenshot from "./mobile-screenshot";
import ProjectCard from "./project-card";

export default function ProjectItem({ project }) {
	const { id, media = [], details } = project;

	const handleScroll = () => {
		const el = document.getElementById(`project-${id}`);
		const currentScroll = el.scrollLeft;
		el.scroll({ left: currentScroll + 150, behavior: "smooth" });
	}

	return (
		<article className="relative w-full flex flex-col space-y-5 md:space-y-0 py-20 md:py-0">
			<div className="h-full absolute top-0 right-1 z-10 overflow-visible flex flex-col justify-center">
				<button
					className={`
                        text-2xl font-extrabold
                    `}
					style={{ marginTop: 150 }}
					onClick={handleScroll}
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
			<div className="w-full md:hidden px-4">
				<ProjectCard project={project} />
			</div>
			<div id={`project-${id}`} className="w-full flex flex-row justify-end overflow-hidden overflow-x-scroll scrollbar-hidden">
				<div className="relative w-full max-w-4xl mx-auto">
					<div className="w-max flex flex-col space-y-5 md:space-y-0 md:flex-row md:space-x-5 px-4 items-start md:py-20">
						<div className="hidden md:block">
							<ProjectCard project={project} />
						</div>
						<div className="flex flex-row space-x-5 items-start">
							{details && (<DetailsPanel details={details} />)}
							{media && media.map((media, index) => <Media key={index} media={media} />)}
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}