export interface Review {
  id: number;
  text: string;
  author: string;
  location: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    text: "We adore all our friends at Bloomey, especially the beauties who have come to live with us! Great advice when needed, beautifully and safely packaged. Highly recommend, it's just the best place for healthy plants and great value!",
    author: "Pamela S.",
    location: "Lake Forest, CA",
  },
  {
    id: 2,
    text: "Outstanding safety equipment! The quality exceeded my expectations and the shipping was incredibly fast. The customer service team went above and beyond to help me find exactly what I needed. Will definitely order again!",
    author: "Marcus T.",
    location: "Denver, CO",
  },
  {
    id: 3,
    text: "Best purchase I've made in years. Every product is exactly as described and arrived in perfect condition. The attention to detail is remarkable. I've already recommended this company to all my colleagues at work.",
    author: "Sarah M.",
    location: "Portland, OR",
  },
];