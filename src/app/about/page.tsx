import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function About() {
  return (
    <>
      <Navbar />
      <section className="relative min-h-screen bg-white py-[40px]   overflow-hidden">
        {/* Main content */}

        <div className="relative ">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0">
            <Image
              src="/assets/about-overlay.png"
              alt=""
              width={195}
              height={200}
              className="w-[195px] h-[200px] sm:w-32 sm:h-32"
            />
          </div>

          <div className="absolute -bottom-8 right-0 ">
            <Image
              src="/assets/about-overlay.png"
              alt=""
              width={195}
              height={200}
              className="w-[195px] h-[200px] sm:w-40 sm:h-40"
            />
          </div>
          <div className=" max-w-7xl mx-auto text-center py-[96px] px-4 sm:px-6 lg:px-8">
            {/* About us label */}
            <div className="mb-[12px]">
              <span className="inline-block text-[#31B67D] text-sm 2xl:text-base font-semibold">
                About us
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-2xl  2xl:text-[48px] lg:text-[44px] font-semibold text-[#101828] mb-6 leading-tight">
              About Evolution Impact Initiative CIC
            </h1>

            {/* Description paragraphs */}
            <div className="space-y-6 text-[#475467] text-base xl:text-lg font-[400] text-center">
              <p>
                Evolution Impact Initiative CIC is a community-driven
                organisation based in Medway, Kent. Our mission is to support
                young people, families, and vulnerable groups through programs
                that build skills, improve wellbeing, and strengthen community
                bonds. We believe every individual deserves the chance to
                thrive, regardless of their background or circumstances.
              </p>

              <p>
                By combining sport, education, creativity, and social support,
                we&apos;re shaping a stronger, more connected community where
                opportunities are accessible to all. Our work is rooted in
                collaboration with local schools, community leaders, families,
                and organisations to create long-lasting impact.
              </p>
            </div>
          </div>
        </div>

        {/* Mission and Vision Section */}
        <div className="max-w-7xl mx-auto mt-20 space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Our Mission */}
          <div className="rounded-[10px] p-[30px] bg-[#31B67D1A]">
            <h2 className="text-xl 2xl:text-2xl font-semibold text-[#31B67D] mb-5">
              Our Mission
            </h2>
            <p className="text-[#0F0005] font-medium text-base 2xl:text-xl">
              To empower individuals and communities through inclusive programs
              that foster personal growth, resilience, and opportunities for a
              better future.
            </p>
          </div>

          {/* Our Vision */}
          <div className="rounded-[10px] p-[30px] bg-[#31B67D1A]">
            <h2 className="text-xl 2xl:text-2xl font-semibold text-[#31B67D] mb-5">
              Our Vision
            </h2>
            <p className="text-[0F0005] font-medium text-base 2xl:text-xl">
              A society where every young person and family has the support,
              resources, and confidence to thrive, and where strong, united
              communities work together to break cycles of disadvantage
            </p>
          </div>
        </div>

        {/* Our Impact Section */}
        <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className=" mb-6 lg:mb-12 2xl:mb-16">
            <span className="inline-block text-[#31B67D] text-sm  2xl:text-base font-semibold  mb-[12px]">
              Our Impact
            </span>
            <div className="flex gap-8 items-start">
              <h2 className="text-2xl   2xl:text-[48px] lg:text-[44px] font-semibold text-[#101828] ">
                Our Impact in people making and their life
              </h2>
              <p className="text-[#475467]  text-lg 2xl:text-xl max-w-[480px] leading-relaxed">
                Since our founding, Evolution Impact Initiative CIC has been
                dedicated to creating real change in Medway and beyond. We
                measure success not just in numbers, but in the stories of
                resilience, growth, and opportunity that emerge from the people
                we serve
              </p>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="rounded-2xl bg-[#31B67D1A] px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
              {/* Stat 1 */}
              <div className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-[60px] font-bold text-[#31B67D] mb-3">
                  10+
                </div>
                <p className="text-[#0F0005] text-sm">
                  Partnerships with schools, gyms, and local organisations have
                  amplified our reach and strengthened community ties.
                </p>
              </div>

              {/* Stat 2 */}
              <div className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-[60px] font-bold text-[#31B67D] mb-3">
                  500+
                </div>
                <p className="text-[#0F0005] text-sm">
                  Young people have benefited from sports, education, and
                  mentoring programs.
                </p>
              </div>

              {/* Stat 3 */}
              <div className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-[60px] font-bold text-[#31B67D] mb-3">
                  100+
                </div>
                <p className="text-[#0F0005] text-sm">
                  Families supported through food initiatives, workshops, and
                  wellbeing projects
                </p>
              </div>

              {/* Stat 4 */}
              <div className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-[60px] font-bold text-[#31B67D] mb-3">
                  12+
                </div>
                <p className="text-[#0F0005] text-sm">
                  Events and community initiatives, such as free school uniform
                  drives and youth engagement session
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="max-w-7xl mx-auto mt-24 pb-16 px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-[#31B67D] text-sm  2xl:text-base font-semibold  mb-[12px]">
              Our values
            </span>
            <h2 className="text-2xl mb-5  2xl:text-[48px] lg:text-[44px] font-semibold text-[#101828] ">
              Our Values
            </h2>
            <p className="text-[#475467] 2xl:text-xl text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              We are guided by values that ensure everything we do creates
              genuine and lasting change
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 ">
            {/* Value 1 - Integrity */}
            <div className="text-center">
              <div
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                className="w-12 h-12 mx-auto mb-5 flex items-center justify-center rounded-[10px] border border-[#EAECF0]"
              >
                <Image
                  src="/assets/Integrity.svg"
                  alt="Integrity"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#0F0005] mb-2">
                Integrity
              </h3>
              <p className="text-[#475467] leading-relaxed">
                We are transparent, honest, and accountable in all our actions.
              </p>
            </div>
            {/* Value 2 - Inclusivity */}
            <div className="text-center">
              <div
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                className="w-12 h-12 mx-auto mb-5 flex items-center justify-center rounded-[10px] border border-[#EAECF0]"
              >
                <Image
                  src="/assets/Inclusivity.svg"
                  alt="Inclusivity"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Inclusivity
              </h3>
              <p className="text-[#475467] leading-relaxed">
                We embrace diversity and ensure our programs are accessible to
                everyone.
              </p>
            </div>
            {/* Value 3 - Empowerment */}
            <div className="text-center">
              <div
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                className="w-12 h-12 mx-auto mb-5 flex items-center justify-center rounded-[10px] border border-[#EAECF0]"
              >
                <Image
                  src="/assets/Empowerment.svg"
                  alt="Empowerment"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Empowerment
              </h3>
              <p className="text-[#475467] leading-relaxed">
                We give people the tools, confidence, and support to reach their
                full potential.
              </p>
            </div>
            {/* Value 4 - Community */}
            <div className="text-center">
              <div
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                className="w-12 h-12 mx-auto mb-5 flex items-center justify-center rounded-[10px] border border-[#EAECF0]"
              >
                <Image
                  src="/assets/Community.svg"
                  alt="Community"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Community
              </h3>
              <p className="text-[#475467] leading-relaxed">
                We believe change happens when people work together
              </p>
            </div>
            {/* Value 5 - Growth */}
            <div className="text-center">
              <div
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                className="w-12 h-12 mx-auto mb-5 flex items-center justify-center rounded-[10px] border border-[#EAECF0]"
              >
                <Image
                  src="/assets/Growth.svg"
                  alt="Growth"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Growth
              </h3>
              <p className="text-[#475467] leading-relaxed">
                We foster resilience, lifelong learning, and personal
                development
              </p>
            </div>
            <div className="text-center">
              <div
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                className="w-12 h-12 mx-auto mb-5 flex items-center justify-center rounded-[10px] border border-[#EAECF0]"
              >
                <Image
                  src="/assets/Collaboration.svg"
                  alt="Collaboration"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Collaboration
              </h3>
              <p className="text-[#475467] leading-relaxed">
                We work with partners, families, and communities to achieve
                greater impact together.
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-12 h-12 mx-auto mb-5 flex items-center justify-center rounded-[10px] border border-[#EAECF0]"
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
              >
                <Image
                  src="/assets/Sustainability.svg"
                  alt="Sustainability"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sustainability
              </h3>
              <p className="text-[#475467] leading-relaxed">
                We focus on long-term solutions that create lasting change for
                future generations.
              </p>
            </div>{" "}
            <div className="text-center">
              <div
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                className="w-12 h-12 mx-auto mb-5 flex items-center justify-center rounded-[10px] border border-[#EAECF0]"
              >
                <Image
                  src="/assets/Innovation.svg"
                  alt="Innovation"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Innovation
              </h3>
              <p className="text-[#475467] leading-relaxed">
                We embrace creativity and new ideas to solve challenges in
                meaningful ways.
              </p>
            </div>{" "}
            <div className="text-center">
              <div
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                className="w-12 h-12 mx-auto mb-5 flex items-center justify-center rounded-[10px] border border-[#EAECF0]"
              >
                <Image
                  src="/assets/Compassion.svg"
                  alt="Compassion"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Compassion
              </h3>
              <p className="text-[#475467] leading-relaxed">
                We act with kindness, empathy, and care for those we serve.
              </p>
            </div>
          </div>
        </div>

        {/* Meet Our Team Section */}
        <div className="max-w-7xl mx-auto mt-20 pb-16  px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-[#31B67D] text-sm  2xl:text-base font-semibold  mb-[12px]">
              Our team
            </span>
            <h2 className="text-2xl mb-5  2xl:text-[48px] lg:text-[44px] font-semibold text-[#101828] ">
              Meet our team
            </h2>
            <p className="text-[#475467] 2xl:text-xl text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Our philosophy is simple — hire a team of diverse, passionate
              people and foster a culture that empowers you to do your best
              work.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 - Macram Ramba */}
            <div className="text-center bg-[#F9FAFB] pt-6 pb-12 px-6">
              <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden">
                <Image
                  src="/assets/Macram-Ramba.jpg"
                  alt="Macram Ramba"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#0F0005]">
                Macram Ramba
              </h3>
              <p className="text-[#17569D] text-sm mb-2">
                Co-founder & Managing Director
              </p>
              <p className="text-[#475467] text-sm leading-relaxed mb-4">
                Driving strategy, partnerships, and mission alignment
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/twitter-icon.svg"
                    alt="Twitter"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/linkedin-icon.svg"
                    alt="LinkedIn"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/dribble-icon.svg"
                    alt="dribble"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
              </div>
            </div>

            {/* Team Member 2 - Frank. G */}
            <div className="text-center bg-[#F9FAFB] pt-6 pb-12 px-6">
              <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden">
                <Image
                  src="/assets/Frank.jpg"
                  alt="Frank G"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#0F0005]">Frank S</h3>
              <p className="text-[#17569D] text-sm mb-2">
                Co-founder & Managing Director
              </p>
              <p className="text-[#475467] text-sm leading-relaxed mb-4">
                Driving partnerships, networking, facilities, and content
                creation.
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/twitter-icon.svg"
                    alt="Twitter"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/linkedin-icon.svg"
                    alt="LinkedIn"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/dribble-icon.svg"
                    alt="dribble"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
              </div>
            </div>

            {/* Team Member 3 - Luke Rogers */}
            <div className="text-center bg-[#F9FAFB] pt-6 pb-12 px-6">
              <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden">
                <Image
                  src="/assets/Blessing-Emuchay.jpg"
                  alt="Blessing Emuchay"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#0F0005]">
                Blessing Emuchay
              </h3>
              <p className="text-[#17569D] text-sm mb-2">
                Finance & Funding Lead (Treasurer)
              </p>
              <p className="text-[#475467] text-sm leading-relaxed mb-4">
                managing budgets, funding applications, and financial reporting{" "}
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/twitter-icon.svg"
                    alt="Twitter"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/linkedin-icon.svg"
                    alt="LinkedIn"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/dribble-icon.svg"
                    alt="dribble"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
              </div>
            </div>

            {/* Team Member 4 - Blessing Emuchay */}
            <div className="text-center bg-[#F9FAFB] pt-6 pb-12 px-6">
              <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden">
                <Image
                  src="/assets/Fumni.A.jpg"
                  alt="Blessing Emuchay"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#0F0005]">
                Fumni Ayeni{" "}
              </h3>
              <p className="text-[#17569D] text-sm mb-2">
                Partnerships & Outreach Lead
              </p>
              <p className="text-[#475467] text-sm leading-relaxed mb-4">
                building collaborations with schools, councils, charities, and
                the wider community.{" "}
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/twitter-icon.svg"
                    alt="Twitter"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/linkedin-icon.svg"
                    alt="LinkedIn"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/dribble-icon.svg"
                    alt="dribble"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
              </div>
            </div>

            {/* Team Member 5 - Nevien Ramba */}
            <div className="text-center bg-[#F9FAFB] pt-6 pb-12 px-6">
              <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden">
                <Image
                  src="/assets/Luke-Rogers.jpg"
                  alt="Nevien Ramba"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#0F0005]">
                Luke Rogers{" "}
              </h3>
              <p className="text-[#17569D] text-sm mb-2">
                Communications & Marketing Lead
              </p>
              <p className="text-[#475467] text-sm leading-relaxed mb-4">
                Managing social media, branding, and PR to grow visibility and
                community engagement.
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/twitter-icon.svg"
                    alt="Twitter"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/linkedin-icon.svg"
                    alt="LinkedIn"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/dribble-icon.svg"
                    alt="dribble"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
              </div>
            </div>

            {/* Team Member 6 - Fumi A */}
            <div className="text-center bg-[#F9FAFB] pt-6 pb-12 px-6">
              <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden">
                <Image
                  src="/assets/fumi-a.png"
                  alt="Fumi A"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#0F0005]">
                Nevien Ramba
              </h3>
              <p className="text-[#17569D] text-sm mb-2">
                Operations & Compliance Lead
              </p>
              <p className="text-[#475467] text-sm leading-relaxed mb-4">
                Overseeing daily operations, safeguarding, compliance, and CIC
                reporting.{" "}
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/twitter-icon.svg"
                    alt="Twitter"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/linkedin-icon.svg"
                    alt="LinkedIn"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <Image
                    src="/assets/dribble-icon.svg"
                    alt="dribble"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
