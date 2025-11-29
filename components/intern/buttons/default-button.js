import classNames from "classnames"

export default function DefaultButton({ icon, href, text, type = "external-url" }) {
    const classes = classNames(
        "appearance-none focus:outline-none border border-zinc-600 rounded-xl px-5 py-2 bg-zinc-800 shadow-xs",
        "font-medium flex flex-row justify-center items-center space-x-3 mt-8 text-zinc-200",
        "group hover:text-zinc-100 w-full md:w-auto cursor-pointer",
    );

    return (
        <a
            href={href}
            target="_blank"
            className={classes}
        >
            {icon}
            {text}
        </a>
    )
}
