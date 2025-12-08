"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  slug: string;
  isPastEvent?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  slug,
  isPastEvent = false,
}) => {
  return (
    <Link href={`/projects/${slug}`} className="block bg-white cursor-pointer">
      <div>
        {/* Project Image */}
        <div className="relative h-[500px] mb-4">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover  rounded-lg"
          />
          {/* Community Badge */}
          <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-2 shadow-sm">
            <div
              className={`w-2 h-2 rounded-full  ${
                isPastEvent ? "bg-gray-400" : "bg-blue-500"
              }`}
            ></div>
            <span className="text-sm font-medium text-[#0F0005]">
              {isPastEvent ? "Past Event" : "Community"}
            </span>
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
          <div
            className={`inline-flex gap-[4px] items-center font-medium border-b pb-0.5 transition-colors duration-200 text-green-500 border-green-500 hover:text-green-600 hover:border-green-600`}
          >
            {isPastEvent ? "View Event" : "Learn More"}
            <Image
              src="/assets/arrow.svg"
              alt="Arrow"
              width={16}
              height={16}
              className="w-4 h-4 mr-2"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

const Projects = () => {
  const upcomingProjects = [
    {
      title: "The Big Bake Off – Christmas Edition 13th December 2025",
      description:
        "Join us for The Big Bake Off – Christmas Edition — a joyful, team-based baking challenge where...",
      image: "/assets/bake.jpg",
      slug: "the-big-bake-off",
    },
    {
      title: "Christmas Turkey Giveaway \n 23th December 2025",
      description:
        "Medway Soup Kitchen CIC in partnership with Evolution Impact Initiative CIC is running a....",
      image: "/assets/Free-turkey.jpg",
      slug: "christmas-turkey-giveaway",
    },
  ];

  const pastProjects = [
    // {
    //   title: "Warmth for all\n 18th October 2025 ",
    //   description:
    //     "Community outreach providing coats, trainers, and sleeping bags to those in need.",
    //   image: "/assets/warmth.jpg",
    //   slug: "warmth-for-all",
    // },
    {
      title: "Kids' Jewellery Making\n 25th October 2025 ",
      description:
        "A creative workshop where children design and make their own bracelets, necklaces, and keychains.",
      image: "/assets/jewellery-making.jpg",
      slug: "jewellery-making",
      isPastEvent: true,
    },
    {
      title:
        "Free Child Safety Programme.\n 28th September 2025 \n11:00am – 3:00pm",
      description:
        "Essential safety skills training for children aged 5-11 in a fun and supportive environment.",
      image: "/assets/safety.jpg",
      slug: "child-safety",
      isPastEvent: true,
    },
    {
      title: "Sip & Paint for Kids.\n 27th September 2025 \n1:00 PM – 3:00 PM",
      description:
        "A creative weekend experience for children in a safe, welcoming environment.",
      image: "/assets/sip-and-paint.jpg",
      slug: "sip-and-paint",
      isPastEvent: true,
    },

    {
      title: "Back-to-School Giveaway.\n Sat - 30th August 2025 \n 11:00-14:00",
      description:
        "Provided free school uniforms and supplies to children in Medway.",
      image: "/assets/back-to-school.jpg",
      slug: "back-to-school",
      isPastEvent: true,
    },
    {
      title:
        "Evolution Kids - Summer Warriors Day\n Sat -19th July 2025 \n  11:AM  - 13:0",
      description:
        "Gave children a taste of mixed martial arts with Evolution Impact Initiative.",
      image: "/assets/summer-warriors.jpeg",
      slug: "summer-warriors",
      isPastEvent: true,
    },
  ];

  return (
    <>
      <Navbar />
      <div>
        <section className="py-16 px-6">
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

            {/* Upcoming Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 lg:mb-20">
              {upcomingProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  slug={project.slug}
                />
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Past Events Header */}
            <div className="text-center mb-[60px] 2xl:mb-[80px]">
              <h2 className="text-2xl md:text-[48px] font-bold text-gray-900 mb-2">
                Past Events
              </h2>
              <p className="text-gray-600">
                Celebrating our community impact and successful initiatives
              </p>
            </div>

            {/* Past Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 lg:mb-20">
              {pastProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  slug={project.slug}
                  isPastEvent={project.isPastEvent}
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
