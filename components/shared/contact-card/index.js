import Envelopes from "./envelopes";

export default function ContactCard() {
	return (
		<div className="w-full pt-9">
			<div className="relative bg-white border border-gray-300 rounded-2xl flex flex-col justify-between pt-14 cursor-pointer self-start w-full">
				<div className="absolute overflow-hidden h-20 w-20 -top-8 left-5 rounded-full">
					<img
						src="/assets/profile.jpg"
						className="object-cover h-full w-full transform scale-150"
						alt=""
					/>
				</div>
				<div className="px-5 flex flex-col pb-4">
					<p className="text-xl font-semibold">
                        Zahid Mahmood
					</p>
					<p className="text-gray-700 mb-2">
                        Full-stack Web engineer
					</p>
					<a
						className="text-gray-500 flex flex-row space-x-2 items-center hover:text-azure-500"
						href="https://www.twitter.com/zaarheed"
						target="_blank"
						rel="noreferrer"
					>
						<img src="/assets/twitter-official.svg" className="h-5" alt="" />
						<span>@zaarheed</span>
					</a>
				</div>
				<a 
					href="mailto:zahid@zmdev.com"
					className="group border-t border-gray-300 px-5 py-3 flex flex-row items-center text-gray-700"
				>
					<Envelopes />
					<span className="group-hover:text-gray-900">Email me</span>
				</a>
			</div>
		</div>
	);
}