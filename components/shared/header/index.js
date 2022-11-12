import classNames from "classnames";
import NavItem from "./nav-item";
import { useHeaderVisible } from "./use-header-visible";
import { useScrollPosition } from "./use-scroll-position";

const SHOW_NAVBAR = false;

export default function Header() {
	const visible = useHeaderVisible();
	const scrollPosition = useScrollPosition();

	if (SHOW_NAVBAR === false) {
		return null;
	}

	return (
		<nav
			className={classNames(
				"w-full fixed z-20 bg-azure-400 dark:bg-zinc-900 transition-top duration-300 pb-3 pt-2",
				visible ? "top-0" : "-top-32",
				scrollPosition > 20 ? null : "bg-opacity-0"
			)}
		>
			<div className="w-full max-w-4xl mx-auto flex flex-row items-center justify-between">
				<div className="flex flex-row space-x-3">
					<NavItem label="Home" href="/" />
					<NavItem label="About" href="/about" />
					<NavItem label="Projects" href="/projects" />
					<NavItem label="Network" href="/network" />
				</div>

				<button
					className={`
                        appearance-none bg-mango-500 rounded-lg px-3 py-2
                        hover:bg-mango-600 focus:outline-none text-gray-900
                    `}
				>
                    Contact me!
				</button>
			</div>
		</nav>
	)
}