import ProjectCard from "./project-card";

export default function ProjectsAsThumbs({ projects = [] }) {
	const _projects = projects.map(project => {
		const { frontMatter, source } = project;

		return {
			...frontMatter,
			details: source
		};
	}).sort((a, b) => +a.order - +b.order);

	return (
		<section className="w-full grid py-20 dark:bg-zinc-900">
			<div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 mx-auto gap-4 px-4">
				{_projects.map((project, index) => <ProjectCard project={project} key={index} />)}
			</div>
		</section>
	)
}