import { useCallback, useEffect, useState } from "react";

export function useHeaderVisible() {
	const [previousScrollPosition, setPreviousScrollPosition] = useState(0);
	const [visible, setVisible] = useState(true);

	const handleScroll = useCallback(() => {
		const currentScrollPosition = window.pageYOffset;

		setVisible(previousScrollPosition > currentScrollPosition || currentScrollPosition < 10);

		setPreviousScrollPosition(currentScrollPosition);
	}, [setVisible, setPreviousScrollPosition, previousScrollPosition]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	return visible;
}