export default function InvolvementStack() {
	return (
		<div className="w-full flex flex-col space-y-3 justify-center items-center tracking-wide text-lg text-gray-700">
			<div className="w-full flex flex-row space-x-1 items-center">
				<img alt="" src="/assets/linkedin-icon.svg" className="h-5 flex-shrink-0" />
				<span>LinkedIn</span>
			</div>
			<div className="w-full flex flex-row space-x-1 items-center">
				<img alt="" src="/assets/calendar-icon.svg" className="h-5 flex-shrink-0" />
				<span>Events @ Muslamic Makers</span>
			</div>
			<div className="w-full flex flex-row space-x-1 items-center">
				<img alt="" src="/assets/buskana-icon.png" className="h-5 flex-shrink-0" />
				<span>Digital Ordering @ Buskana</span>
			</div>
			<div className="w-full flex flex-row space-x-1 items-center">
				<img alt="" src="/assets/halaljoints-icon.svg" className="h-5 flex-shrink-0" />
				<span>Restaurants @ Halal Joints</span>
			</div>
		</div>
	)
}