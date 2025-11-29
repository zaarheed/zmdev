import ApplyButton from "@/components/intern/buttons/apply-button";

export default function Hero() {
	return (
		<section className="relative w-full bg-gradient-to-b from-zinc-800 to-zinc-900 h-screen flex flex-col justify-center">
			<figure className="absolute bottom-0 right-0 h-full w-full">
				<img src="/assets/intern-bg.webp" className="w-full h-full object-cover" />
			</figure>
			<img src="/assets/intern-hero.webp" className="absolute bottom-72 md:bottom-5 right-5 md:right-20 md:w-3/12 xl:w-2/12 w-4/12 animate-float" />
			<div className="absolute top-0 left-0 w-full h-screen flex flex-col pt-24 md:pt-0 justify-center">
				<div className="w-full max-w-4xl mx-auto flex flex-col px-4">
					<div className="w-full items-center flex flex-col justify-center">
						<h1 className="font-extrabold text-3xl md:text-7xl tracking-tight mb-1 text-zinc-100 text-center">
							Work directly with me.<br />
							Build incredible projects.
						</h1>
						<p className="text-base md:text-xl text-center text-zinc-200 mt-2 w-full md:w-[40rem] font-plex">
							<span className="font-semibold bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100 bg-clip-text text-transparent animate-gradient-x">Unprecedented</span> internship opportunity to supercharge your career
						</p>

						<ApplyButton />
						<p className="md:hidden text-xs text-zinc-300 font-light mt-2 text-center font-plex">
							Limited to one exceptional developer.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
