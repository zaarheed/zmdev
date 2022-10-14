export default function Envelopes() {
	return (
		<div className="relative w-20 group flex flex-col justify-center items-center cursor-pointer -mt-2 -ml-3">
			<img
				src="/assets/envelope_official.svg"
				className={`
                    absolute transform -rotate-2 -translate-x-1
                    group-hover:-rotate-3 group-hover:-translate-y-1
                    duration-200 h-8 w-8
                `}
				alt=""
			/>
			<img
				src="/assets/envelope_plain.svg"
				className={`
                    absolute transform rotate-3 translate-x-2 translate-y-2
                    group-hover:rotate-1 group-hover:translate-x-3
                    duration-300 h-8 w-8
                `}
				alt=""
			/>
			<img
				src="/assets/envelope_airmail.svg"
				className={`
                    absolute transform -rotate-2 -translate-x-3 translate-y-3
                    group-hover:-rotate-3 group-hover:-translate-x-4 group-hover:translate-y-18
                    duration-300 h-8 w-8
                `}
				alt=""
			/>
		</div>
	)
}