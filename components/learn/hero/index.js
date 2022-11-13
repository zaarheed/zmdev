import SignupButton from "@/components/learn/buttons/signup-button";
import OfferCard from "@/components/learn/offer-card";

export default function Hero() {
	return (
		<section className="relative w-full bg-gradient-to-b from-azure-100 dark:from-zinc-800 dark:to-zinc-900 h-screen flex flex-col justify-center">
			<img src="/assets/learn-header.png" className="absolute dark:hidden top-0 right-0" />
			<img src="/assets/learn-header-dark.png" className="absolute hidden dark:block top-0 right-0" />
			<div className="absolute top-0 left-0 w-full h-screen flex flex-col pt-24 md:pt-0 justify-center">
				<div className="w-full max-w-4xl mx-auto flex flex-col px-4">
					<div className="w-full items-center flex flex-col justify-center">
						<h1 className="font-extrabold text-3xl md:text-7xl tracking-tight mb-1 text-zinc-900 dark:text-zinc-100 text-center">
							The internet is wild.<br />
							It can change your life.
						</h1>
						<p className="text-base md:text-2xl text-center text-zinc-700 dark:text-zinc-200 mt-2 w-full md:w-[40rem] font-plex">
							I'll teach you how to code
						</p>
						<p className="text-sm md:text-lg text-center text-zinc-700 dark:text-zinc-200 mt-1 w-full md:w-[40rem] font-plex">
							20 minutes a day for 2 weeks. All from your iPhone.
						</p>

						<SignupButton />
						<p className="md:hidden text-xs text-zinc-500 dark:text-zinc-300 font-light mt-2 text-center font-plex">
							Sign up before the first course is released and get 50% off. Discount automatically applied at checkout.
						</p>

						<div className="hidden md:flex w-full mt-20 flex flex-row justify-center md:justify-end px-4">
							<OfferCard />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}