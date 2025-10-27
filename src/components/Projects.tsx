"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  slug: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  slug,
}) => {
  return (
    <Link href={`/projects/${slug}`} className="block bg-white cursor-pointer">
      {/* Project Image */}
      <div className="relative h-[500px] mb-4">
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
        <div className="inline-flex gap-[4px] items-center text-green-500 font-medium border-b border-green-500 pb-0.5 hover:text-green-600 hover:border-green-600 transition-colors duration-200">
          Learn More
          <Image
            src="/assets/arrow.svg"
            alt="Arrow"
            width={16}
            height={16}
            className="w-4 h-4 mr-2"
          />
        </div>
      </div>
    </Link>
  );
};

const ProjectsSection: React.FC = () => {
  const projects = [
    {
      title: "The Big Bake Off – Christmas Edition 13th December 2025",
      description:
        "Join us for The Big Bake Off – Christmas Edition — a joyful, team-based baking challenge where...",
      image: "/assets/bake.jpg",
      slug: "the-big-bake-off",
    },
    {
      title: "Warmth for all\n 22nd November 2025",
      description:
        "Community outreach providing coats, trainers, and sleeping bags to those in need.",
      image: "/assets/warmth.jpg",
      slug: "warmth-for-all",
    },
  ];

  return (
    <section className="py-6 md:py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Centered */}
        <div className="text-center mb-12">
          <h3 className="text-green-500 text-xs md:text-lg font-medium mb-2">
            Projects
          </h3>
          <h2 className="text-2xl md:text-[48px] font-bold text-gray-900 mb-2">
            Current & Upcoming <br className="block md:hidden" /> Projects
          </h2>
          <p className="text-[#0F0005] text-lg max-w-2xl mx-auto">
            Making a Difference in Action
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 lg:mb-20">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              image={project.image}
              slug={project.slug}
            />
          ))}
        </div>

        {/* See All Events Button */}
        <div className="text-center">
          <Link href="/projects">
            <button className="bg-white text-[#17569D] border border-[#17569D] font-medium px-6 py-2 rounded-full hover:bg-[#31B67D] hover:border-[#31B67D] cursor-pointer hover:text-white transition-colors duration-300">
              See All Events
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
