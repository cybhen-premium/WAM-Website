export interface MinistryData {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  gallery: string[];
  iconName: string; // To match lucide icons if needed
}

export const ministriesData: MinistryData[] = [
  {
    slug: "men-ministry",
    title: "Men Ministry",
    shortDescription: "Building strong men of faith, leadership, and integrity.",
    longDescription: "Our Men's Ministry is dedicated to empowering men to become the spiritual leaders God called them to be. Through fellowship, accountability, and the study of the Word, we build character and strength to lead families and communities with integrity and purpose.",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477208/world-ark-missions/11.jpg",
    gallery: ["https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477207/world-ark-missions/10.jpg", "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477208/world-ark-missions/12.jpg", "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477210/world-ark-missions/13.jpg"],
    iconName: "Users"
  },
  {
    slug: "women-ministry",
    title: "Women Ministry",
    shortDescription: "Empowering women to grow in grace and serve with love.",
    longDescription: "The Women's Ministry provides a nurturing space for women to connect, grow, and serve. We focus on spiritual maturity, sisterhood, and impactful outreach, helping every woman discover her unique voice and value in Christ.",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477208/world-ark-missions/12.jpg",
    gallery: ["https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477208/world-ark-missions/11.jpg", "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477251/world-ark-missions/portrait-young-smiling-woman-wearing-sportswear-morning-park_93675-133003.jpg", "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477240/world-ark-missions/holy-week-celebration-vivid-colors_23-2151195211.jpg"],
    iconName: "UserCircle"
  },
  {
    slug: "priest",
    title: "Priest",
    shortDescription: "Our spiritual leadership dedicated to guiding the flock.",
    longDescription: "The Priesthood ministry at World Ark Missions focuses on the deep spiritual growth of our leaders and the entire congregation. Dedicated to intercession, counseling, and pure biblical teaching, our priests are the backbone of the church's spiritual health.",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477210/world-ark-missions/13.jpg",
    gallery: ["https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477256/world-ark-missions/rev.jpg", "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477207/world-ark-missions/10.jpg", "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477208/world-ark-missions/11.jpg"],
    iconName: "Cross"
  },
  {
    slug: "queen",
    title: "Queen",
    shortDescription: "Honoring the noble calling and graceful leadership within our family.",
    longDescription: "The Queen's Ministry celebrates and honors the noble calling of women in leadership and motherhood. We provide guidance on maintaining grace, dignity, and spiritual influence in every sphere of life, fostering a legacy of faith for generations to come.",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477240/world-ark-missions/holy-week-celebration-vivid-colors_23-2151195211.jpg",
    gallery: ["https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477208/world-ark-missions/12.jpg", "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477221/world-ark-missions/abstract-blur-wedding-hall_74190-5228.jpg", "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477208/world-ark-missions/11.jpg"],
    iconName: "Crown"
  },
  {
    slug: "children-ministry",
    title: "Children Ministry",
    shortDescription: "Nurturing young hearts in the way of the Lord.",
    longDescription: "Our Children's Ministry is a vibrant, fun, and safe environment where the youngest members of our family learn about God's love. Through age-appropriate lessons, music, and play, we lay the foundation for a lifelong relationship with Christ.",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477235/world-ark-missions/high-angle-young-people-praying-outdoors_23-2150870086.jpg",
    gallery: ["https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477260/world-ark-missions/students-learning-cafeteria_23-2147679038.jpg", "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477208/world-ark-missions/11.jpg", "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477207/world-ark-missions/10.jpg"],
    iconName: "Baby"
  }
];
