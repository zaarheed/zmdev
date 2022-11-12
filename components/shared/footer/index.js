import Link from "next/link";
import links from "./links";

export default function Footer() {
	return (
		<footer className="relative w-full bg-gradient-to-t from-azure-100 dark:from-zinc-900 dark:to-zinc-900 pt-20 pb-10 text-sm">
			<div className="w-full max-w-4xl mx-auto grid grid-cols-3 lg:grid-cols-3 text-azure-60 dark:text-mango-600 px-4 gap-y-8">
				{links.map((column, index) => (
					<div key={index} className="w-full">
						<ul className="space-y-2">
							{column.map((link, index) => (
								<li key={index} className="hover:underline">
									<Link href={link.href}>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
			<div className="w-full absolute left-0 bottom-0 grid grid-cols-4">
				<div className="h-2 w-full bg-azure-500" />
				<div className="h-2 w-full bg-flesh-500" />
				<div className="h-2 w-full bg-mango-500" />
				<div className="h-2 w-full bg-hulk-500" />
			</div>
		</footer>
	)
}