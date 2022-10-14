import { useCallback, useEffect, useState } from "react";

export function useScrollPosition() {
	const [scrollPosition, setScrollPosition] = useState(0);

	const handleScroll = useCallback(() => {
		const position = window.pageYOffset;

		setScrollPosition(position);
	}, [setScrollPosition, scrollPosition]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	return scrollPosition;
}