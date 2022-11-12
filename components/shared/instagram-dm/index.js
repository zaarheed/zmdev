import className from "classnames";

export default function InstagramDM({ messages = [] }) {

    if (messages.length < 1) {
        return <div>could not load messages</div>
    }

    return (
        <div className="w-full dark:text-zinc-200 h-full">
            <div className="w-full mx-auto p-2 flex flex-col space-y-4">
                {messages.map(messageGroup => (
                    <div className="w-full" key={messageGroup.date}>
                        <p className="text-xs text-center mb-1">
                            {messageGroup.date}
                        </p>

                        <div
                            className={className(
                                "w-full flex flex-col space-y-1",
                                messageGroup.author === "zahid" ? "items-end" : "items-start"
                            )}
                        >
                            {messageGroup.messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={className(
                                        "rounded-xl text-sm px-4 py-2 border dark:border-zinc-700",
                                        messageGroup.author === "zahid" ? "bg-gradient-to-br from-azure-400 dark:from-zinc-900 dark:to-zinc-900 to-azure-500 text-white dark:text-zinc-200" : "bg-white-300 dark:bg-zinc-200 dark:text-zinc-700 text-zinc-700"
                                    )}
                                    style={{ maxWidth: "76%" }}
                                >
                                    {message}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}