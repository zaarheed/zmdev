import InstagramDM from "@/components/shared/instagram-dm";

export default function LandAJobModal() {
    return (
        <div
            className={`
                w-full h-full flex flex-col justify-center items-center border-2
                rounded-lg overflow-hidden dark:border-zinc-700 bg-white
                dark:bg-zinc-800 text-zinc-700 dark:zinc-text-200 p-4 space-y-4
                overflow-y-scroll
            `}
        >
            <InstagramDM
                messages={[
                    {
                        date: "23 December 2020, 16:25",
                        messages: [
                            "Hello Zahid",
                            "I got a permanent job",
                            "With buzzfeed",
                            "😊"
                        ]
                    },
                    {
                        messages: [
                            "amazing!!!!!! congratulations!",
                            "what's the role and when do you start?"
                        ],
                        author: "zahid"
                    },
                    {
                        messages: [
                            "Software engineer",
                            "Feb 1st"
                        ],
                        author: "mentee"
                    },
                    {
                        messages: [
                            "🥳🥳",
                        ],
                        author: "zahid"
                    },
                    {
                        messages: [
                            "During the interview, they asked me to do an online challenge on react",
                            "A react app to fetch news posts from backend and display on frontend and pagination",
                            "It was easy for me . I did the error handling which they didn't expect 😁",
                            "Just like you showed me",
                            
                        ],
                        author: "mentee"
                    },
                    {
                        messages: [
                            "Haha incredible. So proud of you!",
                        ],
                        author: "zahid"
                    },
                    {
                        messages: [
                            "Thanks again for your guidance and help"
                            
                        ],
                        author: "mentee"
                    },
                ]}
            />
        </div>
    )
}