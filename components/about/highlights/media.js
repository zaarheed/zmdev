import DesktopScreenshot from "./desktop-screenshot";
import MobileScreenshot from "./mobile-screenshot";

export default function Media({ media }) {
	const { type } = media;

	if (type === "mobile") {
		return (
			<MobileScreenshot media={media} />
		)
	}

	if (type === "desktop") {
		return (
			<DesktopScreenshot media={media} />
		)
	}

	return;
}