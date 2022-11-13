import { SUBSCRIPTION_LINK } from "@/constants/config";
import { Fragment } from "react";
import CourseItem from "./course-item";

export default function CourseGrid() {
    return(
        <div className="w-full max-w-prose mx-auto grid grid-cols-1 gap-4 px-4">
            <CourseItem
                title="Course 1: Learn to code on your phone in two weeks"
                subtitle="Launching 1st January"
                href={SUBSCRIPTION_LINK}
            />
            <CourseItem
                title="Course 2: Styling with CSS"
                subtitle="Coming soon"
                details={(
                    <Fragment>
                        <p>
                            In order to build phenomenal websites that are beautiful to look at
                            and slick to navigate you'll need to pick up some styling basics. In
                            this course we'll breeze through the basics of CSS styling so you can
                            do just enough to add some flair to your projects.
                        </p>
                    </Fragment>
                )}
            />
            <CourseItem
                title="Course 3: Everything you need to know about React to get started"
                subtitle="Coming soon"
                details={(
                    <Fragment>
                        <p>
                            Once you understand the basics of how to code, you should learn about
                            tools that can do a lot of the heavy lifting for you. You'll learn
                            the basics of React. Only what you need to start building -- you can
                            learn the rest as you go!
                        </p>
                    </Fragment>
                )}
            />
            <CourseItem
                title="Course 4: Building and publishing your first website"
                subtitle="Coming soon"
                details={(
                    <Fragment>
                        <p>
                            Once you know how to code, how to use React and how to style webpages - it's
                            time to bring your idea to life. In this build-along course you'll join
                            me in building a mobile-response landing page for any person, book, business, startup,
                            course or idea.
                        </p>
                    </Fragment>
                )}
            />
        </div>
    );
}