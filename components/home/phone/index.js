export default function Phone() {
	return (
		<figure
			className="flex flex-row items-center justify-center relative w-full transform rotate-3 h-[28rem]"
		>
			<div id="phone-bottom" className="">
				<video
					controls={false}
					autoPlay={true}
					muted={true}
					loop={true}
					playsInline={true}
					disablePictureInPicture={true}
					className="w-full h-full bg-zinc-700 dark:bg-zinc-200"
				>
					<source src="/assets/zahid.mp4" type="video/mp4" />
				</video>
			</div>
            
			<div className="absolute w-full h-full top-0 left-0 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: "url('/assets/phone_top.svg')" }} />
		</figure>
	)
}