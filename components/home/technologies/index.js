import Item from "./item"
import TECHNOLOGIES from "@/constants/technologies";

export default function Technologies({ technologies = TECHNOLOGIES }) {
	return (
		<div className="w-full flex flex-row space-x-2">
			{technologies.map((technology, index) => <Item key={index} technology={technology} />)}
		</div>
	)
}