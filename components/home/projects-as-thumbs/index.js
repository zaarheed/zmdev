import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import classNames from "classnames";
import ProjectCard from "./project-card";
import DropletToggle from "./droplet-toggle";

// Each project's frontmatter says which half of life it belongs to:
//   half: foundering    founded it and made money from it
//   half: floundering   built it, or helped build it, while exploring
// A project without a `half` is shown under Floundering.
const HALVES = ["foundering", "floundering"];
const LABELS = { foundering: "Foundering", floundering: "Floundering" };

const halfOf = (project) => (project.half === "foundering" ? "foundering" : "floundering");

const byOrder = (a, b) =>
	(Number(a.order) || 999) - (Number(b.order) || 999) || String(a.title).localeCompare(String(b.title));

function Definition({ active, word, children }) {
	return (
		<span
			className={classNames(
				"block mt-2 transition-colors duration-300",
				active ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-500 dark:text-zinc-400"
			)}
		>
			<strong
				className={classNames(
					"font-semibold transition-colors duration-300",
					active && "text-azure-600 dark:text-mango-500"
				)}
			>
				{word}
			</strong>{" "}
			{children}
		</span>
	);
}

export default function ProjectsAsThumbs({ projects = [] }) {
	const [half, setHalf] = useState("foundering");
	const [direction, setDirection] = useState(1);
	const intro = useRef(null);
	const reduce = useReducedMotion();

	const _projects = projects.map(project => {
		const { frontMatter, source } = project;

		return {
			...frontMatter,
			details: source
		};
	}).sort(byOrder);

	const visible = _projects.filter((project) => halfOf(project) === half);
	const options = HALVES.map((id) => ({
		id,
		label: LABELS[id],
		count: _projects.filter((project) => halfOf(project) === id).length,
	}));

	const choose = (next) => {
		if (next === half) return;
		setDirection(HALVES.indexOf(next) > HALVES.indexOf(half) ? 1 : -1);
		setHalf(next);

		// Partway down the list? Bring the explanation and the top of the new half back into view.
		const element = intro.current;
		if (element && element.getBoundingClientRect().top < 96) {
			element.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
		}
	};

	// Cards slide in from the side the droplet is heading towards.
	const gridVariants = {
		enter: {},
		center: { transition: { staggerChildren: reduce ? 0 : 0.045 } },
		exit: (dir) => ({
			opacity: 0,
			x: reduce ? 0 : -24 * dir,
			transition: { duration: reduce ? 0 : 0.16, ease: "easeIn" },
		}),
	};
	const cardVariants = {
		enter: (dir) => ({ opacity: 0, x: reduce ? 0 : 32 * dir }),
		center: {
			opacity: 1,
			x: 0,
			transition: reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 },
		},
	};

	// overflow-x-clip stops the sliding cards from briefly widening the page on
	// phones, which let it shift sideways. It is clip, not hidden, because hidden
	// would stop the toggle from sticking.
	return (
		<section id="projects" className="w-full py-20 overflow-x-clip bg-white dark:bg-zinc-900">
			<div className="w-full max-w-4xl mx-auto px-4">
				<div className="sticky top-3 z-20 flex justify-center pointer-events-none">
					<div className="pointer-events-auto">
						<DropletToggle
							label="Projects"
							options={options}
							value={half}
							onChange={choose}
							controls="projects-panel"
						/>
					</div>
				</div>

				<p
					ref={intro}
					className="scroll-mt-24 mt-8 mx-auto max-w-2xl text-center font-plex text-base sm:text-lg leading-relaxed"
				>
					<Definition active={half === "foundering"} word="Foundering">
						is when I&apos;m locked in and building a business.
					</Definition>
					<Definition active={half === "floundering"} word="Floundering">
						is when I&apos;m open to curiosity and experimenting on the frontier.
					</Definition>
				</p>

				<div id="projects-panel" role="tabpanel" aria-labelledby={`tab-${half}`} className="mt-6">
					<AnimatePresence initial={false} exitBeforeEnter custom={direction}>
						<motion.div
							key={half}
							className="grid grid-cols-1 md:grid-cols-2 gap-4"
							variants={gridVariants}
							custom={direction}
							initial="enter"
							animate="center"
							exit="exit"
						>
							{visible.map((project) => (
								<motion.div key={project.title} variants={cardVariants} custom={direction}>
									<ProjectCard project={project} />
								</motion.div>
							))}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</section>
	)
}
