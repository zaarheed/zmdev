export default function SeeMore() {
	return (
		<div className="w-full flex flex-col">
			<div className="w-full max-w-4xl px-4 mx-auto">
				<a
					href="mailto:zahid@zmdev.com"
					target="_blank"
					rel="noreferrer"
					className={`
                        w-full block text-lg lg:text-4xl font-bold items-center
                        px-4 hover:bg-azure-100 py-5 lg:py-2 text-center rounded-2xl
                        hover:border-dashed hover:border-azure-300 overflow-hidden hover:text-azure-600
                        hover:scale-105 duration-200 cursor-pointer opacity-50 hover:opacity-100
						border border-gray-300 bg-white text-gray-400
                    `}
				>
                    🧐 🤔 Looking for more? Get in touch! 
				</a>
			</div>
		</div>
	);
}