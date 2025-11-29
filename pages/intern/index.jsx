import Hero from "@/components/intern/hero";
import Footer from "@/components/shared/footer";
import Title from "@/components/intern/title";
import Prose from "@/components/intern/prose";
import ApplyButton from "@/components/intern/buttons/apply-button";
import DefaultButton from "@/components/intern/buttons/default-button";
import { SUBSCRIPTION_LINK, TWITTER_TESTIMONIALS_LINK } from "@/constants/config";
import { Fragment, useState } from "react";
import SubscribeButton from "@/components/intern/buttons/subscribe-button";
import Tweet from "@/components/shared/tweet";
import Head from "next/head";
import Modal from "@/components/shared/modal";
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

export default function Intern({ milestones = [] }) {
    const [showJobModal, setJobModal] = useState(false);

	return (
		<div className="w-full flex flex-col bg-zinc-900">
            <Head>
                <title>Intern with Zahid | Exclusive Mentorship Opportunity</title>

                <meta property="og:title" content="Intern with Zahid | 1-on-1 Development Coaching" />
                <meta property="og:description" content="Exclusive opportunity to work directly with Zahid on incredible projects" />
                <meta property="og:image" content="https://www.zmdev.com/assets/og_card-learn.jpg" />
                <meta property="og:url" content="https://www.zmdev.com/intern" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="og:site_name" content="Intern with Zahid" />
                <meta name="twitter:image:alt" content="1-on-1 development mentorship" />
            </Head>
			<Hero />

            <section className="w-full flex flex-col justify-center text-zinc-700 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        There's only one spot available
                    </Title>
                    <Prose>
                        <p>
                            I'm looking for one exceptional developer to join me in building AI-native digital products.
                            This isn't your typical opportunity. We'll work together on real projects, execute relentlessly,
                            and craft some of the best projects you'll ever work on.
                        </p>

                        <p>
                            I'm looking for one exceptional developer to join me in building AI-native digital products.
                            This isn't your typical opportunity. We'll work together on real projects, execute relentlessly,
                            and craft some of the best projects you'll ever work on.
                        </p>
                    </Prose>

                    <div className="w-full flex flex-row justify-end mt-4">
                        <ApplyButton />
                    </div>
                </div>
            </section>
            
            <section className="w-full flex flex-col justify-center text-zinc-200 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>What you'll be doing</Title>

                    <Prose>
                        <p>
                            You'll work alongside me on real projects that matter. We'll build web applications, mobile apps, 
                            and explore cutting-edge technologies together. This is hands-on experience you can't get anywhere else.
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
                            <p className="text-xs italic text-zinc-300 text-center font-light">Me, a few years before I built my first website lol</p>
                        </div>

                        <p>
                            Since then I've freelanced, built blogs, YouTube channels, landing pages,{" "}
                            <a {...links.halaljoints}>restaurant directories</a>, <a {...links.neo}>VC-backed{" "}
                            startups</a>, payment systems, marketplaces, <a {...links.hmc}>delivery apps</a> and{" "}
                            even <a {...links.moveyourbodyksa}>projects for governments</a>. You'll learn from someone who's 
                            been in the trenches and built real products that people use.
                        </p>

                        <p className="font-semibold mt-4">Ready to build something incredible together?</p>
                    </Prose>
                    <div className="w-full flex flex-row justify-end mt-4">
                        <ApplyButton />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-200 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        What's included?
                    </Title>
                    <Prose>
                        <p>
                            This is a comprehensive mentorship program where you'll get direct access to me and learn 
                            everything I know about building successful products.
                        </p>

                        <p>
                            You'll work on real projects, learn modern development practices, and get the kind of 
                            hands-on experience that will accelerate your career.
                        </p>
                        
                        <p>
                            What you'll learn:
                        </p>

                        <ul>
                            <li>Full-stack web development</li>
                            <li>Product design and user experience</li>
                            <li>Project management and planning</li>
                            <li>Building and scaling applications</li>
                            <li>Working with clients and stakeholders</li>
                        </ul>

                        <p>
                            Plus weekly 1-on-1 coaching sessions to accelerate your growth.
                        </p>
                    </Prose>
                    <div className="w-full flex flex-row justify-end mt-4">
                        <ApplyButton />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-200 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        How does it work?
                    </Title>
                    <Prose>
                        <p>
                            We'll work together for 3-6 months, depending on the projects we take on. You'll have 
                            direct access to me for guidance, code reviews, and strategic discussions.
                        </p>

                        <ol>
                            <li>Apply through the form below</li>
                            <li>We'll have a video call to discuss your goals and experience</li>
                            <li>If we're a good fit, we'll start working together immediately</li>
                            <li>Weekly 1-on-1 sessions and daily project collaboration</li>
                            <li>Build incredible projects and accelerate your career</li>
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
                            text={(<span>See my work</span>)}
                        />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-200 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        Is this opportunity right for me?
                    </Title>
                    <Prose>
                        <p>
                            This is for developers who are serious about leveling up their skills and working on 
                            meaningful projects. You should have some coding experience and be ready to dive deep.
                        </p>

                        <p>
                            <span className="font-semibold">Perfect if you:</span>
                        </p>
                        <ul>
                            <li>Have basic programming knowledge (HTML, CSS, JavaScript)</li>
                            <li>Are passionate about building products</li>
                            <li>Want 1-on-1 mentorship from an experienced developer</li>
                            <li>Are ready to commit 10-15 hours per week</li>
                            <li>Want to work on real projects that matter</li>
                        </ul>
                    </Prose>
                    <div className="w-full flex flex-col md:flex-row md:justify-end mt-4 space-y-4 md:space-y-0 md:space-x-4">
                        <SubscribeButton />
                        <ApplyButton />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-200 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        What technologies will we use?
                    </Title>
                    <Prose>
                        <p>
                            We'll work with modern web technologies including React, Next.js, Node.js, and more. 
                            The exact stack depends on the projects we choose to build together.
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
                                    <span className="hidden md:inline-flex">I'm ready to build amazing things — let's start!</span>
                                    <span className="md:hidden">Let's start building</span>
                                </Fragment>
                            )}
                        />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-200 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        Why should you trust me?
                    </Title>
                    <Prose>
                        <p>
                            I'm a self-taught software engineer who's built real products that people use. I've never
                            studied computer science formally, but I've learned through building and shipping code.
                            I understand the struggles of learning to code because I've been there.
                        </p>

                        <div className="w-full flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-1 not-prose">
                            <div className="w-full md:w-4/6 shrink-0">
                                <Tweet
                                    name="Zahid"
                                    username="zaarheed"
                                    profileImgUrl="/assets/profile.jpg"
                                    tweet="I didn't need to invert a binary tree or do a whiteboard test to build buskana.com so trust me you can tell that hiring manager to f@#% off too"
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
                            careers and <a onClick={() => setJobModal(true)}>land a junior role</a> in tech. I have real experience 
                            helping developers grow and succeed.
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

            <section className="w-full flex flex-col justify-center text-zinc-200 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        What's the commitment?
                    </Title>
                    <Prose>
                        <p>
                            This is a serious opportunity for serious developers. You'll need to commit 10-15 hours per week 
                            for 3-6 months. In return, you'll get unparalleled access to my knowledge and experience.
                        </p>

                        <p>
                            We'll work on real projects, build your portfolio, and accelerate your career growth. 
                            This isn't just learning - it's hands-on experience building products that matter.
                        </p>
                    </Prose>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-200 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        What if I have questions?
                    </Title>
                    <Prose className="w-full prose">
                        <p>
                            I'm here to help. Hit my <a href="https://www.twitter.com/zaarheed" target="_blank">DMs on Twitter</a> or{" "}
                            <a href="mailto:zahid@zmdev.com" target="_blank">email me</a> directly. I'll get back to you within 24 hours.
                        </p>
                    </Prose>
                    
                    <div className="w-full flex flex-col md:flex-row justify-end mt-4 space-y-4 md:space-y-0 md:space-x-4">
                        <SubscribeButton />
                        <ApplyButton />
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col justify-center text-zinc-200 my-20">
                <div className="w-full max-w-prose mx-auto flex flex-col px-4">
                    <Title>
                        I'm ready to apply
                    </Title>
                    <Prose>
                        <p>
                            Perfect! Fill out the application form and let's start building something incredible together. 
                            I'm excited to work with you.
                        </p>
                    </Prose>
                    <div className="w-full flex flex-row justify-end mt-4">
                        <ApplyButton />
                    </div>
                </div>
            </section>

			<Footer />
		</div>
	)
}

export async function getStaticProps({ params }) {
	return {
		props: {},
		revalidate: 1
	}
}
