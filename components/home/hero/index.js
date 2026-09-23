import { useRef, useState } from "react";
import classNames from "classnames";
import Orbit from "./orbit";

// The opening plays in beats (timings in globals.css under "Hero intro"):
// the name rises in; the project logos gather in a heap over the tagline and
// burst out into orbit (orbit.js); the burst reveals the tagline, where
// "Perpetual hustler" shimmers in and, after a beat, the joke lands; the hand
// waves. Clicking the name replays the old letter animation.
export default function Hero({ projects = [] }) {
	const textRef = useRef(null);
	const taglineRef = useRef(null);
	const [revealed, setRevealed] = useState(false);

	const replayName = () => {
		const el = document.getElementById("word");
		el.classList.remove("active");
		void el.offsetWidth; // restart the letter animations
		el.classList.add("active");
	};

	return (
		<section
			className={classNames(
				"hero relative w-full min-h-[88svh] flex items-center justify-center overflow-hidden px-6 py-24",
				"bg-gradient-to-b text-zinc-700 dark:text-zinc-200 from-azure-100 dark:from-zinc-900 dark:to-zinc-900",
				revealed && "is-revealed"
			)}
		>
			<Orbit projects={projects} textRef={textRef} burstRef={taglineRef} onReveal={() => setRevealed(true)} />
			<div ref={textRef} className="relative z-10 inline-block max-w-full text-center">
				<h1 className="hero-name font-extrabold text-5xl sm:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-zinc-900 dark:text-zinc-100">
					<span className="hero-word" style={{ "--w": 0 }}>Hi,</span>{" "}
					<span className="hero-word" style={{ "--w": 1 }}>I&apos;m</span>{" "}
					<span className="hero-word" style={{ "--w": 2 }}>
						<span id="word" className="word cursor-pointer hover:text-gray-700" onClick={replayName}>
							<span className="inline-block">Z</span>
							<span className="inline-block">a</span>
							<span className="inline-block">h</span>
							<span className="inline-block">i</span>
							<span className="inline-block">d</span>
							{" "}
							<span className="hero-wave inline-block">👋</span>
						</span>
					</span>
				</h1>
				<h2 ref={taglineRef} className="mt-5 sm:mt-6 text-lg sm:text-2xl text-zinc-700 dark:text-zinc-200">
					<span className="tagline-premium inline-block font-semibold font-plex">Perpetual hustler</span>
					<span className="tagline-aside">, not a real entrepreneur</span>
				</h2>
			</div>
		</section>
	)
}
