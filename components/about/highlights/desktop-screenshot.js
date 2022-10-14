export default function DesktopScreenshot({ media }) {
	const { mediaSrc, fileType } = media;

	if (fileType === "image") {
		return (
			<div
				className={`
                    relative border border-gray-300 rounded-2xl overflow-hidden
                    bg-azure-100 h-[300px] lg:w-[980px] lg:h-[750px]
                `}
			>
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
                    bg-azure-100 h-[300px] lg:w-[980px] lg:h-[750px]
                `}    
			>
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