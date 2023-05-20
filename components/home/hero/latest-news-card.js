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
				href="https://twitter.com/zaarheed/status/1650867627584045058"
				rel="noreferrer"
			>
				<p className="text-flesh-500 dark:text-zinc-500 font-medium text-xs">
                    Latest update
				</p>
				<p className="font-medium text-zinc-900 dark:text-zinc-100">
                    Come work with me!
				</p>
				<p className="text-zinc-700 dark:text-zinc-200">
                    I'm hiring engineers on a rolling basis. If you're interested in Healthcare and AI let's talk!
					<span className="block text-azure-500 dark:text-mango-500 font-medium group-hover:underline">
                        Learn more
					</span>
				</p>
			</a>
			<p className="text-zinc-400 dark:text-zinc-300 text-sm mt-4">
                Updated 25th April 2023
			</p>
		</div>
	)
}
