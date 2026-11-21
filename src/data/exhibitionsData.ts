export interface Exhibition {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  venue: string;
  category: string;
  description: string;
  images: string[];
}

export const EXHIBITIONS_DATA: Exhibition[] = [
  {
    id: "exhibition-1-2019",
    title: "1st Exhibition",
    subtitle: "Youngblood Arts & Culture",
    year: "2019",
    venue: "Youngblood Gallery, Cape Town",
    category: "Solo Showcase",
    description: "IanArt's landmark debut solo showcase at Cape Town's premier Youngblood Arts & Culture Gallery. Introducing bold graphic portraiture, vivid acrylic pigments, and raw expressive brushwork, this inaugural collection established Ian's signature exploration of modern African identity, emotional depth, and figurative narrative.",
    images: [
      "/images/exhibitions/exhibition-1-2019-1.jpeg",
      "/images/exhibitions/exhibition-1-2019-2.jpeg",
      "/images/exhibitions/exhibition-1-2019-3.jpeg"
    ]
  },
  {
    id: "exhibition-2",
    title: "2nd Exhibition",
    subtitle: "Youngblood Arts & Culture",
    year: "2020",
    venue: "Youngblood Gallery, Cape Town",
    category: "Solo Showcase",
    description: "The compelling follow-up showcase deepening the exploration of visceral emotion, high-contrast chiaroscuro, and monumental canvas compositions. Featuring evocative portrayals of resilience and cultural dialogue, this collection marked a significant leap into complex layering and dynamic shadow interplay.",
    images: [
      "/images/exhibitions/exhibition-2-1.jpeg",
      "/images/exhibitions/exhibition-2-2.jpeg",
      "/images/exhibitions/exhibition-2-3.jpeg"
    ]
  },
  {
    id: "exhibition-3",
    title: "3rd Exhibition",
    subtitle: "Youngblood Arts & Culture",
    year: "2021",
    venue: "Youngblood Gallery, Cape Town",
    category: "Curated Collection",
    description: "An expansive curated exhibition highlighting mixed media textures, structural typography, and vibrant figurative portraiture. Blending architectural sensibilities with raw fine art technique, this body of work captured critical acclaim for its inventive use of spatial geometry and evocative character studies.",
    images: [
      "/images/exhibitions/exhibition-3-1.jpeg",
      "/images/exhibitions/exhibition-3-2.jpeg",
      "/images/exhibitions/exhibition-3-3.jpeg",
      "/images/exhibitions/exhibition-3-4.jpeg",
      "/images/exhibitions/exhibition-3-5.jpeg",
      "/images/exhibitions/exhibition-3-6.jpeg"
    ]
  },
  {
    id: "the-new-african",
    title: "The New African",
    subtitle: "Cultural Retrospective",
    year: "2022",
    venue: "Youngblood Gallery, Cape Town",
    category: "Feature Exhibition",
    description: "A seminal milestone in IanArt's catalog celebrating modern African resilience, heritage, and futuristic expression through vivid portraiture and symbolic iconography. Each monumental piece translates ancestral pride into a visual language of modern luxury, commanding artistic authority and international recognition.",
    images: [
      "/images/exhibitions/the-new-african-1.jpeg",
      "/images/exhibitions/the-new-african-2.jpeg",
      "/images/exhibitions/the-new-african-3.jpeg",
      "/images/exhibitions/the-new-african-4.jpeg",
      "/images/exhibitions/the-new-african-5.jpeg"
    ]
  },
  {
    id: "exhibition-4",
    title: "4th Exhibition",
    subtitle: "Youngblood Arts & Culture",
    year: "2023",
    venue: "Youngblood Gallery, Cape Town",
    category: "Solo Showcase",
    description: "A comprehensive showcase presenting IanArt's evolving stylistic mastery, dimensional light elements, and energetic color palette. This collection seamlessly bridges traditional African aesthetic sensibilities with contemporary urban sophistication and innovative material treatments.",
    images: [
      "/images/exhibitions/exhibition-4-1.jpeg",
      "/images/exhibitions/exhibition-4-2.jpeg",
      "/images/exhibitions/exhibition-4-3.jpeg",
      "/images/exhibitions/exhibition-4-4.jpeg",
      "/images/exhibitions/exhibition-4-5.jpeg",
      "/images/exhibitions/exhibition-4-6.jpeg"
    ]
  },
  {
    id: "exhibitions-showcase",
    title: "Gallery Highlights",
    subtitle: "Selected Exhibition Works",
    year: "2023 - 2024",
    venue: "Main Gallery",
    category: "Retrospective",
    description: "Selected showcase pieces and install views from major gallery shows, private viewings, and premier cultural installations across Cape Town. This retrospective archive highlights masterworks that define IanArt's enduring creative journey across fine art and architectural craft.",
    images: [
      "/images/exhibitions/exhibitions-showcase-1.jpeg",
      "/images/exhibitions/exhibitions-showcase-2.jpeg",
      "/images/exhibitions/exhibitions-showcase-3.jpeg",
      "/images/exhibitions/exhibitions-showcase-4.jpeg"
    ]
  }
];
