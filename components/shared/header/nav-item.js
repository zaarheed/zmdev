import classNames from "classnames";
import { useRouter } from "next/dist/client/router";
import NextLink from "next/link";

export default function NavItem({ href, label }) {
	const router = useRouter();
	const isActive = router.asPath === href;

	return (
		<NextLink href={href}>
			<a
				className={classNames(
					"rounded-lg hover:bg-azure-300 dark:hover:bg-mango-500 hover:bg-opacity-30 dark:hover:bg-opacity-10 py-2 px-3",
					isActive ? "text-white font-semibold" : "text-azure-700 dark:text-mango-500"
				)}
			>
				<span className="capsize">{label}</span>
			</a>
		</NextLink>
	);
}