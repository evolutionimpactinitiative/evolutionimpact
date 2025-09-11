"use client";
import React, { useState } from "react";
import Image from "next/image";
import PartnerModal from "./PartnerModal";
import VolunteerModal from "./VolunteerModal";
import DonationForm from "./DonationForm";

interface GetInvolvedCardProps {
  icon: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
  onClick?: () => void;
  setIsPartnerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// TypeScript interface for the get involved option
interface GetInvolvedOption {
  icon: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

// Reusable Get Involved Card Component
const GetInvolvedCard: React.FC<GetInvolvedCardProps> = ({
  icon,
  title,
  description,
  linkText,
  href,
  onClick,
  setIsPartnerModalOpen,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Icon */}
      <div className="mb-6">
        <Image src={icon} alt={`${title} icon`} width={40} height={40} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-[#121212] mb-6">{title}</h3>

      {/* Description */}
      <p className="text-[#575757] text-sm leading-relaxed mb-6 flex-grow">
        {description}
      </p>

      {onClick ? (
        <button
          onClick={handleClick}
          className="inline-flex gap-[4px] items-center text-green-500 font-medium border-b border-green-500 pb-0.5 hover:text-green-600 hover:border-green-600 transition-colors duration-200 w-fit"
        >
          {linkText}
          <Image
            src="/assets/arrow.svg"
            alt="Arrow"
            width={16}
            height={16}
            className="w-4 h-4"
          />
        </button>
      ) : (
        <div
          onClick={() => setIsPartnerModalOpen(true)}
          className="inline-flex cursor-pointer gap-[4px] items-center text-green-500 font-medium border-b border-green-500 pb-0.5 hover:text-green-600 hover:border-green-600 transition-colors duration-200 w-fit"
        >
          {linkText}
          <Image
            src="/assets/arrow.svg"
            alt="Arrow"
            width={16}
            height={16}
            className="w-4 h-4"
          />
        </div>
      )}
    </div>
  );
};

const JoinMovementSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const getInvolvedOptions: GetInvolvedOption[] = [
    {
      icon: "/assets/time.svg",
      title: "Volunteer Your Time",
      description: "Help us run events, workshops, and community programs.",
      linkText: "Volunteer",
      href: "/volunteer",
    },
    {
      icon: "/assets/partner.svg",
      title: "Partner With Us",
      description: "Collaborate to bring positive change to the community",
      linkText: "Partner with Us",
      href: "/partner",
    },
    {
      icon: "/assets/big-donate.svg",
      title: "Donate",
      description:
        "Every contribution, big or small, goes directly into supporting our initiatives.",
      linkText: "Donate",
      href: "/donate",
    },
  ];

  return (
    <section className="py-6 md:py-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h3 className="text-[#31B67D] font-medium text-sm mb-2 uppercase tracking-wide">
          Get Involved
        </h3>
        <h2 className="text-2xl lg:text-[48px] font-bold text-[#121212] mb-2">
          Join The Movement
        </h2>
        <p className="text-[#0F0005] text-sm md:text-lg max-w-3xl mx-auto">
          We can&apos;t create impact alone — we need people like you! There are
          many ways to get involved with Evolution Impact Initiative CIC
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 lg:mb-20">
        {getInvolvedOptions.map((option, index) => (
          <GetInvolvedCard
            key={index}
            icon={option.icon}
            title={option.title}
            description={option.description}
            linkText={option.linkText}
            setIsPartnerModalOpen={setIsPartnerModalOpen}
            href={option.href}
            onClick={index === 0 ? () => setIsModalOpen(true) : undefined}
          />
        ))}
      </div>

      {/* Center Call-to-Action Button */}
      <div className="text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-[#17569D] border border-[#17569D] font-medium px-6 py-2 rounded-full hover:bg-[#31B67D] hover:border-[#31B67D] cursor-pointer hover:text-white transition-colors duration-300"
        >
          Become a Volunteer
        </button>
      </div>

      {/* Volunteer Modal */}
      <VolunteerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <PartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

      {/* Donation Modal */}
      {isDonationModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsDonationModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-4">
              <DonationForm
                campaignId="warmth-for-all"
                campaignTitle="Warmth For All"
                onSuccess={() => {
                  // Optional: Add any callback logic here
                  console.log("Donation successful");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default JoinMovementSection;
