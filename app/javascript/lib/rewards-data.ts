/**
 * Mock data for the Reward Hub UI (from Lovable). Replace with API data when wiring Rails.
 * Original Vite app imported JPG assets; those files were not in reward-hub-main — URLs are placeholders.
 */
export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  image: string;
}

export interface Redemption {
  id: string;
  rewardId: string;
  rewardName: string;
  cost: number;
  redeemedAt: Date;
}

export interface AppUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  history: Redemption[];
}

const img = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/400`;

export const rewards: Reward[] = [
  { id: "1", name: "Free Coffee", description: "Any size, any blend at partner cafés", cost: 200, category: "Food & Drink", image: img("thanx-coffee") },
  { id: "2", name: "$5 Gift Card", description: "Redeemable at hundreds of stores", cost: 500, category: "Gift Cards", image: img("thanx-gift5") },
  { id: "3", name: "$10 Gift Card", description: "Redeemable at hundreds of stores", cost: 950, category: "Gift Cards", image: img("thanx-gift10") },
  { id: "4", name: "Movie Ticket", description: "Standard admission at partner cinemas", cost: 800, category: "Entertainment", image: img("thanx-movie") },
  { id: "5", name: "Premium Hoodie", description: "Soft-touch branded hoodie, all sizes", cost: 2500, category: "Merch", image: img("thanx-hoodie") },
  { id: "6", name: "Spa Voucher", description: "30-min session at select spas", cost: 1800, category: "Experiences", image: img("thanx-spa") },
  { id: "7", name: "Wireless Earbuds", description: "Compact Bluetooth earbuds with case", cost: 3500, category: "Tech", image: img("thanx-earbuds") },
  { id: "8", name: "Free Lunch", description: "Meal up to $15 at partner restaurants", cost: 600, category: "Food & Drink", image: img("thanx-lunch") },
];

function daysAgo(d: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(10 + (d % 8), (d * 17) % 60);
  return date;
}

export const users: AppUser[] = [
  {
    id: "u1",
    name: "Olivia Chen",
    avatar: "OC",
    points: 4750,
    history: [
      { id: "h1", rewardId: "1", rewardName: "Free Coffee", cost: 200, redeemedAt: daysAgo(2) },
      { id: "h2", rewardId: "8", rewardName: "Free Lunch", cost: 600, redeemedAt: daysAgo(5) },
    ],
  },
  {
    id: "u2",
    name: "Marcus Rivera",
    avatar: "MR",
    points: 1200,
    history: [
      { id: "h4", rewardId: "4", rewardName: "Movie Ticket", cost: 800, redeemedAt: daysAgo(1) },
      { id: "h5", rewardId: "2", rewardName: "$5 Gift Card", cost: 500, redeemedAt: daysAgo(8) },
    ],
  },
  {
    id: "u3",
    name: "Aisha Patel",
    avatar: "AP",
    points: 8300,
    history: [
      { id: "h6", rewardId: "5", rewardName: "Premium Hoodie", cost: 2500, redeemedAt: daysAgo(3) },
      { id: "h7", rewardId: "6", rewardName: "Spa Voucher", cost: 1800, redeemedAt: daysAgo(10) },
    ],
  },
  {
    id: "u4",
    name: "James Okonkwo",
    avatar: "JO",
    points: 350,
    history: [],
  },
];
