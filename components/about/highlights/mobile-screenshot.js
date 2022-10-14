export default function MobileScreenshot({ media }) {
	const { mediaSrc, fileType } = media;

	if (fileType === "image") {
		return (
			<div
				className={`
                    relative border border-gray-300 rounded-2xl overflow-hidden
                    bg-azure-100 h-[300px] lg:w-[350px] lg:h-[750px]
                `}
			>
				<div className="absolute w-full top-0">
					<div className="bg-black w-5/12 rounded-b-2xl h-6 mx-auto" />
				</div>
				<img
					className="object-cover h-full w-full"
					src={mediaSrc}
					alt=""
				/>
			</div>
		);
	}

	if (fileType === "video") {
		return (
			<div
				className={`
                    relative border border-gray-300 rounded-2xl overflow-hidden
                    bg-azure-100 h-[300px] lg:w-[350px] lg:h-[750px]
                `}
			>
				<div className="absolute w-full top-0">
					<div className="bg-black w-5/12 rounded-b-2xl h-3 lg:h-6 mx-auto" />
				</div>
				<video
					controls={false}
					autoPlay={true}
					muted={true}
					loop={true}
					playsInline={true}
					disablePictureInPicture={true}
					className="object-cover h-full w-full"
				>
					<source src={mediaSrc} type="video/mp4" />
				</video>
			</div>
		);
	}
    
	return null;
}