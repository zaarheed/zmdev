import Contact from "@/components/home/contact";
import Hero from "@/components/home/hero";
import Projects from "@/components/home/projects";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { postFilePaths, PROJECTS_PATH } from "utils/mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import ProjectsAsThumbs from "@/components/home/projects-as-thumbs";

export default function Home({ projects = [] }) {
	return (
		<div className="w-full flex flex-col">
			<Header />
			<Hero />
			<ProjectsAsThumbs projects={projects} />
			<Contact />
			<Footer />
		</div>
	)
}

export async function getStaticProps({ params }) {
	const projectFilePaths = postFilePaths.map(p => path.join(PROJECTS_PATH, `${p}`));

	const projects = [];
	for (let i = 0; i < projectFilePaths.length; i++) {
		const path = projectFilePaths[i];

		const source = fs.readFileSync(path);
		const x = matter(source);
		const { content, data } = matter(source);
		const mdxSource = await serialize(content, {
			mdxOptions: {
				remarkPlugins: [],
				rehypePlugins: [],
			},
			scope: data,
		});

		projects.push({
			source: content === "" ? null : mdxSource,
			frontMatter: data
		});
	}



	return {
		props: { projects },
		revalidate: 1
	}
}