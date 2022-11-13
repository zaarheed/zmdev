import Tweet from "@/components/shared/tweet";
import tweets from "./tweets";

export default function TweetGrid() {
    return (
        <div className="w-full grid grid-cols-1 gap-4 mt-4">
            {tweets.map((tweet, index) => (
                <Tweet
                    key={index}
                    name={tweet.name}
                    username={tweet.username}
                    tweet={tweet.tweet}
                />
            ))}
        </div>
    )
}