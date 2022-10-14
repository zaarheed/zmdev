import classNames from "classnames"

export default function LatestNewsCard() {
	return (
		<div className="w-full flex flex-col overflow-hidden p-4 cursor-pointer">
			<a
				className={classNames(
					"bg-white rounded-lg py-4 px-6 flex flex-col w-full lg:w-96",
					"transform -rotate-2 shadow transform hover:scale-105 duration-300",
					"group"
				)}
				target="_blank"
				href="https://twitter.com/zaarheed/status/1446817675733241859"
				rel="noreferrer"
			>
				<p className="text-flesh-500 font-medium text-xs">
                    Latest update
				</p>
				<p className="font-medium text-gray-900">
                    I relaunched Buskana!
				</p>
				<p className="text-gray-700">
                    Buskana is now a digital ordering platform
                    for festivals &amp; events.{" "}
					<span className="block text-azure-500 font-medium group-hover:underline">
                        Learn more
					</span>
				</p>
			</a>
			<p className="text-gray-400 text-sm mt-4">
                Updated 24th September 2021
			</p>
		</div>
	)
}