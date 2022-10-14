export default function ActionButton() {
	const handleClick = () => {
		if (!window) return;

		const el = document.getElementById("highlights");
		el.scrollIntoView({ behavior: "smooth" });
	}

	return (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<button
				className={`
                    focus:outline-none bg-azure-500 text-white font-medium
                    px-4 py-3 rounded-full -rotate-3 hover:bg-azure-600
                    cursor-pointer hover:scale-105 duration-200 flex
                    flex-row items-center group
                `}
				onClick={handleClick}
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:scale-125 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
				</svg>
				<span>Learn more</span>
			</button>
		</div>
	)
}