export default function EnvelopeStack() {
	return (
		<div className="relative h-full -mt-4 w-full group flex flex-col justify-center items-center cursor-pointer">
			<img
				src="/assets/envelope_official.svg"
				className={`
                    absolute transform -rotate-2 -translate-x-3
                    group-hover:-rotate-3 group-hover:-translate-y-3
                    duration-200
                `}
				alt=""
			/>
			<img
				src="/assets/envelope_plain.svg"
				className={`
                    absolute transform rotate-3 translate-x-10 translate-y-6
                    group-hover:rotate-1 group-hover:translate-x-14
                    duration-300
                `}
				alt=""
			/>
			<img
				src="/assets/envelope_airmail.svg"
				className={`
                    absolute transform -rotate-2 translate-x-2 translate-y-14
                    group-hover:-rotate-3 group-hover:translate-x-0 group-hover:translate-y-18
                    duration-300
                `}
				alt=""
			/>
		</div>
	)
}