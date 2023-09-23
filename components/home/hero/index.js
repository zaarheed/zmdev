import Phone from "@/components/home/phone";
import Technologies from "../technologies";
import LatestNewsCard from "./latest-news-card";

export default function Hero() {
	const handleClick = () => {
		const el = document.getElementById("word");
		el.classList.toggle("active");
		setTimeout(() => {
			el.classList.toggle("active");
		}, 50);
	}

	return (
		<section className="w-full bg-gradient-to-b text-zinc-700 dark:text-zinc-200 from-azure-100 dark:from-zinc-900 dark:to-zinc-900 pt-32 pb-20">
			<div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row px-4">
				<div className="w-full items-start lg:w-7/12 flex flex-col justify-center">
					<h1 className="font-extrabold text-3xl md:text-5xl tracking-tight mb-1 text-zinc-900 dark:text-zinc-100">
                        Hi, I&apos;m{" "}
						<span id="word" className="word active cursor-pointer hover:text-gray-700" onClick={handleClick}>
							<span className="inline-block">Z</span>
							<span className="inline-block">a</span>
							<span className="inline-block">h</span>
							<span className="inline-block">i</span>
							<span className="inline-block">d</span>
							{" "}
							<span className="inline-block">👋</span>
						</span>
					</h1>
					<h2 className="text-zinc-700 dark:text-zinc-200 mb-4">
						<span className="font-semibold font-plex">Perpetual hustler</span>,
                        not a real entrepreneur
					</h2>
					<p className="text-zinc-600 dark:text-zinc-300 font-plex">
                        I build software to solve big problems and make the world a better place.
					</p>
					<div className="w-full flex flex-row justify-start py-3">
						<Technologies />
					</div>
					<div className="mb-16" />
					<LatestNewsCard />
				</div>
				<div className="w-full lg:w-5/12 overflow-hidden p-2">
					<Phone />
				</div>
			</div>
		</section>
	)
}
