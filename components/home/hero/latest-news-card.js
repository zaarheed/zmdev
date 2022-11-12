import classNames from "classnames"

export default function LatestNewsCard() {
	return (
		<div className="w-full flex flex-col overflow-hidden p-4 cursor-pointer">
			<a
				className={classNames(
					"bg-white dark:bg-zinc-800 rounded-lg py-4 px-6 flex flex-col w-full lg:w-96",
					"transform -rotate-2 shadow dark:shadow-none transform hover:scale-105 duration-300",
					"group font-plex"
				)}
				target="_blank"
				href="https://twitter.com/zaarheed/status/1446817675733241859"
				rel="noreferrer"
			>
				<p className="text-flesh-500 dark:text-zinc-500 font-medium text-xs">
                    Latest update
				</p>
				<p className="font-medium text-zinc-900 dark:text-zinc-100">
                    I relaunched Buskana!
				</p>
				<p className="text-zinc-700 dark:text-zinc-200">
                    Buskana is now a digital ordering platform
                    for festivals &amp; events.{" "}
					<span className="block text-azure-500 dark:text-mango-500 font-medium group-hover:underline">
                        Learn more
					</span>
				</p>
			</a>
			<p className="text-zinc-400 dark:text-zinc-300 text-sm mt-4">
                Updated 24th September 2021
			</p>
		</div>
	)
}