import Hero from "@/components/learn/hero";
import Footer from "@/components/shared/footer";
import { milestoneFilePaths, MILESTONES_PATH } from "utils/mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import Title from "@/components/learn/title";
import Prose from "@/components/learn/prose";
import SignupButton from "@/components/learn/buttons/signup-button";
import DefaultButton from "@/components/learn/buttons/default-button";
import { SUBSCRIPTION_LINK, TWITTER_TESTIMONIALS_LINK } from "@/constants/config";
import { Fragment, useState } from "react";
import SubscribeButton from "@/components/learn/buttons/subscribe-button";
import CourseGrid from "@/components/learn/course-grid";
import Tweet from "@/components/shared/tweet";
import Head from "next/head";
import Modal from "@/components/shared/modal";
import InstagramDM from "@/components/shared/instagram-dm";
import LandAJobModal from "@/components/learn/land-a-job-modal";

const links = {
    neo: {
        href: "https://neo.substack.com/p/neo-deploys-125-million-into-20-new",
        target: "_blank",
    },
    halaljoints: {
        href: "https://www.halaljoints.com",
        target: "_blank",
    },
    hmc: {
        href: "https://apps.apple.com/gb/app/hmc-now/id1566548465",
        target: "_blank",
    },
    moveyourbodyksa: {
        href: "https://saudigazette.com.sa/article/594475/SAUDI-ARABIA/Women-participation-in-sports-rose-by-149-from-2015-Prince-Abdulaziz",
        target: "_blank",
    },
    womentechmakers: {
        href: "https://developers.google.com/womentechmakers",
        target: "_blank",
    }
}

export default function Learn({ milestones = [] }) {
    const [showJobModal, setJobModal] = useState(false);

	return (
		<div className="w-full flex flex-col bg-white dark:bg-zinc-900">
            <Head>
                <title>Learn with Zahid | Full-stack Web Engineer</title>
                <meta property="og:image" content="https://www.zmdev.com/assets/og_card-learn.jpg" />
            </Head>
			<Hero />

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        Master a topic in 2 weeks
                    </Title>
                    <Prose>
                        <p>
                            Select a course below and complete it in 2 weeks. It's that simple! A subscription gives you access
                            to all launched courses and new ones as they're released.
                        </p>
                    </Prose>
                </div>
                <CourseGrid />
            </section>
            
            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>What's this about?</Title>

                    <Prose>
                        <p>
                            I built my first “website” when I was 11 and earnt my first internet dollar a week later.
                            During my GCSEs I hit 500K /mo visitors and subsequently spent my A-Levels trying to flog what I built.
                        </p>

                        <div className="w-full flex flex-col space-y-1">
                            <div className="w-full flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 not-prose">
                                <div className="w-full md:w-4/6 shrink-0">
                                    <figure className="w-full md:h-full overflow-hidden rounded">
                                        <img src="/assets/4-years.jpg" className="object-cover h-full w-full hover:scale-105 duration-200 ease-in-out" />
                                    </figure>
                                </div>
                                <div className="2/6">
                                    <figure className="w-full md:h-full overflow-hidden rounded">
                                        <img src="/assets/7-years.jpg" className="object-cover h-full w-full hover:scale-105 duration-200 ease-in-out" />
                                    </figure>
                                </div>
                            </div>
                            <p className="text-xs italic text-zinc-500 dark:text-zinc-300 text-center font-light">Me, a few years before I built my first website lol</p>
                        </div>

                        <p>
                            Since then I've freelanced, built blogs, YouTube channels, landing pages,{" "}
                            <a {...links.halaljoints}>restaurant directories</a>, <a {...links.neo}>VC-backed{" "}
                            startups</a>, payment systems, marketplaces, <a {...links.hmc}>delivery apps</a> and{" "}
                            even <a {...links.moveyourbodyksa}>projects for governments</a>. I learn't everything
                            on my own, in my own time. I will help you do the same. All you need is WiFi, discipline{" "}
                            and a sprinkle of code.
                        </p>

                        <p className="font-semibold mt-4">The internet is wild. It will change your life. Let me show you how.</p>
                    </Prose>
                    <div className="w-full flex flex-row justify-end mt-4">
                        <SignupButton />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        What's included?
                    </Title>
                    <Prose>
                        <p>
                            Through a series of courses I'll show you how to code from scratch. Together, we'll go from learning
                            the basics like what variables are to building powerful web applications in the simplest way possible.
                        </p>

                        <p>
                            Each course is designed to be completed in two week bursts so there's plenty of flexibility.
                            By the end of it all, you'll confidently design and build full-stack applications for your employer, side-hustle,
                            startup... or like me... for fun!
                        </p>
                        
                        <p>
                            In the first course you'll learn:
                        </p>

                        <ul>
                            <li>Variables</li>
                            <li>Functions</li>
                            <li>If-statements</li>
                            <li>Loops</li>
                            <li>Debugging</li>
                        </ul>

                        <p>
                            More courses to be published soon.
                        </p>
                    </Prose>
                    <div className="w-full flex flex-row justify-end mt-4">
                        <SignupButton />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        Will there be homework?
                    </Title>
                    <Prose>
                        <p>
                            Yes. There will be (optional) assignments to complete in your own time. And if you choose
                            to submit your assignment I'll provide helpful feedback on how you can improve.
                        </p>
                    </Prose>
                    <div className="w-full flex flex-row justify-end mt-4">
                        <DefaultButton
                            href={SUBSCRIPTION_LINK}
                            icon={(
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-hulk-500 duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 17v2a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3h3" />
                                    <path d="M22 17v2a2 2 0 0 1-2 2H8" />
                                    <path d="M19 17V5a2 2 0 0 0-2-2H4" />
                                    <path d="M22 17H10" />
                                </svg>
                            )}
                            text={(
                                <Fragment>
                                    <span className="hidden md:inline-flex">I'm ready to be a teacher's pet — give me homework!</span>
                                    <span className="md:hidden">I'm ready for homework</span>
                                </Fragment>
                            )}
                        />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        How does it work?
                    </Title>
                    <Prose>
                        <p>
                            There will be a series of courses, each designed to be completed in 2 weeks. You'll
                            do 20 minutes of learning, 5 days a week. You'll be able to learn everything
                            on-the-move from an iPhone.
                        </p>

                        <ol>
                            <li>Download the <a href="https://apps.apple.com/us/app/replit-code-anything/id1614022293" target="_blank">Repl.it app</a> (free) or <a href="https://replit.com/teams/join/tstjuvwwkuppktlnrmosfyoaoekplvgc-computerpalm" target="_blank">sign up online</a> (also free)</li>
                            <li><a href={SUBSCRIPTION_LINK} target="_link">Sign up for the course</a> and receive email instructions</li>
                            <li>Open the lesson from your iPhone, iPad or laptop</li>
                            <li>Complete 20 minutes of guided learning five days a week for two weeks</li>
                            <li>Congratulations! You're on your way to being a pro. Sign up for the next course where you'll use your new skills to build something new (optional)</li>
                        </ol>
                    </Prose>
                    <div className="w-full flex flex-row justify-end mt-4 space-x-4">
                        <DefaultButton
                            icon={(
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-105 duration-200 text-flesh-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m22 8-6 4 6 4V8Z" />
                                    <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
                                </svg>
                            )}
                            text={(<span>See an example</span>)}
                        />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        Is this course right for me?
                    </Title>
                    <Prose>
                        <p>
                            The first course is focused on absolute beginners <span className="font-semibold">by design</span>.
                        </p>

                        <p>
                            If you already know what a <code>variable</code> is and you know how to confidently write a <code>for-lopp</code>, then
                            this course is not for you. Subscribe to updates below and I'll let you know when I release something more advanced.
                        </p>
                    </Prose>
                    <div className="w-full flex flex-col md:flex-row md:justify-end mt-4 space-y-4 md:space-y-0 md:space-x-4">
                        <SubscribeButton />
                        <SignupButton />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        What programming language will we use?
                    </Title>
                    <Prose>
                        <p>
                            JavaScript.
                        </p>
                    </Prose>
                    <div className="w-full flex flex-row justify-end mt-4">
                        <DefaultButton
                            href={SUBSCRIPTION_LINK}
                            icon={(
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-flesh-500 duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                                </svg>
                            )}
                            text={(
                                <Fragment>
                                    <span className="hidden md:inline-flex">I love JavaScript too — let's get started</span>
                                    <span className="md:hidden">Let's get started</span>
                                </Fragment>
                            )}
                        />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        Why are you charging £7.99?
                    </Title>
                    <Prose>
                        <p className="font-bold">
                            Because Elon Musk is charging £6.99 for Twitter Blue and I'm better than Elon.
                        </p>

                        <p>
                            Seriously though, I think it's the sweet spot between making sure almost everyone can afford it
                            and being enough to make sure you are committed once you pay to sign up. I'm also charging weekly
                            not monthly to help you better manage your subscription costs and allow for flexibility. Leave and rejoin
                            as often as you like!
                        </p>

                        <p>
                            If the subscription cost is a barrier for you, please reach out and I'll do everything I can to make
                            something work :).
                        </p>
                    </Prose>
                    <div className="w-full flex flex-row justify-end mt-4 space-x-4">
                        <SignupButton />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        Why should I trust you?
                    </Title>
                    <Prose>
                        <p>
                            I'm a self-taught software engineer. I learnt by experimenting when I was 11. I've never
                            studied computer science and I have no idea what a "Data Structures & Algorithms" module is.
                            So even if I wanted to, I litterally can't confuse you with complicated jargon.{" "}
                            <span className="italic">We keepin' it easy out 'ere!</span>
                        </p>

                        <div className="w-full flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-1 not-prose">
                            <div className="w-full md:w-4/6 shrink-0">
                                <Tweet
                                    name="Zahid"
                                    username="zaarheed"
                                    profileImgUrl="/assets/profile.jpg"
                                    tweet="I didn’t need to invert a binary tree or do a whiteboard test to build buskana.com so trust me you can tell that hiring manager to f@#% off too"
                                    link="https://twitter.com/zaarheed/status/1442569860802777097"
                                    replies={4}
                                    retweets={5}
                                    likes={18}
                                />
                            </div>
                            <div className="2/6">
                                <figure className="w-full md:h-full overflow-hidden rounded">
                                    <img src="/assets/mentoring.jpg" className="object-cover h-full w-full hover:scale-105 duration-200 ease-in-out" />
                                </figure>
                            </div>
                        </div>

                        <p>
                            I've helped design, lead and mentor <a {...links.womentechmakers}>Google's Women Techmakers London</a> programme in 2019. I mentored
                            over 230 women to learn JavaScript during a nine week bootcamp, encouraged them to upgrade their
                            careers and <a onClick={() => setJobModal(true)}>land a junior role</a> in tech. Sadly, the COVID-19 lockdown brought my involvememt to and end
                            but I'd like to continue helping under-represented groups take their seat at the table in tech.
                        </p>
                    </Prose>
                    <Modal show={showJobModal} onClose={() => setJobModal(false)} size="sm" showCloseButton={true}>
                        <LandAJobModal />
                    </Modal>
                    <div className="w-full flex flex-row justify-end mt-4 space-x-4">
                        <DefaultButton
                            href={TWITTER_TESTIMONIALS_LINK}
                            icon={(
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:scale-105 text-azure-500 duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                </svg>
                            )}
                            text={(<span>See what others say about me</span>)}
                        />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        What's the secret? Is this a scam?
                    </Title>
                    <Prose>
                        <p>
                            Some inspiration from your hobbies, a sprinkle of code and someone to teach you the important bits
                            of SEO is all you need for a killer project. You're welcome to figure it out on your own — or I can guide
                            you through a tried and tested approach taught in a series of short follow-along courses you can complete from a smartphone.
                        </p>
                    </Prose>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        What if I need additional support?
                    </Title>
                    <Prose className="w-full prose">
                        <p>
                            I'm working on that. Something like weekly office hours for those who
                            could really benefit from it. Subscribe to emails and you'll be the first to know
                            about it.
                        </p>

                        <p>
                            In the meantime my <a href="https://www.twitter.com/zaarheed" target="_blank">DMs</a> and{" "}
                            <a href="mailto:zahid@zmdev.com" target="_blank">email</a> are always open.
                        </p>
                    </Prose>
                    
                    <div className="w-full flex flex-col md:flex-row justify-end mt-4 space-y-4 md:space-y-0 md:space-x-4">
                        <SubscribeButton />
                        <SignupButton />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        I'm a slow learner and-...
                    </Title>
                    <Prose>
                        <p>
                            Relax, I'm the most patient person you'll ever meet. I got you.
                        </p>
                        
                        <p>
                            Throughout my teens I spent my weekends with young, disabled adults teaching
                            them basic life skills for independence. Every weekend, they'd come back having
                            forgotten absolutely everything I taught them the week before. We're talking
                            about simple stuff like counting pennies and spelling names.
                        </p>

                        <p>
                            It was very frustrating at times. I felt hopeless most weeks. But I grew patient and came to
                            learn everyone has different needs. I use this experience when teaching too. My content is
                            intentionally short and easy to digest.
                        </p>

                        <p>
                            No matter who you are, I've taught slower people. Trust me, I got you.
                        </p>
                    </Prose>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        I have more questions...
                    </Title>
                    <Prose>
                        <p>
                            Hit my <a href="https://www.twitter.com/zaarheed" target="_blank">DMs on Twitter</a> or{" "}
                            <a href="mailto:zahid@zmdev.com" target="_blank">email me</a>.
                        </p>
                    </Prose>
                </div>
            </section>

			<Footer />
		</div>
	)
}

export async function getStaticProps({ params }) {
	const projectFilePaths = milestoneFilePaths.map(p => path.join(MILESTONES_PATH, `${p}`));

	const milestones = [];
	for (let i = 0; i < projectFilePaths.length; i++) {
		const path = projectFilePaths[i];

		const source = fs.readFileSync(path);
		const x = matter(source);
		const { content, data } = matter(source);

		if (data.isMilestone === true) continue;

		const mdxSource = await serialize(content, {
			mdxOptions: {
				remarkPlugins: [],
				rehypePlugins: [],
			},
			scope: data,
		});

		milestones.push({
			source: content === "" ? null : mdxSource,
			frontMatter: data
		});
	}



	return {
		props: { milestones },
		revalidate: 1
	}
}