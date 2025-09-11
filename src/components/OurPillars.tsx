"use client";

import React, { useState } from "react";
import Image from "next/image";

interface PillarCardProps {
  title: string;
  description: string;
  iconGreen: string;
  iconWhite: string;
  isHighlighted?: boolean;
  isClicked?: boolean;
  onCardClick?: () => void;
}

const PillarCard: React.FC<PillarCardProps> = ({
  title,
  description,
  iconGreen,
  iconWhite,
  isHighlighted = false,
  isClicked = false,
  onCardClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine if card should show active state (green background)
  const isActive = isHighlighted || isHovered || isClicked;

  const handleClick = () => {
    if (onCardClick) {
      onCardClick();
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`
        relative px-[40px]  md:px-[60px] pb-8 rounded-[12px] border transition-all duration-300 cursor-pointer group
        ${
          isActive
            ? "bg-[#31B67D] text-white border-[#31B67D]"
            : "bg-white text-gray-900 border-[#D4D4D4]"
        }
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Add touch-action for better mobile interaction
      style={{ touchAction: "manipulation" }}
    >
      {/* Icon */}
      <div className="flex justify-center mb-8 md:mt-[64px] mt-8">
        <div className="relative w-10 h-10">
          {/* Green icon - visible when not active */}
          <Image
            src={iconGreen}
            alt={`${title} icon`}
            width={40}
            height={40}
            className={`
              absolute inset-0 w-full h-full transition-opacity duration-300
              ${isActive ? "opacity-0" : "opacity-100"}
            `}
          />
          {/* White icon - visible when active */}
          <Image
            src={iconWhite}
            alt={`${title} icon`}
            width={40}
            height={40}
            className={`
              absolute inset-0 w-full h-full transition-opacity duration-300
              ${isActive ? "opacity-100" : "opacity-0"}
            `}
          />
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <h3
          className={`text-base md:text-xl font-semibold mb-2 leading-tight md:whitespace-pre-line ${
            isActive ? "text-white" : "text-[#0F0005]"
          }`}
        >
          {title}
        </h3>
        <p
          className={`
          text-sm leading-relaxed
          ${isActive ? "text-white" : "text-[#0F0005]"}
        `}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

const OurPillarsSection: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const pillars = [
    {
      title: "Youth Empowerment &\nEducation",
      description:
        "Giving young people the skills, confidence, and opportunities to succeed.",
      iconGreen: "/assets/education-green.svg",
      iconWhite: "/assets/education-white.svg",
    },
    {
      title: "Sport & Teamwork\nDevelopment",
      description:
        "Using combat sports, fitness, and teamwork to build discipline and resilience.",
      iconGreen: "/assets/sport-green.svg",
      iconWhite: "/assets/sport-white.svg",
      isHighlighted: false,
    },
    {
      title: "Health &\nWellbeing",
      description:
        "Promoting mental health,\nphysical fitness, and emotional wellbeing.",
      iconGreen: "/assets/health-green.svg",
      iconWhite: "/assets/health-white.svg",
    },
    {
      title: "Food Security &\nCommunity Support",
      description: "Tackling food poverty and supporting families in need.",
      iconGreen: "/assets/food-green.svg",
      iconWhite: "/assets/food-white.svg",
    },
    {
      title: "Arts, Culture &\nCreativity",
      description:
        "Encouraging self-expression and community engagement through creative projects.",
      iconGreen: "/assets/arts-green.svg",
      iconWhite: "/assets/arts-white.svg",
    },
    {
      title: "Woman\nEmpowerment",
      description:
        "Supporting women with skills, networks, education, and mentorship to unlock opportunities and thrive",
      iconGreen: "/assets/woman-green.svg",
      iconWhite: "/assets/woman-white.svg",
    },
  ];

  return (
    <section className="bg-white py-6 md:py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h3 className="text-[#31B67D] text-xs md:text-lg font-medium mb-2">
            Our Pillars
          </h3>
          <h2 className="text-2xl md:text-[48px] font-semibold text-[#121212] mb-2">
            Our Areas Of Impact
          </h2>
          <p className="text-[#0F0005] text-sm md:text-lg mx-auto max-w-3xl">
            We deliver community projects and initiatives across six key areas:
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {pillars.map((pillar, index) => (
            <PillarCard
              key={index}
              title={pillar.title}
              description={pillar.description}
              iconGreen={pillar.iconGreen}
              iconWhite={pillar.iconWhite}
              isHighlighted={pillar.isHighlighted}
              isClicked={activeCardIndex === index}
              onCardClick={() => {
                // If clicking the same card, toggle it off, otherwise set it as active
                setActiveCardIndex(activeCardIndex === index ? null : index);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPillarsSection;