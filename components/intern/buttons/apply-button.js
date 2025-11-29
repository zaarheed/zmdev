export default function ApplyButton() {
    return (
        <a
            href="mailto:zahid@zmdev.com?subject=Internship Application&body=Hi Zahid,%0D%0A%0D%0AI'm interested in the internship opportunity. Here's a bit about me:%0D%0A%0D%0A- Current experience level:%0D%0A- What I hope to learn:%0D%0A- Why I'm interested in working with you:%0D%0A- My availability (hours per week):%0D%0A%0D%0ALooking forward to hearing from you!"
            className={`
                appearance-none focus:outline-none border border-zinc-600 rounded-xl px-5 py-2 bg-zinc-800 shadow-xs
                font-medium flex flex-row justify-center items-center space-x-3 mt-8 text-zinc-200
                group hover:text-zinc-100 w-full md:w-auto self-end
            `}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:scale-105 duration-200 text-mango-500 group-hover:text-mango-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" className="hidden group-hover:block" />
            </svg>
            <span>Apply Now</span>
        </a>
    )
}
