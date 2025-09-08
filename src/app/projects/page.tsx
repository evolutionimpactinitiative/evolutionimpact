import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  learnMoreLink?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  learnMoreLink,
}) => {
  return (
    <div className="bg-white">
      {/* Project Image */}
      <div className="relative h-[500] mb-4">
        <Image src={image} alt={title} fill className="object-cover" />
        {/* Community Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-2 shadow-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-[#0F0005]">Community</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-2">
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight whitespace-pre-line">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        {learnMoreLink && (
          <Link
            href={learnMoreLink}
            className="inline-flex gap-[4px] items-center text-green-500 font-medium border-b border-green-500 pb-0.5 hover:text-green-600 hover:border-green-600 transition-colors duration-200"
          >
            Learn More
            <Image
              src="/assets/arrow.svg"
              alt="Arrow"
              width={16}
              height={16}
              className="w-4 h-4 mr-2"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  const upcomingProjects = [
    {
      title: "Back-to-School Giveaway.\n Sat - 30th August 2025 \n 11:00-14:00",
      description:
        "Providing free school uniforms and supplies to children in Medway.",
      image: "/assets/project1.png",
      learnMoreLink: "/back-to-school",
    },
    {
      title:
        "Sip & Paint Kids Edition.\n Sat -27th September 2025\n 13:00-15:00",
      description:
        "An afternoon of creativity and fun with Evaluation Impact Initiative.",
      image: "/assets/project2.png",
      learnMoreLink: "/back-to-school",
    },
    {
      title:
        "Sip & Paint Kids Edition.\n Sat -27th September 2025\n 13:00-15:00",
      description:
        "Giving Children a taste of mixed martial arts with Evaluation Impact Initiative.",
      image: "/assets/project3.png",
      learnMoreLink: "/back-to-school",
    },
  ];

  const pastProjects = [
    {
      title: "Back-to-School Giveaway.\n Sat - 30th August 2025 \n 11:00-14:00",
      description:
        "Providing free school uniforms and supplies to children in Medway.",
      image: "/assets/project1.png",
    },

    {
      title:
        "Sip & Paint Kids Edition.\n Sat -27th September 2025\n 13:00-15:00",
      description:
        "Giving Children a taste of mixed martial arts with Evaluation Impact Initiative.",
      image: "/assets/project3.png",
    },
  ];
  return (
    <>
      <Navbar />
      <div>
        <section className=" py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header - Centered */}
            <div className="text-center mb-[60px] 2xl:mb-[80px]">
              <h3 className="text-[#31B67D] text-lg font-medium mb-2">
                All Events
              </h3>
              <h2 className="text-2xl md:text-[48px] font-bold text-gray-900 mb-2">
                Upcoming Events
              </h2>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 lg:mb-20">
              {upcomingProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  learnMoreLink={project.learnMoreLink}
                />
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Header - Centered */}
            <div className="text-center mb-[60px] 2xl:mb-[80px]">
              <h2 className="text-2xl md:text-[48px] font-bold text-gray-900 mb-2">
                Past Events
              </h2>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 lg:mb-20">
              {pastProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Projects;
