// A short closing band: the page's gradient running out into the four-colour
// stripe. No links.
export default function Footer() {
	return (
		<footer className="relative w-full h-24 bg-gradient-to-t from-azure-100 to-white dark:from-zinc-900 dark:to-zinc-900">
			<div className="w-full absolute left-0 bottom-0 grid grid-cols-4">
				<div className="h-2 w-full bg-azure-500" />
				<div className="h-2 w-full bg-flesh-500" />
				<div className="h-2 w-full bg-mango-500" />
				<div className="h-2 w-full bg-hulk-500" />
			</div>
		</footer>
	)
}
