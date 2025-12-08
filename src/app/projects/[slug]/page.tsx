"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WarmthVolunteerModal from "@/components/WarmthVolunteerModal";
import SipPaintModal from "@/components/SipPaintModal";
import JewelleryMakingModal from "@/components/JewelleryMakingModal";
import SafetyModal from "@/components/SafetyModal";
import DonationForm from "@/components/DonationForm";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import BakeOffModal from "@/components/BakeOffModal";
import TurkeyGiveawayModal from "@/components/TurkeyGiveawayModal";

// Share Modal Component
const ShareModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
}> = ({ isOpen, onClose, projectTitle }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Share Event</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Event Title */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Sharing:</p>
            <p className="font-medium text-gray-900">{projectTitle}</p>
          </div>

          {/* URL Display and Copy Button */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-600 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-[#17569D] text-white hover:bg-[#125082]"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Share Message */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Share this link with friends and family to spread the word about
              this event!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Project data structure
interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  isPastEvent?: boolean;
  disabled?: boolean;
  about: {
    title: string;
    content: string[];
  };
  eventDetails: {
    venue: string;
    date: string;
    time?: string;
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
      type: "primary" | "secondary" | "disabled";
      action: "volunteer" | "donate" | "share" | "soldout" | "donate_page";
    }>;
    footerMessage?: string;
  };
  modalType:
    | "warmth"
    | "safety"
    | "sipPaint"
    | "jewellery"
    | "bakeOff"
    | "turkeyGiveaway"
    | "none";
}

// Project data
const projectsData: Record<string, ProjectData> = {
  "christmas-turkey-giveaway": {
    slug: "christmas-turkey-giveaway",
    title: "Christmas Turkey Giveaway 2025",
    subtitle: "Medway Soup Kitchen × Evolution Impact Initiative",
    bannerImage: "/assets/Free-turkey-Web.jpg",
    about: {
      title: "Supporting families in need this Christmas",
      content: [
        "Medway Soup Kitchen CIC in partnership with Evolution Impact Initiative CIC is running a Christmas Turkey Giveaway for families who are experiencing financial hardship this holiday season.",
        "On Monday 23rd December 2025, we will distribute fifty turkeys to households across Medway so families can enjoy a festive meal at home without stress or financial pressure.",
        "Christmas can be overwhelming for those struggling with the cost of living. A turkey may seem small, but it can make a big difference.",
      ],
    },
    eventDetails: {
      venue: "Medway (Collection point to be confirmed)",
      date: "Monday, 23rd December 2025",
    },
    sections: [
      {
        title: "Who This Is For",
        content: [
          "This support is for individuals and families in Medway who may find it difficult to afford Christmas food this year.",
          "Priority will be given to households with children. There is no requirement to explain your circumstances. If you feel you need support, you are welcome to register.",
        ],
      },
      {
        title: "What You Will Receive",
        content: [],
        list: [
          { text: "One turkey per household" },
          { text: "Collection from Medway" },
          { text: "Delivery available for those unable to collect" },
          {
            text: "Details of collection point will be confirmed shortly and communicated by email or text",
          },
        ],
      },
      {
        title: "How You Can Help",
        content: [
          "We are inviting individuals, families and businesses to sponsor a turkey for a local household this Christmas.",
        ],
        list: [
          { text: "A donation of £15 supports one family" },
          {
            text: "Every contribution directly funds a turkey for someone in need",
          },
          {
            text: "If each of us can find five people to donate a turkey, we can reach our goal quickly and easily",
          },
        ],
      },
      {
        title: "Why This Matters",
        content: [
          "A Christmas meal is more than food. It is dignity, family and celebration.",
          "Together we can relieve stress, reduce food insecurity and create moments of joy for families who are struggling.",
        ],
      },
    ],
    sidebar: {
      title: "Register for Support",
      description:
        "If you would like to receive support, please fill out the registration form below. Spaces are limited so early registration is advised.",
      eventDetails: [
        {
          icon: "/assets/calendar-icon-white.svg",
          label: "Event",
          value: "Christmas Turkey Giveaway",
        },
        {
          icon: "/assets/date-icon-white.svg",
          label: "Date",
          value: "Monday, 23rd December 2025",
        },
        {
          icon: "/assets/location-icon-white.svg",
          label: "Location",
          value: "Medway (Details to be confirmed)",
        },
        {
          icon: "/assets/phone-icon-white.svg",
          label: "Priority",
          value: "Households with children",
        },
        {
          icon: "/assets/time-icon-white.svg",
          label: "Support",
          value: "One turkey per household",
        },
      ],
      buttons: [
        { text: "Register ", type: "primary", action: "volunteer" },
        { text: "Donate Now", type: "secondary", action: "donate_page" },
      ],
      footerMessage: "Small Acts • Big Impact",
    },
    modalType: "turkeyGiveaway",
  },
  "jewellery-making": {
    slug: "jewellery-making",
    title: "Kids' Jewellery Making Workshop",
    subtitle: "Hosted by Evolution Impact Initiative CIC",
    bannerImage: "/assets/jewellery-making-banner.jpg",
    isPastEvent: true,
    about: {
      title: "A Creative & Confidence-Building Experience for Children",
      content: [
        "Looking for a fun, hands-on activity that helps children explore creativity and self-expression? Join us for our Kids' Jewellery Making Workshop — a free, community event where young creators will design and make their own bracelets, necklaces, and keychains to take home! 💎",
        "This event promotes creativity, focus, and fine motor skills — while encouraging teamwork and confidence. Children will have the freedom to create their own designs, learn basic crafting techniques, and proudly showcase their work at the end of the session.",
      ],
    },
    eventDetails: {
      venue:
        "Gillingham Children & Family Hub, Woodlands Road, Gillingham, Kent, ME7 2BX",
      date: "Saturday, 25th October 2025",
      // time: "1:00 PM – 3:00 PM",
    },
    sections: [
      {
        title: "Event Highlights",
        content: [],
        list: [
          { text: "Free entry – supported by Evolution Impact Initiative CIC" },
          {
            text: "All materials provided – children take home what they make",
          },
          { text: "Boosts creativity, confidence, and social skills" },
          { text: "Safe, supervised and inclusive environment" },
          { text: "Great weekend activity for local families" },
          { text: "Light refreshments available" },
        ],
      },
      {
        title: "Why It Matters",
        content: [
          "Our workshops are designed to inspire creativity while supporting children's wellbeing and emotional growth.",
          "Jewellery making encourages focus, patience, and self-expression — key skills that improve confidence and mental wellbeing in a fun, engaging way.",
        ],
      },
      {
        title: "What Your Child Will Create",
        content: [],
        list: [
          { text: "Custom bracelets with colorful beads and charms" },
          { text: "Personalized necklaces they can design themselves" },
          { text: "Fun keychains to keep or gift to friends and family" },
          { text: "All items are theirs to take home and treasure!" },
        ],
      },
    ],
    sidebar: {
      title: "Register Your Child",
      description:
        "Spaces are limited to ensure every child gets individual attention and a great experience. Register now to secure your child's place!",
      eventDetails: [
        {
          icon: "/assets/calendar-icon-white.svg",
          label: "Event",
          value: "Kids' Jewellery Making Workshop",
        },
        {
          icon: "/assets/date-icon-white.svg",
          label: "Date",
          value: "Saturday, 25th October 2025",
        },
        // {
        //   icon: "/assets/clock-icon-white.svg",
        //   label: "Time",
        //   value: "1:00 PM – 3:00 PM",
        // },
        {
          icon: "/assets/location-icon-white.svg",
          label: "Venue",
          value: "Gillingham Children & Family Hub",
        },
        {
          icon: "/assets/phone-icon-white.svg",
          label: "Age Group",
          value: "Children aged 5–12 years",
        },
        {
          icon: "/assets/time-icon-white.svg",
          label: "Cost",
          value: "FREE (Community-supported event)",
        },
      ],
      buttons: [{ text: "Sold Out", type: "disabled", action: "soldout" }],
      footerMessage: "Creativity • Confidence • Community",
    },
    modalType: "jewellery",
  },
  "warmth-for-all": {
    slug: "warmth-for-all",
    title: "Warmth for All – Community Outreach Event",
    subtitle: "Warmth for All – Community Outreach Event",
    bannerImage: "/assets/warmth-for-all-banner.jpg",
    isPastEvent: true,
    about: {
      title: "About the Event",
      content: [
        "This winter, too many people in our community will be sleeping rough without the basic essentials to stay warm. Warmth for All is our response – a community-led project dedicated to providing coats, trainers, and sleeping bags directly to those who need them most.",
        "On Saturday 22nd November, our volunteers will be going out into Medway to meet homeless individuals where they are – on the streets, in parks, and in other public spaces – to offer practical support and a sense of dignity.",
        "Together, we can bring warmth, comfort, and hope to our neighbours in need.",
      ],
    },
    eventDetails: {
      venue: "ECA - 86 King Street, Rochester, Kent, ME1 1YD",
      date: "Saturday 22nd November 2025",
    },
    sections: [
      {
        title: "How You Can Help",
        content: ["There are 3 main ways to get involved:"],
        list: [
          {
            number: "1.",
            text: "Volunteer on the day – join our outreach team to hand out items, offer support, and spread kindness.",
          },
          {
            number: "2.",
            text: "Donate items – coats, trainers, and sleeping bags in good condition are especially needed.",
          },
          {
            number: "3.",
            text: "Give financially – every contribution helps us purchase additional supplies and reach more people.",
          },
        ],
      },
      {
        title: "Volunteer Information",
        content: [],
        list: [
          {
            text: "All volunteers will meet at Evolution Combat Academy at 11AM for a short briefing before heading out.",
          },
          {
            text: "Roles include distributing items, carrying supplies, talking to those we meet, and supporting with safe transport.",
          },
          {
            text: "Please wear comfortable shoes and warm clothing.",
          },
        ],
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
          "Please note: All donated items must be new or fairly used, clean, and if possible, washed and ironed.",
        ],
      },
      {
        title: "Why It Matters",
        content: [
          "Homelessness is not just about lacking shelter – it's about dignity, safety, and survival. Something as simple as a warm coat or sleeping bag can make the difference between hardship and hope. By coming together as a community, we can ensure no one is forgotten this winter.",
        ],
      },
    ],
    sidebar: {
      title: "Spread the Word",
      description:
        "Help us reach more people by sharing this event with friends, family and colleagues. The more awareness we raise, the bigger impact we can make.",
      eventDetails: [
        {
          icon: "/assets/calendar-icon-white.svg",
          label: "Event",
          value: "Warmth for All – Community Outreach",
        },
        {
          icon: "/assets/date-icon-white.svg",
          label: "Date",
          value: "Saturday 22nd November 2025",
        },

        {
          icon: "/assets/location-icon-white.svg",
          label: "Meeting Point",
          value: "Evolution Combat Academy, Rochester, Kent",
        },
        {
          icon: "/assets/time-icon-white.svg",
          label: "Drop-off Times",
          value: "Tues 16:00–19:00 | Fri 16:00–19:00 | Sat 12:00–17:00",
        },
        {
          icon: "/assets/phone-icon-white.svg",
          label: "Contact",
          value: "07874 059644",
        },
      ],
      buttons: [
        { text: "Donate", type: "primary", action: "donate" },
        { text: "Share Now", type: "secondary", action: "share" },
      ],
      footerMessage: "Join us. Donate. Volunteer. Make a difference",
    },
    modalType: "warmth",
  },
  "the-big-bake-off": {
    slug: "the-big-bake-off",
    title: "The Big Bake Off – Christmas Edition",
    subtitle: "Hosted by Evolution Impact Initiative CIC",
    bannerImage: "/assets/bake-off-web.jpg",
    about: {
      title: "A Festive Baking Challenge for Young Creators!",
      content: [
        "Get ready for a festive afternoon full of fun, flour, and friendly competition!",
        "Join us for The Big Bake Off – Christmas Edition — a joyful, team-based baking challenge where kids will compete to create, decorate, and present their best Christmas cupcakes! 🧁✨",
        "Working in teams, each child will take on a role, collaborate with others, and showcase their creativity through baking. The event ends with a judging round where cupcakes are scored for taste, design, texture, and teamwork — and the winning team walks away with a special prize!",
      ],
    },
    eventDetails: {
      venue: "Gillingham Family Hub, ME7 2BX",
      date: "Saturday 13th December 2025",
      // time: "1:00 PM – 3:00 PM",
    },
    sections: [
      {
        title: "Event Highlights",
        content: [],
        list: [
          {
            text: "Free to attend – supported by Evolution Impact Initiative CIC",
          },
          { text: "All ingredients and materials provided" },
          { text: "Children work in teams of 4 with a team leader" },
          { text: "Judging based on creativity, teamwork, taste, and design" },
          { text: "Prizes for the winning team – baking kits to take home!" },
          { text: "Safe, inclusive, and supervised environment" },
        ],
      },
      {
        title: "What the Kids Will Do",
        content: [],
        list: [
          { text: "Bake festive cupcakes in small teams" },
          {
            text: "Decorate and present their baked goods to a panel of judges",
          },
          { text: "Learn basic baking and presentation skills" },
          { text: "Gain confidence through teamwork and creativity" },
        ],
      },
      {
        title: "Why It Matters",
        content: ["This festive event is more than just baking — it's about:"],
        list: [
          { text: "Building teamwork and communication skills" },
          { text: "Encouraging creativity and confidence" },
          {
            text: "Bringing children and families together for a joyful experience",
          },
          { text: "Spreading holiday cheer in a meaningful, hands-on way" },
        ],
      },
    ],
    sidebar: {
      title: " Register Your Child",
      description:
        "Spots are limited to ensure a fun and engaging experience for every child. Register now and let your child shine in the kitchen!",
      eventDetails: [
        {
          icon: "/assets/calendar-icon-white.svg",
          label: "Event",
          value: "The Big Bake Off – Christmas Edition",
        },
        {
          icon: "/assets/date-icon-white.svg",
          label: "Date",
          value: "Saturday 13th December 2025",
        },
        {
          icon: "/assets/clock-icon-white.svg",
          label: "Time",
          value: "1:00 PM – 3:00 PM",
        },
        {
          icon: "/assets/location-icon-white.svg",
          label: "Venue",
          value: "Gillingham Family Hub",
        },
        {
          icon: "/assets/phone-icon-white.svg",
          label: "Age Group",
          value: "Children aged 5–12",
        },
        {
          icon: "/assets/time-icon-white.svg",
          label: "Cost",
          value: "FREE (Community-supported event)",
        },
      ],
      buttons: [{ text: "Sold Out", type: "disabled", action: "soldout" }],

      footerMessage: "Creativity • Teamwork • Holiday Fun",
    },
    modalType: "bakeOff",
  },

  "child-safety": {
    slug: "child-safety",
    title: "FREE Child Safety Programme",
    subtitle:
      "Keeping Your Children Safe – In Partnership with ECA, NEXGEN PROTECTION & Evolution Impact Initiative CIC",
    bannerImage: "/assets/safety-banner.jpg",
    isPastEvent: true,

    about: {
      title: "About the Programme",
      content: [
        "Following the successful Safety Talks delivered at Evolution Combat Academy, NEXGEN PROTECTION is launching the Child Safety Programme — a vital one-day training designed to teach children essential safety skills in a fun and supportive environment.",
        "This session empowers children with both verbal and physical self-protection skills, giving them the confidence to deal with real-life situations such as travelling to and from school and responding to unwanted stranger interactions.",
      ],
    },
    eventDetails: {
      venue: "Evolution Combat Academy, Rochester, Kent, ME1 1YD",
      date: "28th September 2025",
      time: "11:00am – 3:00pm",
    },
    sections: [
      {
        title: "Programme Benefits",
        content: [],
        list: [
          { text: "FREE for this launch event (normally £25–£50 per child)" },
          {
            text: "Covers personal safety, travel safety & stranger awareness",
          },
          { text: "Practical tools to build confidence and awareness" },
          {
            text: "Parents welcome to attend (maximum two children per adult)",
          },
          { text: "Designed for children aged 5–11 years old" },
        ],
      },
      {
        title: "What to Bring",
        content: [],
        list: [
          { text: "Comfortable clothes (no skirts/dresses)" },
          { text: "Light snacks & drinks for short breaks" },
        ],
      },
      {
        title: "Delivered in Partnership",
        content: [
          "This event is proudly brought to you by:",
          "Evolution Combat Academy × NEXGEN PROTECTION × Evolution Impact Initiative CIC",
        ],
      },
    ],
    sidebar: {
      title: "Register Now",
      description:
        "LIMITED SPACES – Book Now! ECA students will receive priority booking before spaces open to the public.",
      eventDetails: [
        {
          icon: "/assets/calendar-icon-white.svg",
          label: "Programme",
          value: "FREE Child Safety Programme",
        },
        {
          icon: "/assets/date-icon-white.svg",
          label: "Date",
          value: "28th September 2025",
        },
        {
          icon: "/assets/clock-icon-white.svg",
          label: "Time",
          value: "11:00am – 3:00pm",
        },
        {
          icon: "/assets/location-icon-white.svg",
          label: "Venue",
          value: "Evolution Combat Academy, Rochester, Kent",
        },
        {
          icon: "/assets/phone-icon-white.svg",
          label: "Age Group",
          value: "Children aged 5–11 years",
        },
        {
          icon: "/assets/time-icon-white.svg",
          label: "Cost",
          value: "FREE (Launch Event)",
        },
      ],
      buttons: [
        { text: "Register", type: "primary", action: "volunteer" },
        { text: "Share Event", type: "secondary", action: "share" },
      ],
      footerMessage: "Keeping Your Children Safe & Confident",
    },
    modalType: "safety",
  },
  "sip-and-paint": {
    slug: "sip-and-paint",
    title: "Sip & Paint for Kids!",
    subtitle: "Hosted by Evolution Impact Initiative CIC",
    bannerImage: "/assets/sipandpaint.jpg",
    isPastEvent: true,

    about: {
      title: "A Creative Weekend Experience for Children",
      content: [
        "Looking for a fun and inspiring activity for your little ones? Join us for our Sip & Paint Kids Event — a safe, welcoming space where children can explore their creativity, enjoy a refreshing drink, and take home their very own masterpiece!",
        "This event is all about fun, confidence, and self-expression, giving kids the chance to try something new while parents relax knowing they're in a supportive environment.",
      ],
    },
    eventDetails: {
      venue:
        "Gillingham Children & Family Hub, Woodlands Road, Gillingham, Kent, ME7 2BX",
      date: "Saturday, 27th September",
      time: "1:00 PM – 3:00 PM",
    },
    sections: [
      {
        title: "Event Benefits",
        content: [],
        list: [
          { text: "Free entry (community-supported initiative)" },
          { text: "Children keep the artwork they create" },
          { text: "Fun, social and confidence-building activity" },
          { text: "All materials provided" },
        ],
      },
    ],
    sidebar: {
      title: "Register Your Child",
      description:
        "Spaces are limited and expected to fill quickly. Register early to secure your child's place in this creative experience.",
      eventDetails: [
        {
          icon: "/assets/calendar-icon-white.svg",
          label: "Event",
          value: "Sip & Paint for Kids",
        },
        {
          icon: "/assets/date-icon-white.svg",
          label: "Date",
          value: "Saturday, 27th September",
        },
        {
          icon: "/assets/clock-icon-white.svg",
          label: "Time",
          value: "1:00 PM – 3:00 PM",
        },
        {
          icon: "/assets/location-icon-white.svg",
          label: "Venue",
          value: "Gillingham Children & Family Hub",
        },
        { icon: "/assets/phone-icon-white.svg", label: "Cost", value: "FREE" },
        {
          icon: "/assets/time-icon-white.svg",
          label: "Materials",
          value: "All Provided",
        },
      ],
      buttons: [{ text: "Sold Out", type: "disabled", action: "soldout" }],
      footerMessage: "Creativity • Fun • Community",
    },
    modalType: "sipPaint",
  },
  "back-to-school": {
    slug: "back-to-school",
    title: "Back to School Giveaway",
    subtitle: "August 2025",
    bannerImage: "/assets/back-to-school-web.jpg",
    isPastEvent: true,
    about: {
      title: "About the Event",
      content: [
        "Get ready for a fresh start to the school year! Evolution Impact Initiatives presented the Back-To-School Giveaway (August 2025) – a special community event providing free school uniforms and supplies to children in Medway. Our mission was to ensure every child had the essentials they needed to step into the new academic year with confidence.",
        "This family-friendly event was open to children aged 5–11 years and featured backpacks filled with school essentials, uniforms, and more—all at no cost. Parents and guardians were warmly invited to join and pick up supplies for their kids.",
      ],
    },
    eventDetails: {
      venue:
        "Evolution Combat Academy (ECA), 84 King Street, Rochester, ME1 1YS",
      date: "Saturday, 30th August 2025",
      time: "11:00 AM – 2:00 PM",
    },
    sections: [
      {
        title: "Event Highlights",
        content: [
          "This successful community event provided essential school supplies to families in Medway, helping children start their academic year with confidence and all the tools they needed for success.",
        ],
        list: [
          { text: "Free school uniforms for children aged 5-11" },
          { text: "Backpacks filled with school essentials" },
          { text: "Community support and family-friendly atmosphere" },
          { text: "No cost to families - completely free event" },
        ],
      },
      {
        title: "Impact",
        content: [
          "The event successfully supported numerous families in the Medway area, ensuring children had the resources they needed for a strong start to the school year. Together, we built a supportive community for Medway's future.",
        ],
      },
    ],
    sidebar: {
      title: "Past Event",
      description:
        "This event has already taken place. Thank you to everyone who participated and made this community initiative a success!",
      eventDetails: [
        {
          icon: "/assets/calendar-icon-white.svg",
          label: "Event",
          value: "Back to School Giveaway",
        },
        {
          icon: "/assets/date-icon-white.svg",
          label: "Date",
          value: "Saturday, 30th August 2025",
        },
        {
          icon: "/assets/clock-icon-white.svg",
          label: "Time",
          value: "11:00 AM – 2:00 PM",
        },
        {
          icon: "/assets/location-icon-white.svg",
          label: "Venue",
          value: "Evolution Combat Academy, Rochester",
        },
        {
          icon: "/assets/phone-icon-white.svg",
          label: "Age Group",
          value: "Children aged 5-11 years",
        },
        { icon: "/assets/time-icon-white.svg", label: "Cost", value: "FREE" },
      ],
      buttons: [],
    },
    modalType: "none",
  },
  "summer-warriors": {
    slug: "summer-warriors",
    title: "Evolution Kids: Summer Warriors Day",
    subtitle:
      "FREE KIDS EVENT – Ages 5–11 | 2 Hours of Fun | Confidence & Energy",
    bannerImage: "/assets/summer-warriors-banner.jpg",
    isPastEvent: true,
    about: {
      title: "About the Event",
      content: [
        "Give your child a taste of martial arts and fitness in a safe, supportive space! This wasn't just about sport — it was about confidence, discipline, focus, and fun. Children left feeling proud, empowered, and full of positive energy.",
        "This high-energy event provided children aged 5–11 with an introduction to martial arts in a fun, inclusive environment delivered by qualified coaches.",
      ],
    },
    eventDetails: {
      venue: "Evolution Combat Academy, Rochester, Kent",
      date: "Saturday, 19th July 2025",
      time: "11:00 AM – 1:00 PM",
    },
    sections: [
      {
        title: "Event Activities",
        content: [
          "This successful event included a variety of martial arts and fitness activities designed to build confidence and have fun:",
        ],
        list: [
          { text: "Boxing Basics" },
          { text: "Kickboxing & K1 Fun" },
          { text: "Brazilian Jiu-Jitsu Play Zone" },
          { text: "Obstacle Course & Relay Challenges" },
          { text: "Medals & Certificates for All Kids!" },
        ],
      },
      {
        title: "Special Awards",
        content: [
          "Every child received recognition, with special awards given for:",
        ],
        list: [
          { text: "Bravest Warrior" },
          { text: "Best Energy" },
          { text: "Most Respectful" },
        ],
      },
      {
        title: "Event Highlights",
        content: ["This event successfully provided children with:"],
        list: [
          { text: "Qualified coaches delivering safe, supportive instruction" },
          { text: "Inclusive environment welcoming all children" },
          { text: "High-energy fun activities for every participant" },
          { text: "Confidence-building through martial arts and fitness" },
          {
            text: "Completely free access to quality martial arts instruction",
          },
        ],
      },
      {
        title: "Delivered in Partnership",
        content: [
          "This event was proudly brought to you by:",
          "Evolution Impact Initiative CIC × Evolution Combat Academy (ECA)",
        ],
      },
    ],
    sidebar: {
      title: "Past Event",
      description:
        "This event has already taken place. Thank you to all the families who participated and made this martial arts experience a huge success!",
      eventDetails: [
        {
          icon: "/assets/calendar-icon-white.svg",
          label: "Event",
          value: "Evolution Kids: Summer Warriors Day",
        },
        {
          icon: "/assets/date-icon-white.svg",
          label: "Date",
          value: "Saturday, 19th July 2025",
        },
        {
          icon: "/assets/clock-icon-white.svg",
          label: "Time",
          value: "11:00 AM – 1:00 PM",
        },
        {
          icon: "/assets/location-icon-white.svg",
          label: "Venue",
          value: "Evolution Combat Academy, Rochester, Kent",
        },
        {
          icon: "/assets/phone-icon-white.svg",
          label: "Age Group",
          value: "Children aged 5–11 years",
        },
        { icon: "/assets/time-icon-white.svg", label: "Cost", value: "FREE" },
      ],
      buttons: [],
    },
    modalType: "none",
  },
};

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ params }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const resolvedParams = React.use(params);

  const project = projectsData[resolvedParams.slug];

  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

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
      case "jewellery":
        return (
          <JewelleryMakingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        );
      case "bakeOff":
        return (
          <BakeOffModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        );
      case "turkeyGiveaway":
        return (
          <TurkeyGiveawayModal
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
        setIsDonationModalOpen(true);
        break;
      case "donate_page":
        router.push("/donate");
        break;
      case "share":
        setIsShareModalOpen(true);
        break;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Banner - Full Width */}
        <div className="w-full relative 2xl:pt-[88px] pt-[60px] px-4 max-w-[1280px] mx-auto sm:px-6 lg:px-8">
          <div className="absolute top-2 left-6 cursor-pointer z-20">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 font-medium px-4 py-2 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rotate-0"
              >
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
              Back
            </button>
          </div>

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
                {project.eventDetails.time && (
                  <div className="flex items-start gap-3">
                    <p className="2xl:text-2xl text-[#0F0005] font-semibold">
                      ⏰ Time: {project.eventDetails.time}
                    </p>
                  </div>
                )}
              </div>

              {/* Dynamic Sections */}
              {project.sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-xl 2xl:text-2xl font-bold text-black mb-3">
                    {section.title}
                  </h2>

                  {section.content.map((content, contentIndex) => (
                    <p
                      key={contentIndex}
                      className="text-[#0F0005] mb-4 2xl:text-xl"
                    >
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
              <div
                className={`rounded-2xl p-8 text-white sticky top-20 ${
                  project.isPastEvent || project?.disabled
                    ? "bg-gray-400 cursor-not-allowed opacity-75"
                    : "bg-[#17569D]"
                }`}
              >
                {/* Header */}
                <div className="mb-5">
                  <h3 className="text-2xl font-bold mb-4">
                    {project.sidebar.title}
                  </h3>
                  <p
                    className={`leading-relaxed ${
                      project.isPastEvent || project?.disabled
                        ? "text-gray-100"
                        : "text-blue-100"
                    }`}
                  >
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
                      <span>
                        {detail.label}: {detail.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons - Only show for upcoming events */}
                {!project.isPastEvent &&
                  // !project?.disabled &&
                  project.sidebar.buttons.length > 0 && (
                    <div className="gap-3 flex md:flex-row flex-col">
                      {project.sidebar.buttons.map((button, index) => (
                        <button
                          key={index}
                          onClick={() => handleButtonClick(button.action)}
                          className={`w-full cursor-pointer font-semibold py-[10px] px-6 rounded-full transition-colors duration-200 ${
                            button.type === "primary"
                              ? "bg-white text-[#17569D] hover:bg-gray-50"
                              : "border-2 border-white text-white "
                          } ${
                            button.action === "share"
                              ? "flex items-center justify-center gap-2 hover:bg-white hover:text-[#17569D]"
                              : ""
                          }
                           ${
                             button.type === "disabled"
                               ? "flex items-center justify-center gap-2 hover:bg-none"
                               : ""
                           }`}
                        >
                          {button.text}
                          {button.action === "share" && (
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                {/* Footer Message */}
                <div className="mt-8 text-center font-medium text-sm text-white">
                  <p>{project.sidebar.footerMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {renderModal()}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        projectTitle={project.title}
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
                campaignId="christmas-turkey-giveaway"
                campaignTitle="Christmas Turkey Giveaway"
                onSuccess={() => {
                  // Optional: Add any callback logic here
                  console.log("Donation successful");
                }}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProjectPage;
