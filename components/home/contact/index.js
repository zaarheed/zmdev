import ContactCard from "@/components/shared/contact-card";

export default function Contact() {
	return (
		<section className="w-full flex flex-col py-20">
			<div className="w-full max-w-4xl mx-auto items-center px-4">
				<div className="w-[350px]">
					<ContactCard />
				</div>
			</div>
		</section>
	)
}