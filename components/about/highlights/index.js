import HighlightItem from "./highlight-item"

export default function Highlights({ highlights = [] }) {
	const _highlights = highlights.filter(({ frontMatter }) => {
		return frontMatter.highlight;
	}).map(project => {
		const { frontMatter, source } = project;
		console.log(project);

		return {
			...frontMatter,
			details: source
		};
	}).sort((a, b) => +a.order - +b.order);

	return (
		<section className="w-full flex flex-col py-20">
			<div className="w-full max-w-4xl mx-auto px-4">
				<h3 className="text-4xl font-bold mb-4">
                    Highlights
				</h3>
				<div className="grid grid-cols-4 gap-4">
					{_highlights.map((project, index) => <HighlightItem key={index} highlight={{ ...project, id: index }} />)}
				</div>
			</div>
		</section>
	)
}