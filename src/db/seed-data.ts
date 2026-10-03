export type SeedSize = { label: string; priceCents: number };

export type SeedCollection = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
  sortOrder: number;
};

export type SeedProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  collectionSlug: string;
  origin: string;
  process: string;
  varietal: string;
  altitude: string;
  roast: string;
  caffeine: "Regular" | "Decaf" | "Half-caf";
  intensity: number;
  tastingNotes: string[];
  brewMethods: string[];
  grinds: string[];
  sizes: SeedSize[];
  image: string;
  gallery: string[];
  badge: string | null;
  compareAtCents: number | null;
  stock: number;
  isFeatured: boolean;
  isBestseller: boolean;
};

export type SeedReview = {
  productSlug: string;
  author: string;
  campus: string;
  major: string;
  rating: number;
  title: string;
  body: string;
  daysAgo: number;
};

const ALL_GRINDS = [
  "Whole Bean",
  "Espresso",
  "Filter / Pour Over",
  "French Press",
  "Cold Brew",
];
const BAG_GRINDS = ["Whole Bean", "Espresso", "Filter / Pour Over", "French Press"];

export const seedCollections: SeedCollection[] = [
  {
    slug: "study-fuel",
    name: "Study Fuel",
    tagline: "Dark, bold, unputdownable",
    description:
      "High-octane roasts built for 2am problem sets. Heavy body, zero fuss, brews beautifully in anything with a plug.",
    image: "/images/products/all-nighter.jpg",
    accent: "#b4553c",
    sortOrder: 1,
  },
  {
    slug: "single-estate",
    name: "Single Estate",
    tagline: "Tasted like a vineyard, priced like a textbook",
    description:
      "Traceable micro-lots from Chikmagalur to Huila. Roasted light so the farm does the talking, not the roast.",
    image: "/images/products/library-quiet.jpg",
    accent: "#7d8b71",
    sortOrder: 2,
  },
  {
    slug: "quick-brew",
    name: "Quick Brew",
    tagline: "Coffee that beats the 8am bell",
    description:
      "Cold brew concentrate, drip bags and gear that fit in a hostel locker. Ninety seconds from kettle to cup.",
    image: "/images/products/cold-brew.jpg",
    accent: "#c2854f",
    sortOrder: 3,
  },
  {
    slug: "gift-kits",
    name: "Gift Kits & Decaf",
    tagline: "For care packages and calm evenings",
    description:
      "Curated bundles for exam season, plus a decaf you will happily drink on purpose. Ship it to your favourite student.",
    image: "/images/products/exam-week.jpg",
    accent: "#a76a35",
    sortOrder: 4,
  },
];

export const seedProducts: SeedProduct[] = [
  {
    slug: "all-nighter-espresso",
    name: "All-Nighter Espresso",
    tagline: "Dark chocolate punch for 2am deadlines",
    description:
      "Our flagship dark roast: a Brazil × Chikmagalur blend engineered to cut through milk and hold its own in a moka pot. Syrupy, bittersweet, and never ashy.",
    story:
      "We blended a natural Brazil for body with a washed Chikmagalur for structure, then pushed the roast just past first crack's second breath. It pulls a dense 1:2 shot in 26 seconds and still tastes like cocoa when it cools in your mug during a three-hour study block.",
    collectionSlug: "study-fuel",
    origin: "Brazil & Chikmagalur, India",
    process: "Natural / Washed blend",
    varietal: "Yellow Bourbon, S-795",
    altitude: "1,100 – 1,450 m",
    roast: "Dark",
    caffeine: "Regular",
    intensity: 5,
    tastingNotes: ["Dark Chocolate", "Toasted Almond", "Molasses"],
    brewMethods: ["Espresso", "Moka Pot", "French Press", "Aeropress"],
    grinds: BAG_GRINDS,
    sizes: [
      { label: "250g", priceCents: 54900 },
      { label: "500g", priceCents: 99900 },
      { label: "1kg", priceCents: 179900 },
    ],
    image: "/images/products/all-nighter.jpg",
    gallery: [
      "/images/products/all-nighter.jpg",
      "/images/gallery/6007666.jpg",
      "/images/gallery/34579318.jpg",
    ],
    badge: "Bestseller",
    compareAtCents: 64900,
    stock: 120,
    isFeatured: true,
    isBestseller: true,
  },
  {
    slug: "midnight-oil-french-roast",
    name: "Midnight Oil French Roast",
    tagline: "Smoky, heavy, hostel-kettle proof",
    description:
      "The darkest roast we make. Smoke, bittersweet cocoa and a finish that lingers longer than your reading list. Forgiving even in a dented hostel kettle.",
    story:
      "Named for the lamp that never goes off in the fourth-floor corridor of a certain engineering hostel. Roasted 90 seconds longer than All-Nighter for a charred-sugar sweetness that stands up to cheap milk powder.",
    collectionSlug: "study-fuel",
    origin: "Sumatra & Karnataka",
    process: "Wet-hulled / Washed blend",
    varietal: "Typica, S-288",
    altitude: "1,000 – 1,300 m",
    roast: "Dark",
    caffeine: "Regular",
    intensity: 5,
    tastingNotes: ["Pipe Tobacco", "Bittersweet Cocoa", "Cedar"],
    brewMethods: ["French Press", "Moka Pot", "Drip"],
    grinds: BAG_GRINDS,
    sizes: [
      { label: "250g", priceCents: 59900 },
      { label: "500g", priceCents: 1_07900 },
      { label: "1kg", priceCents: 1_94900 },
    ],
    image: "/images/gallery/6007666.jpg",
    gallery: [
      "/images/gallery/6007666.jpg",
      "/images/products/all-nighter.jpg",
      "/images/gallery/20557063.jpg",
    ],
    badge: null,
    compareAtCents: null,
    stock: 74,
    isFeatured: false,
    isBestseller: false,
  },
  {
    slug: "lecture-hall-house-blend",
    name: "Lecture Hall House Blend",
    tagline: "The crowd-pleaser in the red bag",
    description:
      "A balanced medium roast that tastes like a great café cappuccino without the café price. Round, nutty and sweet enough to drink black.",
    story:
      "Three origins, one purpose: the coffee we brew by the litre in the Jaitra campus cart. Caramel sweetness, low acid, and a finish that keeps 400 students coming back between lectures.",
    collectionSlug: "study-fuel",
    origin: "Karnataka, Indonesia & Brazil",
    process: "Washed blend",
    varietal: "S-795, Catimor",
    altitude: "900 – 1,400 m",
    roast: "Medium",
    caffeine: "Regular",
    intensity: 3,
    tastingNotes: ["Caramel", "Hazelnut", "Red Apple"],
    brewMethods: ["Pour Over", "Drip", "Espresso", "Aeropress"],
    grinds: BAG_GRINDS,
    sizes: [
      { label: "250g", priceCents: 47900 },
      { label: "500g", priceCents: 85900 },
      { label: "1kg", priceCents: 1_54900 },
    ],
    image: "/images/products/lecture-hall.jpg",
    gallery: [
      "/images/products/lecture-hall.jpg",
      "/images/gallery/9271565.jpg",
      "/images/gallery/6240913.jpg",
    ],
    badge: "Staff pick",
    compareAtCents: null,
    stock: 96,
    isFeatured: true,
    isBestseller: true,
  },
  {
    slug: "library-quiet-ethiopia",
    name: "Library Quiet · Ethiopia Yirgacheffe",
    tagline: "Floral, tea-like, whispers rather than shouts",
    description:
      "Washed heirloom lot from the Gedeo zone. Jasmine on the nose, bergamot and stone fruit in the cup — the kind of coffee you sip slowly in the quiet floor.",
    story:
      "Sourced through a 340-smallholder cooperative. We roast it barely past first crack so the jasmine survives, and recommend a 1:16 pour over at 94°C for the full perfume.",
    collectionSlug: "single-estate",
    origin: "Yirgacheffe, Ethiopia",
    process: "Washed",
    varietal: "Heirloom (74110, 74112)",
    altitude: "1,900 – 2,100 m",
    roast: "Light",
    caffeine: "Regular",
    intensity: 2,
    tastingNotes: ["Jasmine", "Bergamot", "White Peach"],
    brewMethods: ["Pour Over", "Aeropress", "Cold Brew"],
    grinds: ["Whole Bean", "Filter / Pour Over"],
    sizes: [
      { label: "250g", priceCents: 69900 },
      { label: "500g", priceCents: 1_24900 },
    ],
    image: "/images/products/library-quiet.jpg",
    gallery: [
      "/images/products/library-quiet.jpg",
      "/images/gallery/34579318.jpg",
      "/images/gallery/34528555.jpg",
    ],
    badge: "New harvest",
    compareAtCents: null,
    stock: 48,
    isFeatured: true,
    isBestseller: false,
  },
  {
    slug: "huila-colombia",
    name: "Dean's List · Colombia Huila",
    tagline: "Juicy caramel cup, straight-A reliability",
    description:
      "A pink-bourbon lot from San Agustín that tastes like panela and plum. Sweet enough to convert the milk-and-sugar crowd, clean enough for the black-coffee purists.",
    story:
      "Grown at 1,750 m by the Ortiz family, fermented 36 hours in cherry before washing. We buy the entire lot each harvest, which is why it tastes identical in October and in April.",
    collectionSlug: "single-estate",
    origin: "Huila, Colombia",
    process: "Washed, 36h ferment",
    varietal: "Pink Bourbon",
    altitude: "1,750 m",
    roast: "Medium-Light",
    caffeine: "Regular",
    intensity: 3,
    tastingNotes: ["Panela", "Plum", "Cacao Nib"],
    brewMethods: ["Pour Over", "Espresso", "Aeropress"],
    grinds: BAG_GRINDS,
    sizes: [
      { label: "250g", priceCents: 74900 },
      { label: "500g", priceCents: 1_34900 },
    ],
    image: "/images/gallery/20557063.jpg",
    gallery: [
      "/images/gallery/20557063.jpg",
      "/images/gallery/34528555.jpg",
      "/images/gallery/6007666.jpg",
    ],
    badge: null,
    compareAtCents: 82900,
    stock: 61,
    isFeatured: false,
    isBestseller: true,
  },
  {
    slug: "mandara-estate-chikmagalur",
    name: "Mandara Estate · Chikmagalur",
    tagline: "Our home hill, shade-grown under spice trees",
    description:
      "Single-estate Arabica grown beside pepper vines and cardamom four hours from our roastery. Soft, spicy and impossibly fresh — roasted the week it ships.",
    story:
      "Mandara is a 60-acre family estate we visit every February. Shade-grown, rain-fed, hand-picked, and trucked to the roastery in the same week, which is why your bag is stamped with a roast date you can actually believe.",
    collectionSlug: "single-estate",
    origin: "Chikmagalur, Karnataka",
    process: "Honey",
    varietal: "S-795, Chandragiri",
    altitude: "1,420 m",
    roast: "Medium",
    caffeine: "Regular",
    intensity: 3,
    tastingNotes: ["Cardamom", "Milk Chocolate", "Orange Peel"],
    brewMethods: ["Pour Over", "French Press", "Drip"],
    grinds: BAG_GRINDS,
    sizes: [
      { label: "250g", priceCents: 64900 },
      { label: "500g", priceCents: 1_14900 },
      { label: "1kg", priceCents: 2_04900 },
    ],
    image: "/images/products/freshman-filter.jpg",
    gallery: [
      "/images/products/freshman-filter.jpg",
      "/images/gallery/33094652.jpg",
      "/images/gallery/6007666.jpg",
    ],
    badge: "Roasted weekly",
    compareAtCents: null,
    stock: 83,
    isFeatured: true,
    isBestseller: false,
  },
  {
    slug: "thesis-reserve-geisha",
    name: "Thesis Reserve · Panama Geisha",
    tagline: "The celebration coffee. Defend the thesis, open the bag.",
    description:
      "A 40kg micro-lot of Geisha from Boquete — jasmine, mandarin and honeysuckle with a finish that goes on for a full paragraph. Numbered bags, 100 of them.",
    story:
      "We reserve this lot for the moments that deserve ceremony: submitted theses, defended proposals, first job offers. Each hand-numbered 150g tin comes with a brewing card written by our head roaster.",
    collectionSlug: "single-estate",
    origin: "Boquete, Panama",
    process: "Washed",
    varietal: "Geisha",
    altitude: "1,700 m",
    roast: "Light",
    caffeine: "Regular",
    intensity: 2,
    tastingNotes: ["Jasmine", "Mandarin", "Honeysuckle"],
    brewMethods: ["Pour Over", "Aeropress"],
    grinds: ["Whole Bean", "Filter / Pour Over"],
    sizes: [
      { label: "150g tin", priceCents: 2_45000 },
      { label: "300g tin", priceCents: 4_60000 },
    ],
    image: "/images/products/thesis-reserve.jpg",
    gallery: [
      "/images/products/thesis-reserve.jpg",
      "/images/gallery/34579318.jpg",
      "/images/gallery/33094652.jpg",
    ],
    badge: "Limited · 100 bags",
    compareAtCents: null,
    stock: 18,
    isFeatured: true,
    isBestseller: false,
  },
  {
    slug: "hostel-cold-brew-concentrate",
    name: "Hostel Cold Brew Concentrate",
    tagline: "Steep 12 hours in the fridge, ignore for a week",
    description:
      "A 1-litre bottle of coarsely ground steep-and-strain cold brew, portioned for a 1.5L jar. Chocolatey, low-acid, and shockingly cheap per cup.",
    story:
      "Developed after one too many warm cans of fizzy energy drink in a Kota-style hostel corridor. Cut it 1:1 with water or milk over ice, and one bottle quietly covers eleven 9am lectures.",
    collectionSlug: "quick-brew",
    origin: "Chikmagalur, India",
    process: "Washed",
    varietal: "S-795",
    altitude: "1,200 m",
    roast: "Medium-Dark",
    caffeine: "Regular",
    intensity: 4,
    tastingNotes: ["Cocoa", "Date", "Toffee"],
    brewMethods: ["Cold Brew", "Iced"],
    grinds: ["Cold Brew", "Whole Bean"],
    sizes: [
      { label: "1L kit", priceCents: 62900 },
      { label: "3L kit", priceCents: 1_64900 },
    ],
    image: "/images/products/cold-brew.jpg",
    gallery: [
      "/images/products/cold-brew.jpg",
      "/images/gallery/9329429.jpg",
      "/images/gallery/9271565.jpg",
    ],
    badge: "Summer favourite",
    compareAtCents: null,
    stock: 55,
    isFeatured: true,
    isBestseller: true,
  },
  {
    slug: "five-minute-drip-bags",
    name: "Five-Minute Drip Bags",
    tagline: "Box of 10. Hot water is the only equipment.",
    description:
      "Single-serve pour-over pouches, pre-ground and nitrogen sealed. Hang it on any mug, add water, done — the whole setup fits in a laptop sleeve.",
    story:
      "Built for library desks, train journeys and hostel rooms where the only kettle is communal. Each box holds 10 sachets of our Mandara honey-process lot, sealed within 48 hours of grinding.",
    collectionSlug: "quick-brew",
    origin: "Chikmagalur, India",
    process: "Honey",
    varietal: "S-795, Chandragiri",
    altitude: "1,420 m",
    roast: "Medium",
    caffeine: "Regular",
    intensity: 3,
    tastingNotes: ["Milk Chocolate", "Almond", "Dried Fig"],
    brewMethods: ["Pour Over", "Drip"],
    grinds: ["Filter / Pour Over"],
    sizes: [
      { label: "10 sachets", priceCents: 54900 },
      { label: "20 sachets", priceCents: 99900 },
    ],
    image: "/images/products/freshman-filter.jpg",
    gallery: [
      "/images/products/freshman-filter.jpg",
      "/images/gallery/6240913.jpg",
      "/images/gallery/34528555.jpg",
    ],
    badge: "Travel ready",
    compareAtCents: 62900,
    stock: 140,
    isFeatured: false,
    isBestseller: true,
  },
  {
    slug: "dorm-french-press-kit",
    name: "Dorm French Press Kit",
    tagline: "Press, plunger, first cup in four minutes",
    description:
      "A 350ml borosilicate french press with a steel filter, paired with 250g of Lecture Hall blend ground specifically for immersion. No paper filters, no electricity, no excuses.",
    story:
      "The kit we wish we had in first year. The press fits in a drawer, survives a fall off a hostel bunk (tested twice), and the included grind dial card tells you exactly how long to steep.",
    collectionSlug: "quick-brew",
    origin: "Kit · Karnataka blend",
    process: "Washed blend",
    varietal: "—",
    altitude: "—",
    roast: "Medium",
    caffeine: "Regular",
    intensity: 3,
    tastingNotes: ["Caramel", "Hazelnut"],
    brewMethods: ["French Press", "Aeropress"],
    grinds: ["French Press"],
    sizes: [{ label: "Press + 250g", priceCents: 1_39900 }],
    image: "/images/gallery/33094652.jpg",
    gallery: [
      "/images/gallery/33094652.jpg",
      "/images/gallery/6007666.jpg",
      "/images/gallery/9271565.jpg",
    ],
    badge: null,
    compareAtCents: 1_59900,
    stock: 32,
    isFeatured: false,
    isBestseller: false,
  },
  {
    slug: "exam-week-survival-kit",
    name: "Exam Week Survival Kit",
    tagline: "Three bags, one ribbon, zero all-nighters unaided",
    description:
      "All-Nighter Espresso, Lecture Hall and Five-Minute Drip Bags tied in jute twine with a handwritten brew card. Save ₹340 against buying them separately.",
    story:
      "Our most-gifted box during finals. Parents buy it, roommates buy it, and the college Cultural Committee bought forty of them for the fest coffee stall.",
    collectionSlug: "gift-kits",
    origin: "Brazil, Karnataka & Ethiopia",
    process: "Mixed",
    varietal: "Blend",
    altitude: "—",
    roast: "Mixed",
    caffeine: "Regular",
    intensity: 4,
    tastingNotes: ["Dark Chocolate", "Caramel", "Jasmine"],
    brewMethods: ["Espresso", "Pour Over", "French Press"],
    grinds: BAG_GRINDS,
    sizes: [{ label: "3 × 250g", priceCents: 1_44900 }],
    image: "/images/products/exam-week.jpg",
    gallery: [
      "/images/products/exam-week.jpg",
      "/images/products/all-nighter.jpg",
      "/images/products/lecture-hall.jpg",
    ],
    badge: "Save ₹340",
    compareAtCents: 1_78900,
    stock: 40,
    isFeatured: true,
    isBestseller: true,
  },
  {
    slug: "study-group-sampler",
    name: "Study Group Sampler",
    tagline: "Three origins for the group that argues about flavour",
    description:
      "Three 150g bags — Ethiopia Yirgacheffe, Colombia Huila and Mandara Estate — so your study group can run a proper cupping between chapters.",
    story:
      "Includes three paper cupping bowls, a flavour wheel card and a scoring sheet. Because apparently that is what happens when five commerce students get a grinder.",
    collectionSlug: "gift-kits",
    origin: "Ethiopia, Colombia & India",
    process: "Mixed",
    varietal: "Mixed",
    altitude: "—",
    roast: "Mixed",
    caffeine: "Regular",
    intensity: 3,
    tastingNotes: ["Jasmine", "Panela", "Cardamom"],
    brewMethods: ["Pour Over", "Cupping", "Aeropress"],
    grinds: ["Whole Bean", "Filter / Pour Over"],
    sizes: [{ label: "3 × 150g", priceCents: 1_09900 }],
    image: "/images/products/exam-week.jpg",
    gallery: [
      "/images/products/exam-week.jpg",
      "/images/products/library-quiet.jpg",
      "/images/products/cold-brew.jpg",
    ],
    badge: null,
    compareAtCents: null,
    stock: 52,
    isFeatured: false,
    isBestseller: false,
  },
  {
    slug: "late-night-library-decaf",
    name: "Late Night Library Decaf",
    tagline: "Sugarcane processed. 99.9% caffeine free.",
    description:
      "A natural-ethyl-acetate decaf from Huila that actually tastes like coffee: toffee, red apple and a round cocoa finish. Drink it at 11pm and still sleep.",
    story:
      "Decaffeinated with sugarcane-derived EA in Colombia, then roasted a touch darker than the original lot. This is the bag we keep in the roastery kitchen for the 6pm shift.",
    collectionSlug: "gift-kits",
    origin: "Huila, Colombia",
    process: "Sugarcane EA decaf",
    varietal: "Caturra, Castillo",
    altitude: "1,600 m",
    roast: "Medium-Dark",
    caffeine: "Decaf",
    intensity: 3,
    tastingNotes: ["Toffee", "Red Apple", "Cocoa"],
    brewMethods: ["Espresso", "French Press", "Pour Over"],
    grinds: BAG_GRINDS,
    sizes: [
      { label: "250g", priceCents: 59900 },
      { label: "500g", priceCents: 1_06900 },
    ],
    image: "/images/products/deans-list-decaf.jpg",
    gallery: [
      "/images/products/deans-list-decaf.jpg",
      "/images/gallery/6240913.jpg",
      "/images/gallery/9271565.jpg",
    ],
    badge: "Decaf",
    compareAtCents: null,
    stock: 67,
    isFeatured: false,
    isBestseller: false,
  },
  {
    slug: "jaitra-campus-mug",
    name: "Jaitra Campus Mug",
    tagline: "300ml stoneware, survives the backpack",
    description:
      "Thick-walled reactive-glaze stoneware in espresso brown with a thumb-notch handle. Dishwasher safe, microwave safe, dissertation-defence safe.",
    story:
      "Thrown by a small pottery studio in Bengaluru and fired twice, which is why the glaze pools differently on every single mug. Holds exactly one generous brew and two biscuits.",
    collectionSlug: "gift-kits",
    origin: "Made in Bengaluru",
    process: "Twice-fired stoneware",
    varietal: "—",
    altitude: "—",
    roast: "Gear",
    caffeine: "Regular",
    intensity: 1,
    tastingNotes: ["Reactive glaze", "Stoneware", "300ml"],
    brewMethods: ["Any"],
    grinds: ["Whole Bean"],
    sizes: [
      { label: "Single mug", priceCents: 74900 },
      { label: "Set of 2", priceCents: 1_39900 },
    ],
    image: "/images/gallery/9329429.jpg",
    gallery: [
      "/images/gallery/9329429.jpg",
      "/images/gallery/6240913.jpg",
      "/images/gallery/33094652.jpg",
    ],
    badge: "Gear",
    compareAtCents: null,
    stock: 88,
    isFeatured: false,
    isBestseller: false,
  },
];

const DARK_REVIEWS: Omit<SeedReview, "productSlug">[] = [
  {
    author: "Ananya Rao",
    campus: "IIT Madras",
    major: "Computer Science, 3rd year",
    rating: 5,
    title: "Survived four consecutive deadlines",
    body: "Ground it coarse in the common room, made moka pot shots at 1:40am and honestly the code got better. Tastes like dark chocolate, not burnt toast. The 500g bag lasted three weeks of heavy use.",
    daysAgo: 6,
  },
  {
    author: "Rohit Menon",
    campus: "St. Xavier's, Mumbai",
    major: "Economics, final year",
    rating: 5,
    title: "Cuts through hostel milk perfectly",
    body: "I take it with a lot of milk and sugar and it still tastes like coffee instead of warm water. Ordered on Tuesday, roasted that same day according to the stamp, arrived Thursday.",
    daysAgo: 14,
  },
  {
    author: "Sneha Kulkarni",
    campus: "Christ University",
    major: "Law, 2nd year",
    rating: 4,
    title: "Excellent, slightly too intense for me",
    body: "Quality is clearly a step above the supermarket stuff. I dial it back with a shorter brew and it is lovely. Would give five stars if there were a half-size 150g bag.",
    daysAgo: 21,
  },
  {
    author: "Imran Sheikh",
    campus: "NIT Trichy",
    major: "Mechanical, 4th year",
    rating: 5,
    title: "Crema for days",
    body: "First time pulling shots on a second-hand Gaggia and this blend was forgiving from the very first try. Sweet, thick, no sourness. Reordered the 1kg for the semester.",
    daysAgo: 33,
  },
];

const ORIGIN_REVIEWS: Omit<SeedReview, "productSlug">[] = [
  {
    author: "Meghana Iyer",
    campus: "Ashoka University",
    major: "Philosophy, 3rd year",
    rating: 5,
    title: "Tastes like the tasting notes, actually",
    body: "I have been burned by fancy bags before. This one really does smell like jasmine and the peach shows up once it cools. Pour over at 1:16, 94°C, exactly as the card says.",
    daysAgo: 4,
  },
  {
    author: "Devansh Patel",
    campus: "BITS Pilani",
    major: "Electronics, 2nd year",
    rating: 5,
    title: "Converted my whole wing",
    body: "Bought it to try something better than instant. Now four of us split the 500g every fortnight and we take turns brewing. Way cheaper than the campus café.",
    daysAgo: 12,
  },
  {
    author: "Farah Nazeer",
    campus: "SRM Chennai",
    major: "Architecture, 4th year",
    rating: 4,
    title: "Beautiful cup, needs patience",
    body: "Light roasts punish a lazy brew. Once I weighed the coffee properly it went from thin to genuinely floral. Packaging is gorgeous enough to keep on the desk.",
    daysAgo: 19,
  },
  {
    author: "Karthik Subramanian",
    campus: "IIM Bangalore",
    major: "MBA, 1st year",
    rating: 5,
    title: "Bought it for a case-study all-nighter",
    body: "Ended up sharing it with my study group and we ran a blind cupping instead of studying. The Mandara lot is the standout for me — soft, spicy, very drinkable.",
    daysAgo: 27,
  },
];

const QUICK_REVIEWS: Omit<SeedReview, "productSlug">[] = [
  {
    author: "Tanvi Deshmukh",
    campus: "Fergusson College, Pune",
    major: "BSc Statistics, 2nd year",
    rating: 5,
    title: "Eight minutes and I am caffeinated",
    body: "Hang the bag on the mug, pour, wait. That is the whole recipe. I keep three sachets in my backpack for the library and they have saved multiple 8am exams.",
    daysAgo: 3,
  },
  {
    author: "Aditya Verma",
    campus: "Delhi University",
    major: "BCom Hons, 3rd year",
    rating: 5,
    title: "Cold brew concentrate is a game changer",
    body: "Steeped it Monday night, drank it all week. Cut with milk over ice and it is better than the ₹280 cup I used to buy near campus. Bottle is sturdy too.",
    daysAgo: 9,
  },
  {
    author: "Nikhil Joseph",
    campus: "VIT Vellore",
    major: "CSE with AI, 3rd year",
    rating: 4,
    title: "Great gear, steep a little longer",
    body: "The press is genuinely well made for the price and the filter does not let sludge through. Four minutes was too weak for me — I go five and a half now.",
    daysAgo: 17,
  },
  {
    author: "Priya Nambiar",
    campus: "Manipal",
    major: "Pharmacy, 1st year",
    rating: 5,
    title: "Took it on a train, worked perfectly",
    body: "Sachets survived a 19 hour journey in a duffel bag. Only need a flask of hot water from the pantry. Tastes way better than the station coffee.",
    daysAgo: 25,
  },
];

const KIT_REVIEWS: Omit<SeedReview, "productSlug">[] = [
  {
    author: "Lakshmi Prasad",
    campus: "Parent, Hyderabad",
    major: "—",
    rating: 5,
    title: "Sent it to my daughter in hostel",
    body: "Packaging arrived without a dent and the handwritten card was a lovely touch. She texted a photo of the three bags lined up on her desk. Ordering again for her roommate.",
    daysAgo: 5,
  },
  {
    author: "Yash Choudhary",
    campus: "Nirma University",
    major: "Mechanical, 3rd year",
    rating: 5,
    title: "Cheaper than buying separately",
    body: "Worked out to ₹180 per bag cheaper and the drip sachets are perfect for the exam hall break. The bundle genuinely got our project group through submission week.",
    daysAgo: 11,
  },
  {
    author: "Aparna Ghosh",
    campus: "Jadavpur University",
    major: "English, MA",
    rating: 5,
    title: "The decaf is the real hero",
    body: "I was fully prepared for decaf to taste like disappointment. It tastes like toffee and I can drink it at 11pm without wrecking my sleep. Already on my third bag.",
    daysAgo: 16,
  },
  {
    author: "Sameer Qureshi",
    campus: "AMU",
    major: "Political Science, 2nd year",
    rating: 4,
    title: "Great gift, mug is chunky",
    body: "The stoneware mug is heavier than I expected, which I now like — it keeps coffee hot through a long reading session. Glaze on mine is darker than the photo.",
    daysAgo: 30,
  },
];

const REVIEW_POOL: Record<string, Omit<SeedReview, "productSlug">[]> = {
  "study-fuel": DARK_REVIEWS,
  "single-estate": ORIGIN_REVIEWS,
  "quick-brew": QUICK_REVIEWS,
  "gift-kits": KIT_REVIEWS,
};

const REVIEW_ROTATION: Record<string, number> = {
  "all-nighter-espresso": 0,
  "midnight-oil-french-roast": 1,
  "lecture-hall-house-blend": 2,
  "library-quiet-ethiopia": 0,
  "huila-colombia": 1,
  "mandara-estate-chikmagalur": 2,
  "thesis-reserve-geisha": 3,
  "hostel-cold-brew-concentrate": 0,
  "five-minute-drip-bags": 1,
  "dorm-french-press-kit": 2,
  "exam-week-survival-kit": 0,
  "study-group-sampler": 1,
  "late-night-library-decaf": 2,
  "jaitra-campus-mug": 3,
};

const EXTRA_REVIEWS: SeedReview[] = [
  {
    productSlug: "all-nighter-espresso",
    author: "Vaishnavi T.",
    campus: "SSN College",
    major: "IT, 2nd year",
    rating: 5,
    title: "My third 1kg bag",
    body: "Consistent every single time. The roast date is always within a week of shipping which is more than I can say for the big brands on the shelf.",
    daysAgo: 41,
  },
  {
    productSlug: "all-nighter-espresso",
    author: "Gaurav Bhatia",
    campus: "PICT Pune",
    major: "ENTC, 4th year",
    rating: 4,
    title: "Solid daily driver",
    body: "Slightly sweeter than I expected for a dark roast, which I like. Aeropress recipe on the site is worth following.",
    daysAgo: 52,
  },
  {
    productSlug: "library-quiet-ethiopia",
    author: "Rhea Fernandes",
    campus: "St. Joseph's, Bengaluru",
    major: "Psychology, 3rd year",
    rating: 5,
    title: "The quiet-floor coffee",
    body: "Delicate enough that I can drink two cups in a row without jitters. Bergamot is very real. Beautiful bag too.",
    daysAgo: 37,
  },
  {
    productSlug: "exam-week-survival-kit",
    author: "Ishita Bansal",
    campus: "Hansraj College",
    major: "BSc Hons, 2nd year",
    rating: 5,
    title: "Care package of the year",
    body: "My roommate and I split it before mid-sems. The brew card is genuinely useful and the twine ribbon made it feel like a real gift.",
    daysAgo: 22,
  },
  {
    productSlug: "hostel-cold-brew-concentrate",
    author: "Arjun Pillai",
    campus: "NIT Calicut",
    major: "Civil, 3rd year",
    rating: 4,
    title: "Cheap per cup, very smooth",
    body: "Needs a big jar and a fine enough strainer but the result is restaurant quality. Low acid means no stomach issues on an empty morning.",
    daysAgo: 44,
  },
  {
    productSlug: "thesis-reserve-geisha",
    author: "Dr. (candidate) Nandita Rao",
    campus: "IISc Bengaluru",
    major: "PhD, Molecular Biology",
    rating: 5,
    title: "Opened it after submitting",
    body: "Numbered bag 042. Jasmine and mandarin, and the aroma filled the room. Absurdly expensive for a student, absolutely worth it once.",
    daysAgo: 15,
  },
  {
    productSlug: "lecture-hall-house-blend",
    author: "Zoya Mirza",
    campus: "Jamia Millia Islamia",
    major: "Mass Comm, 3rd year",
    rating: 5,
    title: "Tastes like the campus cart",
    body: "I had this at the fest coffee stall and bought a bag the same evening. Caramel sweetness, never bitter, perfect in a drip machine.",
    daysAgo: 8,
  },
  {
    productSlug: "late-night-library-decaf",
    author: "Harsh Vardhan",
    campus: "NALSAR",
    major: "Law, 4th year",
    rating: 5,
    title: "Decaf that is not a punishment",
    body: "Espresso shots at 10pm, asleep by midnight. Genuinely impressive. I buy it alongside the regular All-Nighter now.",
    daysAgo: 13,
  },
];

export const seedReviews: SeedReview[] = [
  ...seedProducts.flatMap((product) => {
    const pool = REVIEW_POOL[product.collectionSlug] ?? DARK_REVIEWS;
    const start = REVIEW_ROTATION[product.slug] ?? 0;
    return pool
      .slice(0, 3)
      .map((review, index) => ({
        ...pool[(start + index) % pool.length],
        productSlug: product.slug,
      }))
      .slice(0, 3);
  }),
  ...EXTRA_REVIEWS,
];

export { ALL_GRINDS };
