import DesktopScreenshot from "./desktop-screenshot";
import DetailsPanel from "./details-panel";
import Media from "./media";
import MobileScreenshot from "./mobile-screenshot";
import ProjectCard from "./project-card";

export default function HighlightItem({ highlight }) {
	const { id, media = [], details, iconUrl, title, subtitle, link } = highlight;

	const handleScroll = () => {
		const el = document.getElementById(`project-${id}`);
		const currentScroll = el.scrollLeft;
		el.scroll({ left: currentScroll + 150, behavior: "smooth" });
	}

	return (
		<article
			className={`
                    relative group bg-white border border-1 border-gray-300 rounded-2xl
                    flex flex-col pt-4 cursor-pointer hover:shadow w-full
                `}
		>
			<div className="px-5 flex flex-col pb-4 grow">
				<p className="text-gray-700">
					{title}
				</p>
			</div>
			{link && (
				<a
					className="border-t border-gray-300 px-5 py-3 flex flex-row items-center justify-between"
					rel="noreferrer"
					target="_blank"
					href={link}
				>
					<span className="text-azure-500 text-sm">Read more</span>
					<div className="rounded-full bg-azure-500 group-hover:bg-mango-600 text-white flex flex-row justify-center items-center h-6 w-6 group-hover:translate-x-1 duration-200">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
						</svg>
					</div>
				</a>
			)}
		</article>
	);
}