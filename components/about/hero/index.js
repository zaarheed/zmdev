import ContactCard from "@/components/shared/contact-card";

export default function Hero() {
	return (
		<section className="w-full bg-gradient-to-b from-azure-100 dark:from-zinc-900 dark:to-zinc-900 pt-32 pb-20 h-screen flex flex-col justify-center">
			<div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row px-4">
				<div className="w-full items-start lg:w-8/12 flex flex-col justify-center">
					<h1 className="font-extrabold text-3xl md:text-5xl tracking-tight mb-1 text-zinc-900 dark:text-zinc-100">
                        Perpetual hustler,<br />
                        not a real entrepreneur.
					</h1>
				</div>
				<div className="w-full lg:w-4/12 overflow-hidden p-2">
					{/* <ActionButton /> */}
					<div className="rotate-1 lg:rotate-3 hover:rotate-0 duration-200">
						<ContactCard />
					</div>
				</div>
			</div>
		</section>
	)
}