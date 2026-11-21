export interface InstallationProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  details?: string[];
  images: string[];
}

export const INSTALLATION_PROJECTS: InstallationProject[] = [
  {
    id: "featured-installations",
    title: "IanArt Artwork Installations",
    subtitle: "Bridging Beauty and Space",
    category: "Featured Installations",
    description: "IanArt Albertyn's captivating artwork is not confined to galleries; it finds its rightful place within the heart of diverse spaces, both intimate and grand. Our installations in hotels and houses redefine the way art interacts with its environment, creating a symphony where aesthetics and atmosphere harmonize.",
    details: [
      "Hotels: In hotels, IanArt's artwork transforms lobbies, corridors, and lounges into immersive galleries. Each piece has been thoughtfully chosen and placed to reflect the ethos of the establishment, enriching the guest experience with an unexpected journey through color and form.",
      "Houses: In the comfort of homes, IanArt's installations become personal sanctuaries of inspiration. These masterpieces become an integral part of the living space, seamlessly blending with interior design while adding depth and character."
    ],
    images: [
      "/images/installations/general-installations-1.jpeg",
      "/images/installations/general-installations-2.jpeg",
      "/images/installations/general-installations-3.jpeg",
      "/images/installations/general-installations-4.jpeg",
      "/images/installations/general-installations-5.jpeg",
      "/images/installations/general-installations-6.jpeg",
      "/images/installations/general-installations-7.jpeg",
      "/images/installations/general-installations-8.jpeg",
      "/images/installations/general-installations-9.jpeg",
      "/images/installations/general-installations-10.jpeg",
      "/images/installations/general-installations-11.jpeg",
      "/images/installations/general-installations-12.jpeg",
      "/images/installations/general-installations-13.jpeg",
      "/images/installations/general-installations-14.jpeg",
      "/images/installations/general-installations-15.jpeg",
      "/images/installations/general-installations-16.jpeg",
      "/images/installations/general-installations-17.jpeg",
      "/images/installations/general-installations-18.jpeg",
      "/images/installations/general-installations-19.jpeg"
    ]
  },
  {
    id: "freedom-36",
    title: "FREEDOM 36",
    subtitle: "Blackbrick Club Hotel",
    category: "Hotel Installation",
    description: "The build up and installation of FREEDOM 36 at the Blackbrick Club Hotel. A monumental spatial installation expressing themes of liberation, scale, and contemporary architecture.",
    details: [
      "Location: Blackbrick Club Hotel",
      "Scope: Multi-tier atrium & spatial installation",
      "Process: Full build-up, structural mounting, and live ambient positioning"
    ],
    images: [
      "/images/installations/world-map-freedom36.png",
      "/images/installations/freedom-36-3.jpeg",
      "/images/installations/freedom-36-4.jpeg",
      "/images/installations/freedom-36-5.jpeg",
      "/images/installations/freedom-36-6.jpeg",
      "/images/installations/freedom-36-7.jpeg",
      "/images/installations/freedom-36-8.jpeg",
      "/images/installations/freedom-36-9.jpeg",
      "/images/installations/freedom-36-10.jpeg",
      "/images/installations/freedom-36-11.jpeg",
      "/images/installations/freedom-36-12.jpeg",
      "/images/installations/freedom-36-13.jpeg",
      "/images/installations/freedom-36-14.jpeg",
      "/images/installations/freedom-36-15.jpeg",
      "/images/installations/freedom-36-16.jpeg"
    ]
  },
  {
    id: "marc-lottering",
    title: "Marc Lottering Commission",
    subtitle: "Celebrity Portrait & Installation",
    category: "Commission Work",
    description: "Exclusive commissioned work of legendary South African comedian and theatrical performer Marc Lottering. A rich visual expression reflecting personality, stage persona, and cultural impact.",
    details: [
      "Subject: Marc Lottering",
      "Type: Custom Private Commission & Installation",
      "Medium: Mixed-media portraiture"
    ],
    images: [
      "/images/installations/marc-lottering-1.jpeg",
      "/images/installations/marc-lottering-2.jpeg",
      "/images/installations/marc-lottering-3.jpeg",
      "/images/installations/marc-lottering-4.jpeg",
      "/images/installations/marc-lottering-5.jpeg",
      "/images/installations/marc-lottering-6.jpeg",
      "/images/installations/marc-lottering-7.jpeg",
      "/images/installations/marc-lottering-8.jpeg",
      "/images/installations/marc-lottering-9.jpeg",
      "/images/installations/marc-lottering-10.jpeg"
    ]
  },
  {
    id: "blackbrick-imagination",
    title: "Blackbrick IMAGINATION",
    subtitle: "Blackbrick Club Hotel",
    category: "Hotel Installation",
    description: "Curated collection and spatial art integration across the corridors, suites, and common areas of Blackbrick Club Hotel under the 'IMAGINATION' theme.",
    details: [
      "Venue: Blackbrick Club Hotel",
      "Theme: IMAGINATION",
      "Impact: Immersive guest journey"
    ],
    images: [
      "/images/installations/blackbrick-imagination-1.jpeg",
      "/images/installations/blackbrick-imagination-2.jpeg",
      "/images/installations/blackbrick-imagination-3.jpeg",
      "/images/installations/blackbrick-imagination-4.jpeg",
      "/images/installations/blackbrick-imagination-5.jpeg",
      "/images/installations/blackbrick-imagination-6.jpeg",
      "/images/installations/blackbrick-imagination-7.jpeg",
      "/images/installations/blackbrick-imagination-8.jpeg",
      "/images/installations/blackbrick-imagination-9.jpeg",
      "/images/installations/blackbrick-imagination-10.jpeg"
    ]
  },
  {
    id: "red-cross",
    title: "Red Cross Children's Hospital",
    subtitle: "Charity Projects",
    category: "Philanthropy",
    description: "Charity projects and philanthropic art installations dedicated to the Red Cross War Memorial Children's Hospital. Bringing color, comfort, and positive energy to young patients and medical staff.",
    details: [
      "Recipient: Red Cross War Memorial Children's Hospital",
      "Purpose: Community impact & healing through visual art"
    ],
    images: [
      "/images/installations/red-cross-1.jpeg",
      "/images/installations/red-cross-2.jpeg",
      "/images/installations/red-cross-3.jpeg",
      "/images/installations/red-cross-4.jpeg"
    ]
  },
  {
    id: "robert-sobukwe",
    title: "Robert Sobukwe & Sol Kerzner",
    subtitle: "Lockdown Tributes",
    category: "Historical Tributes",
    description: "Commissioned tribute portraits created during lockdown honoring historical icons, including anti-apartheid leader Robert Mangaliso Sobukwe and hotel magnate Sol Kerzner.",
    details: [
      "Subjects: Robert Mangaliso Sobukwe & Sol Kerzner",
      "Era: Created during lockdown period",
      "Theme: South African leadership & legacy"
    ],
    images: [
      "/images/installations/robert-sobukwe-1.jpeg",
      "/images/installations/robert-sobukwe-2.jpeg",
      "/images/installations/robert-sobukwe-3.jpeg",
      "/images/installations/robert-sobukwe-4.jpeg",
      "/images/installations/robert-sobukwe-5.jpeg",
      "/images/installations/robert-sobukwe-6.jpeg",
      "/images/installations/robert-sobukwe-7.jpeg",
      "/images/installations/robert-sobukwe-8.jpeg"
    ]
  }
];
