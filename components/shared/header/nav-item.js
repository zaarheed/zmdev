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
					"rounded-lg hover:bg-azure-300 hover:bg-opacity-30 py-2 px-3",
					isActive ? "text-white font-semibold" : "text-azure-700"
				)}
			>
				<span className="capsize">{label}</span>
			</a>
		</NextLink>
	);
}