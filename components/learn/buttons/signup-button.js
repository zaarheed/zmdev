import { SUBSCRIPTION_LINK } from "@/constants/config";

export default function SignupButton() {
    return (
        <a
            href={SUBSCRIPTION_LINK}
            target="_blank"
            className={`
                appearance-none focus:outline-none border dark:border-zinc-700 rounded-xl px-5 py-2 bg-white dark:bg-zinc-800 shadow-xs
                font-medium flex flex-row justify-center items-center space-x-3 mt-8 text-zinc-700 dark:text-zinc-200
                group hover:text-zinc-900 dark:hover:text-zinc-100 w-full md:w-auto self-end
            `}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:scale-105 duration-200 text-azure-500 dark:text-mango-500 group-hover:text-azure-400 dark:group-hover:text-mango-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" className="hidden group-hover:block" />
            </svg>
            <span>Sign me up for £7.99 <span className="text-sm text-zinc-500 dark:zinc-text-300">/week</span></span>
        </a>
    )
}