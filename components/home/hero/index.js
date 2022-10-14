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
		<section className="w-full bg-gradient-to-b from-azure-100 pt-32 pb-20">
			<div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row px-4">
				<div className="w-full items-start lg:w-7/12 flex flex-col justify-center">
					<h1 className="font-extrabold text-3xl md:text-5xl tracking-tight mb-1 text-gray-900">
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
					<h2 className="text-gray-700 mb-4">
						<span className="font-semibold">Perpetual hustler</span>,
                        not a real entrepreneur
					</h2>
					<p className="text-gray-600">
                        I build delightful digital experiences on the web to make the world a better place.
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