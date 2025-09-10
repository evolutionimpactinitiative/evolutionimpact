"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WarmthVolunteerModal from "@/components/WarmthVolunteerModal";
import SipPaintModal from "@/components/SipPaintModal";
import SafetyModal from "@/components/SafetyModal";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { notFound } from "next/navigation";

// Project data structure
interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  about: {
    title: string;
    content: string[];
  };
  eventDetails: {
    venue: string;
    date: string;
    time: string;
  };
  sections: Array<{
    title: string;
    content: string[];
    list?: Array<{
      number?: string;
      text: string;
    }>;
  }>;
  sidebar: {
    title: string;
    description: string;
    eventDetails: Array<{
      icon: string;
      label: string;
      value: string;
    }>;
    buttons: Array<{
      text: string;
      type: "primary" | "secondary";
      action: "volunteer" | "donate" | "share";
    }>;
    footerMessage: string;
  };
  modalType: "warmth" | "safety" | "sipPaint";
}

// Project data
const projectsData: Record<string, ProjectData> = {
  "warmth-for-all": {
    slug: "warmth-for-all",
    title: "Warmth for All – Community Outreach Event",
    subtitle: "Warmth for All – Community Outreach Event",
    bannerImage: "/assets/warmth-for-all-banner.jpg",
    about: {
      title: "About the Event",
      content: [
        "This winter, too many people in our community will be sleeping rough without the basic essentials to stay warm. Warmth for All is our response – a community-led project dedicated to providing coats, trainers, and sleeping bags directly to those who need them most.",
        "On Saturday 18th October, our volunteers will be going out into Medway to meet homeless individuals where they are – on the streets, in parks, and in other public spaces – to offer practical support and a sense of dignity.",
        "Together, we can bring warmth, comfort, and hope to our neighbours in need."
      ]
    },
    eventDetails: {
      venue: "ECA - 86 King Street, Rochester, Kent, ME1 1YD",
      date: "Saturday 18th October 2025",
      time: "11:00 AM – 3:00 PM"
    },
    sections: [
      {
        title: "How You Can Help",
        content: ["There are 3 main ways to get involved:"],
        list: [
          {
            number: "1.",
            text: "Volunteer on the day – join our outreach team to hand out items, offer support, and spread kindness."
          },
          {
            number: "2.",
            text: "Donate items – coats, trainers, and sleeping bags in good condition are especially needed."
          },
          {
            number: "3.",
            text: "Give financially – every contribution helps us purchase additional supplies and reach more people."
          }
        ]
      },
      {
        title: "Volunteer Information",
        content: [],
        list: [
          {
            text: "All volunteers will meet at Evolution Combat Academy at 11AM for a short briefing before heading out."
          },
          {
            text: "Roles include distributing items, carrying supplies, talking to those we meet, and supporting with safe transport."
          },
          {
            text: "Please wear comfortable shoes and warm clothing."
          }
        ]
      },
      {
        title: "What to Donate & Drop-Off Times",
        content: [
          "We are currently collecting:",
          "- Adult coats (all sizes, clean and in good condition)",
          "- Trainers (especially sizes 5-13)",
          "- Sleeping bags (new or gently used)",
          "",
          "Drop-off Location: Evolution Combat Academy, 86 King Street, Rochester, Kent, ME1 1YD",
          "",
          "Drop-off Days & Times:",
          "- Tuesday: 16:00 – 19:00",
          "- Friday: 16:00 – 19:00", 
          "- Saturday: 12:00 – 17:00",
          "",
          "Please note: All donated items must be new or fairly used, clean, and if possible, washed and ironed."
        ]
      },
      {
        title: "Why It Matters",
        content: [
          "Homelessness is not just about lacking shelter – it's about dignity, safety, and survival. Something as simple as a warm coat or sleeping bag can make the difference between hardship and hope. By coming together as a community, we can ensure no one is forgotten this winter."
        ]
      }
    ],
    sidebar: {
      title: "Spread the Word",
      description: "Help us reach more people by sharing this event with friends, family and colleagues. The more awareness we raise, the bigger impact we can make.",
      eventDetails: [
        { icon: "/assets/calendar-icon-white.svg", label: "Event", value: "Warmth for All – Community Outreach" },
        { icon: "/assets/date-icon-white.svg", label: "Date", value: "Saturday 18th October 2025" },
        { icon: "/assets/clock-icon-white.svg", label: "Time", value: "11:00 AM – 3:00 PM" },
        { icon: "/assets/location-icon-white.svg", label: "Meeting Point", value: "Evolution Combat Academy, Rochester, Kent" },
        { icon: "/assets/time-icon-white.svg", label: "Drop-off Times", value: "Tues 16:00–19:00 | Fri 16:00–19:00 | Sat 12:00–17:00" },
        { icon: "/assets/phone-icon-white.svg", label: "Contact", value: "07874 059644" }
      ],
      buttons: [
        { text: "Donate", type: "primary", action: "donate" },
        { text: "Share Now", type: "secondary", action: "share" }
      ],
      footerMessage: "Join us. Donate. Volunteer. Make a difference"
    },
    modalType: "warmth"
  },
  "child-safety": {
    slug: "child-safety",
    title: "FREE Child Safety Programme",
    subtitle: "Keeping Your Children Safe – In Partnership with ECA, NEXGEN PROTECTION & Evolution Impact Initiative CIC",
    bannerImage: "/assets/safety-banner.jpg",
    about: {
      title: "About the Programme",
      content: [
        "Following the successful Safety Talks delivered at Evolution Combat Academy, NEXGEN PROTECTION is launching the Child Safety Programme — a vital one-day training designed to teach children essential safety skills in a fun and supportive environment.",
        "This session empowers children with both verbal and physical self-protection skills, giving them the confidence to deal with real-life situations such as travelling to and from school and responding to unwanted stranger interactions."
      ]
    },
    eventDetails: {
      venue: "Evolution Combat Academy, Rochester, Kent, ME1 1YD",
      date: "28th September 2025",
      time: "11:00am – 3:00pm"
    },
    sections: [
      {
        title: "Programme Benefits",
        content: [],
        list: [
          { text: "FREE for this launch event (normally £25–£50 per child)" },
          { text: "Covers personal safety, travel safety & stranger awareness" },
          { text: "Practical tools to build confidence and awareness" },
          { text: "Parents welcome to attend (maximum two children per adult)" },
          { text: "Designed for children aged 5–11 years old" }
        ]
      },
      {
        title: "What to Bring",
        content: [],
        list: [
          { text: "Comfortable clothes (no skirts/dresses)" },
          { text: "Light snacks & drinks for short breaks" }
        ]
      },
      {
        title: "Delivered in Partnership",
        content: [
          "This event is proudly brought to you by:",
          "Evolution Combat Academy × NEXGEN PROTECTION × Evolution Impact Initiative CIC"
        ]
      }
    ],
    sidebar: {
      title: "Register Now",
      description: "LIMITED SPACES – Book Now! ECA students will receive priority booking before spaces open to the public.",
      eventDetails: [
        { icon: "/assets/calendar-icon-white.svg", label: "Programme", value: "FREE Child Safety Programme" },
        { icon: "/assets/date-icon-white.svg", label: "Date", value: "28th September 2025" },
        { icon: "/assets/clock-icon-white.svg", label: "Time", value: "11:00am – 3:00pm" },
        { icon: "/assets/location-icon-white.svg", label: "Venue", value: "Evolution Combat Academy, Rochester, Kent" },
        { icon: "/assets/phone-icon-white.svg", label: "Age Group", value: "Children aged 5–11 years" },
        { icon: "/assets/time-icon-white.svg", label: "Cost", value: "FREE (Launch Event)" }
      ],
      buttons: [
        { text: "Register", type: "primary", action: "volunteer" },
        { text: "Share Event", type: "secondary", action: "share" }
      ],
      footerMessage: "Keeping Your Children Safe & Confident"
    },
    modalType: "safety"
  },
  "sip-and-paint": {
    slug: "sip-and-paint",
    title: "Sip & Paint for Kids!",
    subtitle: "Hosted by Evolution Impact Initiative CIC",
    bannerImage: "/assets/sipandpaint.jpg",
    about: {
      title: "A Creative Weekend Experience for Children",
      content: [
        "Looking for a fun and inspiring activity for your little ones? Join us for our Sip & Paint Kids Event — a safe, welcoming space where children can explore their creativity, enjoy a refreshing drink, and take home their very own masterpiece!",
        "This event is all about fun, confidence, and self-expression, giving kids the chance to try something new while parents relax knowing they're in a supportive environment."
      ]
    },
    eventDetails: {
      venue: "Gillingham Children & Family Hub, Woodlands Road, Gillingham, Kent, ME7 2BX",
      date: "Saturday, 13th September",
      time: "1:00 PM – 3:00 PM"
    },
    sections: [
      {
        title: "Event Benefits",
        content: [],
        list: [
          { text: "Free entry (community-supported initiative)" },
          { text: "Children keep the artwork they create" },
          { text: "Fun, social and confidence-building activity" },
          { text: "All materials provided" }
        ]
      },
      {
        title: "Important Information",
        content: [
          "LIMITED SPACES – Book Now!",
          "Spaces are limited and expected to fill quickly — please register early to avoid disappointment."
        ]
      }
    ],
    sidebar: {
      title: "Register Your Child",
      description: "Spaces are limited and expected to fill quickly. Register early to secure your child's place in this creative experience.",
      eventDetails: [
        { icon: "/assets/calendar-icon-white.svg", label: "Event", value: "Sip & Paint for Kids" },
        { icon: "/assets/date-icon-white.svg", label: "Date", value: "Saturday, 13th September" },
        { icon: "/assets/clock-icon-white.svg", label: "Time", value: "1:00 PM – 3:00 PM" },
        { icon: "/assets/location-icon-white.svg", label: "Venue", value: "Gillingham Children & Family Hub" },
        { icon: "/assets/phone-icon-white.svg", label: "Cost", value: "FREE" },
        { icon: "/assets/time-icon-white.svg", label: "Materials", value: "All Provided" }
      ],
      buttons: [
        { text: "Register", type: "primary", action: "volunteer" },
        { text: "Share Event", type: "secondary", action: "share" }
      ],
      footerMessage: "Creativity • Fun • Community"
    },
    modalType: "sipPaint"
  }
};

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ params }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const resolvedParams = React.use(params);
  
  const project = projectsData[resolvedParams.slug];
  
  if (!project) {
    notFound();
  }

  const renderModal = () => {
    switch (project.modalType) {
      case "warmth":
        return (
          <WarmthVolunteerModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        );
      case "safety":
        return (
          <SafetyModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        );
      case "sipPaint":
        return (
          <SipPaintModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        );
      default:
        return null;
    }
  };

  const handleButtonClick = (action: string) => {
    switch (action) {
      case "volunteer":
        setIsModalOpen(true);
        break;
      case "donate":
        // Handle donate action
        console.log("Donate clicked");
        break;
      case "share":
        // Handle share action
        console.log("Share clicked");
        break;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Banner - Full Width */}
        <div className="w-full 2xl:pt-[88px] pt-[60px] px-4 max-w-[1280px] mx-auto sm:px-6 lg:px-8">
          <Image
            src={project.bannerImage}
            alt={project.title}
            width={1280}
            height={624}
            className="w-[1280px] h-auto object-cover rounded-[12px]"
          />
        </div>

        {/* Main Content Section */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Content - Event Details */}
            <div className="flex-1 lg:max-w-[853px]">
              {/* Event Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-[#17569D] mb-2">
                {project.title}
              </h1>
              {project.subtitle && (
                <h2 className="text-lg text-[#0F0005] mb-5">
                  {project.subtitle}
                </h2>
              )}

              {/* About the Event */}
              <div className="mb-5">
                <h2 className="text-xl font-manrope 2xl:text-2xl font-bold text-[#000000] mb-3">
                  {project.about.title}
                </h2>
                <div className="space-y-2 2xl:text-2xl text-[#0F0005] leading-relaxed">
                  {project.about.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Event Details */}
              <div className="mb-8 space-y-3 font-nunito">
                <div className="flex items-start gap-3">
                  <p className="2xl:text-2xl text-[#0F0005] font-semibold">
                    📍 Venue: {project.eventDetails.venue}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <p className="2xl:text-2xl text-[#0F0005] font-semibold">
                    📅 Date: {project.eventDetails.date}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <p className="2xl:text-2xl text-[#0F0005] font-semibold">
                    ⏰ Time: {project.eventDetails.time}
                  </p>
                </div>
              </div>

              {/* Dynamic Sections */}
              {project.sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-xl 2xl:text-2xl font-bold text-black mb-3">
                    {section.title}
                  </h2>
                  
                  {section.content.map((content, contentIndex) => (
                    <p key={contentIndex} className="text-[#0F0005] mb-4 2xl:text-xl">
                      {content}
                    </p>
                  ))}

                  {section.list && (
                    <div className="space-y-3 2xl:text-xl">
                      {section.list.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          {item.number && (
                            <span className="flex-shrink-0">{item.number}</span>
                          )}
                          {!item.number && (
                            <span className="w-1 h-1 bg-[#0F0005] rounded-full mt-2 flex-shrink-0"></span>
                          )}
                          <p className="text-[#0F0005]">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Volunteer button for sections that need it */}
                  {section.title.includes("Volunteer") && (
                    <div className="mt-6">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-white border-1 cursor-pointer border-[#17569D] text-[#17569D] font-medium py-[10px] px-8 rounded-full"
                      >
                        Register as a Volunteer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-[427px]">
              <div className="bg-[#17569D] rounded-2xl p-8 text-white sticky top-20">
                {/* Header */}
                <div className="mb-5">
                  <h3 className="text-2xl font-bold mb-4">{project.sidebar.title}</h3>
                  <p className="text-blue-100 leading-relaxed">
                    {project.sidebar.description}
                  </p>
                </div>

                {/* Event Details */}
                <div className="space-y-4 mb-8 font-medium text-sm">
                  {project.sidebar.eventDetails.map((detail, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 mt-0.5">
                        <Image
                          src={detail.icon}
                          alt={detail.label}
                          width={20}
                          height={20}
                          className="w-full h-full"
                        />
                      </div>
                      <span>{detail.label}: {detail.value}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="gap-3 flex md:flex-row flex-col">
                  {project.sidebar.buttons.map((button, index) => (
                    <button
                      key={index}
                      onClick={() => handleButtonClick(button.action)}
                      className={`w-full font-semibold py-[10px] px-6 rounded-full transition-colors duration-200 ${
                        button.type === "primary"
                          ? "bg-white text-[#17569D] hover:bg-gray-50"
                          : "border-2 border-white text-white hover:bg-white hover:text-[#17569D]"
                      } ${
                        button.action === "share" ? "flex items-center justify-center gap-2" : ""
                      }`}
                    >
                      {button.text}
                      {button.action === "share" && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                {/* Footer Message */}
                <div className="mt-8 text-center font-medium text-sm text-white">
                  <p>{project.sidebar.footerMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderModal()}
      <Footer />
    </>
  );
};

export default ProjectPage;