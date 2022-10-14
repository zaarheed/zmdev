import ProjectItem from "./project-item"
import SeeMore from "./see-more";

export default function Projects({ projects = [] }) {
	const _projects = projects.map(project => {
		const { frontMatter, source } = project;

		return {
			...frontMatter,
			details: source
		};
	}).sort((a, b) => +a.order - +b.order);

	return (
		<section className="w-full flex flex-col py-20">
			{_projects.map((project, index) => <ProjectItem key={index} project={{ ...project, id: index }} />)}
			<SeeMore />
		</section>
	)
}