export default function TweetStack() {
	return (
		<div
			className={`
                relative flex flex-row items-center justify-start
                rounded-lg border border-gray-300 bg-white p-3
                transform rotate-2 hover:scale-105 duration-200
                text-gray-500
            `}
		>
            Woah woah woah!
			<img
				src="/assets/twitter-official.svg"
				className="w-5 absolute bottom-3 right-3"
			/>
		</div>
	)
}