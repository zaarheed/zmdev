export default function Item({ technology }) {
	const { name, iconUrl } = technology;

	return (
		<div
			className={`
                flex flex-col justify-center items-center px-1 transform
                duration-200 hover:-translate-y-2
            `}
		>
			<img src={iconUrl} className="w-5" title={name} alt={name} />
		</div>
	);
}