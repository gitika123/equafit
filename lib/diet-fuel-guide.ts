export interface DietFuelWeek {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  budgetNote: string;
  tips: string[];
  shoppingIdeas: string[];
}

/** Rotating weekly themes (8 before the cycle repeats); “this week” follows the calendar ISO week. */
export const DIET_FUEL_WEEKS: DietFuelWeek[] = [
  {
    id: 1,
    title: "Pantry power",
    subtitle: "Build meals from shelf-stable basics",
    icon: "🫘",
    budgetNote: "Beans, rice, and oats cost cents per serving.",
    tips: [
      "Cook a big pot of beans or lentils on Sunday — freeze in portions for burritos, soups, and grain bowls.",
      "Replace one meat meal with eggs, tofu, or chickpeas; protein still counts and the receipt shrinks.",
      "Make your own seasoning mixes (cumin, paprika, garlic powder) instead of buying specialty packets.",
      "Oats work for breakfast, smoothies, and savory porridge with a fried egg on top.",
    ],
    shoppingIdeas: ["Dried beans or lentils", "Rolled oats", "Canned tomatoes", "Onions & garlic", "Eggs"],
  },
  {
    id: 2,
    title: "Smart protein",
    subtitle: "Hit protein goals without premium prices",
    icon: "🍳",
    budgetNote: "Frozen fish and store-brand Greek yogurt are usually cheaper than fresh cuts daily.",
    tips: [
      "Buy chicken thighs or drumsticks instead of breast — more flavor, often half the price.",
      "Cottage cheese and skyr add protein to snacks; compare cost per gram of protein on the label.",
      "Canned tuna, sardines, or salmon make fast salads and pasta; watch for sales and stock up.",
      "Tofu and tempeh freeze okay; grab extras when they’re marked down.",
    ],
    shoppingIdeas: ["Frozen chicken pieces", "Canned fish", "Greek yogurt", "Tofu", "Peanut butter"],
  },
  {
    id: 3,
    title: "Produce that pays off",
    subtitle: "Fresh, frozen, and ugly — all count",
    icon: "🥬",
    budgetNote: "Frozen vegetables are as nutritious as fresh and waste less.",
    tips: [
      "Frozen broccoli, spinach, and mixed veg go straight into stir-fries, eggs, and rice — no spoilage guilt.",
      "Shop “ugly” or discount produce bins first; chop and freeze anything softening fast.",
      "Cabbage, carrots, and potatoes stay cheap year-round — slaws, soups, and oven fries.",
      "Herbs in pots on a windowsill beat buying $3 bunches every week.",
    ],
    shoppingIdeas: ["Frozen veg bags", "Bananas (freeze browning ones for smoothies)", "Cabbage", "Carrots", "In-season fruit"],
  },
  {
    id: 4,
    title: "Plan & stretch",
    subtitle: "Leftovers and batch prep = fewer delivery taps",
    icon: "🍱",
    budgetNote: "One planned “clean-out” meal per week saves more than skipping coffee.",
    tips: [
      "Write a 5-dinner outline before you shop — impulse buys drop when you have a list.",
      "Roast a tray of vegetables + a sheet of chicken or tofu; use them in bowls, wraps, and salads for three days.",
      "Soup from vegetable ends, bones, or a bouillon cube clears the fridge and stretches one meal into two.",
      "Pack lunch twice a week; even small habits compound for your budget and energy.",
    ],
    shoppingIdeas: ["Reusable containers", "Broth or bouillon", "Tortillas or bread on sale", "Cheese block (grate yourself)", "Whatever is on sale for batch cooking"],
  },
  {
    id: 5,
    title: "Breakfast & snacks",
    subtitle: "Cheap fuel between classes",
    icon: "🌾",
    budgetNote: "Store-brand cereal and bulk nuts beat coffee-shop pastries on cost per calorie.",
    tips: [
      "Overnight oats with milk or yogurt + frozen berries cost less than daily grab-and-go options.",
      "Hard-boil a half-dozen eggs on Sunday; pair with fruit or toast for portable protein.",
      "Popcorn kernels in a pot beat chip bags — whole grain, pennies per bowl.",
      "Dilute juice with water or sparkling water; you still get flavor, fewer empty calories per dollar.",
    ],
    shoppingIdeas: ["Rolled oats", "Bananas", "Peanuts or sunflower seeds", "Popcorn kernels", "Store-brand milk"],
  },
  {
    id: 6,
    title: "One-pot & global staples",
    subtitle: "Noodles, rice, and spice without the restaurant bill",
    icon: "🍜",
    budgetNote: "Dried pasta and rice noodles last months; sauces from soy, garlic, and chili cost almost nothing.",
    tips: [
      "Fried rice clears leftover veg and protein — day-old rice works best and tastes better.",
      "Lentil dal or chickpea stew over rice feeds a crowd from one bag of legumes.",
      "Miso paste + noodles + frozen veg = fast soup; a little paste goes a long way.",
      "Skip bottled sauces when you can: tomato paste, vinegar, and spices build flavor cheaply.",
    ],
    shoppingIdeas: ["Rice or noodles", "Miso", "Soy sauce", "Lentils", "Tomato paste"],
  },
  {
    id: 7,
    title: "Fiber & steady energy",
    subtitle: "Stay full without pricey “superfoods”",
    icon: "🥣",
    budgetNote: "Oats, beans, and apples are budget fiber; you don’t need imported powders.",
    tips: [
      "Add beans to tacos, pasta, or salad even in small amounts — fiber + protein in one move.",
      "Choose whole fruit over juice when prices are similar; chewing slows you down and helps fullness.",
      "If energy dips, pair carbs with protein or fat (apple + peanut butter, toast + egg) instead of doubling sugar.",
      "Water before meals is free hydration; carry a bottle so you’re not buying drinks on impulse.",
    ],
    shoppingIdeas: ["Apples", "Carrots", "Whole-grain bread on sale", "Chickpeas", "Refillable water bottle"],
  },
  {
    id: 8,
    title: "Crunch-time cooking",
    subtitle: "When you only have 15 minutes",
    icon: "⏱️",
    budgetNote: "Convenience fees add up; a few “emergency” meals at home beat delivery streaks.",
    tips: [
      "Keep frozen veg + eggs + hot sauce — scramble or fried rice in one pan under 15 minutes.",
      "Canned beans rinsed + microwave rice + salsa = burrito bowl; add cheese if you have it.",
      "Toast + refried beans + shredded veg is faster than waiting for a driver.",
      "When you do order in, make it intentional (social, treat) not autopilot — budget stays kinder.",
    ],
    shoppingIdeas: ["Microwave rice pouches (on sale)", "Canned beans", "Salsa", "Frozen stir-fry mix", "Eggs"],
  },
];

/** ISO week number 1–53 for the given date (UTC-safe for week rotation). */
export function getISOWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getCurrentDietFuelWeek(date: Date = new Date()): DietFuelWeek {
  const week = getISOWeekNumber(date);
  const index = (week - 1) % DIET_FUEL_WEEKS.length;
  return DIET_FUEL_WEEKS[index];
}
