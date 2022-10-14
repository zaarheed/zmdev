import Hero from "@/components/about/hero";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { milestoneFilePaths, MILESTONES_PATH } from "utils/mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import Highlights from "@/components/about/highlights";

export default function About({ milestones = [] }) {
	return (
		<div className="w-full flex flex-col">
			<Header />
			<Hero />

			{/* <div id="highlights" />
			<Highlights highlights={milestones} /> */}

			<Footer />
		</div>
	)
}

export async function getStaticProps({ params }) {
	const projectFilePaths = milestoneFilePaths.map(p => path.join(MILESTONES_PATH, `${p}`));

	const milestones = [];
	for (let i = 0; i < projectFilePaths.length; i++) {
		const path = projectFilePaths[i];

		const source = fs.readFileSync(path);
		const x = matter(source);
		const { content, data } = matter(source);

		if (data.isMilestone === true) continue;

		const mdxSource = await serialize(content, {
			mdxOptions: {
				remarkPlugins: [],
				rehypePlugins: [],
			},
			scope: data,
		});

		milestones.push({
			source: content === "" ? null : mdxSource,
			frontMatter: data
		});
	}



	return {
		props: { milestones },
		revalidate: 1
	}
}