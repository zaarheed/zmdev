import { SUBSCRIPTION_LINK } from "@/constants/config"
import classNames from "classnames"

export default function OfferCard() {
	return (
		<a
            className={classNames(
                "bg-white dark:bg-zinc-900 rounded-lg py-4 px-3 flex flex-col w-full lg:w-96",
                "-rotate-2 shadow hover:scale-105 duration-300",
                "group cursor-pointer"
            )}
            target="_blank"
            href={SUBSCRIPTION_LINK}
            rel="noreferrer"
        >
            <p className="text-flesh-500 dark:text-zinc-500 font-medium text-xs uppercase">
                Launch offer
            </p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100 text-base">
                Get 50% off before Christmas
            </p>
            <p className="text-zinc-500 dark:text-zinc-300 text-sm">
                Pay £3.99 today to secure your spot. Discount automatically applied at checkout. 
                <span className="block text-azure-500 dark:text-mango-500 font-medium group-hover:underline">
                    Sign up now
                </span>
            </p>
        </a>
	)
}