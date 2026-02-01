require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Trip = require('./models/Trip');
const Review = require('./models/Review');

// Enhanced trip data with all required fields
const trips = [
    {
        tripId: 't1',
        title: 'Café & Canals — A Weekend in Amsterdam',
        location: 'Amsterdam, Netherlands',
        duration: '2 days',
        budget: '€220',
        price: 220,
        currency: 'EUR',
        tags: ['city', 'bike', 'coffee'],
        image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1576924542622-772281b13aa8?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Cycle along canals, visit museums, and enjoy cozy cafés.',
        description: 'Experience the magic of Amsterdam on two wheels. Glide along historic canals, discover world-class museums, and unwind in charming Dutch cafés. This weekend getaway captures the essence of this vibrant city.',
        itinerary: [
            { day: 1, title: 'Canal Cruise & Museums', description: 'Start with a scenic canal cruise, visit the Van Gogh museum, evening wandering through Jordaan district' },
            { day: 2, title: 'Bike Adventure', description: 'Rent a bike, picnic in Vondelpark, explore local markets and hidden gems' }
        ],
        highlights: ['Canal cruise', 'Van Gogh Museum', 'Bike routes', 'Dutch coffee culture'],
        included: ['2 nights accommodation', 'Bike rental', 'Canal cruise ticket', 'Museum entry', 'Breakfast'],
        notIncluded: ['Flights', 'Lunch & dinner', 'Travel insurance'],
        rating: 4.8,
        reviewCount: 124,
        spotsAvailable: 8,
        maxSpots: 12,
        featured: true,
        difficulty: 'Easy',
        groupSize: { min: 1, max: 10 }
    },
    {
        tripId: 't2',
        title: 'Santorini Sunset Escape',
        location: 'Santorini, Greece',
        duration: '3 days',
        budget: '€450',
        price: 450,
        currency: 'EUR',
        tags: ['island', 'sunset', 'views', 'romantic'],
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Experience the magic of Santorini\'s famous sunsets and white-washed villages.',
        description: 'Discover why Santorini is considered one of the world\'s most beautiful islands. Watch legendary sunsets paint the sky, explore charming villages, and sail the crystal-clear waters of the caldera.',
        itinerary: [
            { day: 1, title: 'Oia Village', description: 'Explore the iconic blue-domed churches and narrow streets of Oia' },
            { day: 2, title: 'Caldera Cruise', description: 'Sail the volcanic caldera, swim in hot springs, wine tasting at sunset' },
            { day: 3, title: 'Beach & Sunset', description: 'Red beach visit, traditional dinner with the famous Santorini sunset' }
        ],
        highlights: ['Sunset views', 'Wine tasting', 'Caldera cruise', 'Blue domes'],
        included: ['3 nights cave hotel', 'Caldera cruise', 'Wine tour', 'Airport transfers', 'Breakfast'],
        notIncluded: ['Flights', 'Lunch & dinner', 'Travel insurance'],
        rating: 4.9,
        reviewCount: 256,
        spotsAvailable: 6,
        maxSpots: 10,
        featured: true,
        difficulty: 'Easy',
        groupSize: { min: 2, max: 8 }
    },
    {
        tripId: 't3',
        title: 'Kyoto Cultural Immersion',
        location: 'Kyoto, Japan',
        duration: '4 days',
        budget: '¥85,000',
        price: 680,
        currency: 'USD',
        tags: ['culture', 'temples', 'gardens', 'tradition'],
        image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Discover ancient temples, traditional gardens, and authentic tea ceremonies.',
        description: 'Step back in time in Japan\'s cultural heart. Wander through serene Zen gardens, experience the meditative art of tea ceremony, and explore centuries-old temples. This immersive journey connects you with Japan\'s living traditions.',
        itinerary: [
            { day: 1, title: 'Temple Tour', description: 'Visit Kinkaku-ji and Fushimi Inari, traditional tea ceremony experience' },
            { day: 2, title: 'Bamboo Forest', description: 'Arashiyama bamboo grove, monkey park, and local shrines' },
            { day: 3, title: 'Culinary Arts', description: 'Japanese cooking class, Nishiki market tour, sake tasting' },
            { day: 4, title: 'Zen Experience', description: 'Meditation at a Zen temple, traditional garden tour, farewell kaiseki dinner' }
        ],
        highlights: ['Tea ceremony', 'Temple visits', 'Bamboo grove', 'Zen meditation'],
        included: ['4 nights ryokan stay', 'Cooking class', 'Tea ceremony', 'Temple entries', 'Rail pass', 'Breakfast'],
        notIncluded: ['International flights', 'Some meals', 'Travel insurance'],
        rating: 4.7,
        reviewCount: 189,
        spotsAvailable: 10,
        maxSpots: 12,
        featured: true,
        difficulty: 'Easy',
        groupSize: { min: 1, max: 12 }
    },
    {
        tripId: 't4',
        title: 'Machu Picchu Adventure',
        location: 'Cusco, Peru',
        duration: '5 days',
        budget: '$650',
        price: 650,
        currency: 'USD',
        tags: ['hiking', 'history', 'adventure', 'mountains'],
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Trek the ancient Inca Trail to the magnificent Machu Picchu.',
        description: 'Follow in the footsteps of the Incas on this legendary trek. Wind through cloud forests, pass ancient ruins, and witness the sunrise over Machu Picchu—one of the world\'s most awe-inspiring sights.',
        itinerary: [
            { day: 1, title: 'Cusco Arrival', description: 'Acclimatization in Cusco, city tour, pre-trek briefing' },
            { day: 2, title: 'Inca Trail Begins', description: 'Start the classic Inca Trail, camp at Wayllabamba' },
            { day: 3, title: 'Dead Woman\'s Pass', description: 'Cross the highest point, descend to Pacaymayo' },
            { day: 4, title: 'Cloud Forest', description: 'Trek through cloud forest, visit Wiñay Wayna ruins' },
            { day: 5, title: 'Machu Picchu', description: 'Sunrise at Sun Gate, guided tour of Machu Picchu' }
        ],
        highlights: ['Inca Trail', 'Mountain views', 'Ancient ruins', 'Sunrise at Machu Picchu'],
        included: ['4 nights camping', 'Professional guide', 'Porters', 'Meals on trek', 'Machu Picchu entry'],
        notIncluded: ['Flights', 'Cusco hotels', 'Sleeping bag rental', 'Tips'],
        rating: 4.9,
        reviewCount: 312,
        spotsAvailable: 4,
        maxSpots: 8,
        featured: true,
        difficulty: 'Challenging',
        groupSize: { min: 2, max: 8 }
    },
    {
        tripId: 't5',
        title: 'Safari in the Serengeti',
        location: 'Serengeti, Tanzania',
        duration: '4 days',
        budget: '$1,200',
        price: 1200,
        currency: 'USD',
        tags: ['wildlife', 'safari', 'nature', 'photography'],
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Witness the great migration and spot the Big Five in their natural habitat.',
        description: 'Experience the ultimate African safari in the world-famous Serengeti. Watch millions of wildebeest cross the plains, track the Big Five, and witness predators in action—all while staying in luxury tented camps.',
        itinerary: [
            { day: 1, title: 'Arrival & First Game Drive', description: 'Fly to Serengeti, afternoon game drive, sunset drinks' },
            { day: 2, title: 'Full Day Safari', description: 'Dawn to dusk game drives, seeking the Great Migration' },
            { day: 3, title: 'Big Five Hunt', description: 'Focus on tracking lions, leopards, elephants, rhinos, and buffalo' },
            { day: 4, title: 'Sunrise Drive', description: 'Final morning game drive, bush breakfast, departure' }
        ],
        highlights: ['Big Five', 'Great Migration', 'Sunset drives', 'Luxury camp'],
        included: ['3 nights luxury tented camp', 'All game drives', 'Expert guide', 'All meals', 'Park fees'],
        notIncluded: ['International flights', 'Domestic flights', 'Visa', 'Tips', 'Travel insurance'],
        rating: 4.8,
        reviewCount: 178,
        spotsAvailable: 6,
        maxSpots: 8,
        featured: false,
        difficulty: 'Easy',
        groupSize: { min: 2, max: 6 }
    },
    {
        tripId: 't6',
        title: 'Northern Lights in Iceland',
        location: 'Reykjavik, Iceland',
        duration: '3 days',
        budget: '€580',
        price: 580,
        currency: 'EUR',
        tags: ['aurora', 'nature', 'winter', 'adventure'],
        image: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1520769945061-0a448c463865?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Chase the aurora borealis and explore Iceland\'s winter wonderland.',
        description: 'Hunt the dancing northern lights across Iceland\'s dramatic landscapes. Soak in geothermal hot springs, explore ice caves, and witness the raw power of waterfalls frozen in winter\'s grip.',
        itinerary: [
            { day: 1, title: 'Blue Lagoon & City', description: 'Arrive, relax at Blue Lagoon, Reykjavik exploration' },
            { day: 2, title: 'Golden Circle', description: 'Þingvellir, Geysir, Gullfoss waterfall, evening aurora hunt' },
            { day: 3, title: 'Northern Lights Hunt', description: 'South coast waterfalls, black sand beaches, aurora viewing' }
        ],
        highlights: ['Aurora viewing', 'Hot springs', 'Ice caves', 'Waterfalls'],
        included: ['2 nights hotel', 'Blue Lagoon entry', 'Golden Circle tour', 'Aurora hunt', 'Breakfast'],
        notIncluded: ['Flights', 'Lunch & dinner', 'Travel insurance'],
        rating: 4.6,
        reviewCount: 203,
        spotsAvailable: 10,
        maxSpots: 15,
        featured: false,
        difficulty: 'Easy',
        groupSize: { min: 1, max: 15 }
    },
    {
        tripId: 't7',
        title: 'Maldives Paradise Escape',
        location: 'Male, Maldives',
        duration: '5 days',
        budget: '$1,800',
        price: 1800,
        currency: 'USD',
        tags: ['beach', 'luxury', 'relaxation', 'diving'],
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Unwind in overwater villas and explore vibrant coral reefs.',
        description: 'Escape to paradise in the Maldives. Wake up to turquoise waters beneath your overwater villa, snorkel with manta rays, and let time slow down in this tropical haven of luxury and natural beauty.',
        itinerary: [
            { day: 1, title: 'Arrival & Spa', description: 'Speedboat to resort, welcome spa treatment, sunset dinner' },
            { day: 2, title: 'Ocean Adventure', description: 'Snorkeling safari, dolphin watching, beach picnic' },
            { day: 3, title: 'Relaxation Day', description: 'Sunrise yoga, spa treatments, private beach time' },
            { day: 4, title: 'Water Sports', description: 'Kayaking, jet skiing, underwater restaurant dinner' },
            { day: 5, title: 'Sunset Cruise', description: 'Morning dive, sunset cruise with champagne, departure' }
        ],
        highlights: ['Overwater villa', 'Snorkeling', 'Spa treatments', 'Sunset cruise'],
        included: ['4 nights overwater villa', 'Full board meals', 'Snorkeling gear', 'Sunset cruise', 'Transfers'],
        notIncluded: ['Flights', 'Premium drinks', 'Spa treatments', 'Water sports', 'Tips'],
        rating: 4.9,
        reviewCount: 145,
        spotsAvailable: 4,
        maxSpots: 6,
        featured: true,
        difficulty: 'Easy',
        groupSize: { min: 2, max: 4 }
    },
    {
        tripId: 't8',
        title: 'Vietnam Food Journey',
        location: 'Hanoi, Vietnam',
        duration: '4 days',
        budget: '$320',
        price: 320,
        currency: 'USD',
        tags: ['food', 'culture', 'street-food', 'cooking'],
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1576185850777-7de1bb59068b?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Taste your way through Vietnam\'s incredible street food scene.',
        description: 'Embark on a culinary adventure through the flavors of Vietnam. From steaming bowls of pho to crispy bánh mì, learn the secrets of Vietnamese cuisine from local experts and home cooks.',
        itinerary: [
            { day: 1, title: 'Street Food Tour', description: 'Evening walking tour of Hanoi\'s best street food stalls' },
            { day: 2, title: 'Cooking Class', description: 'Morning market visit, hands-on cooking class, wine pairing lunch' },
            { day: 3, title: 'Market Trek', description: 'Hidden gem food trek, local family dinner experience' },
            { day: 4, title: 'Pho Masters', description: 'Pho-making workshop with a master chef, farewell dinner' }
        ],
        highlights: ['Street food', 'Cooking class', 'Market tours', 'Pho workshop'],
        included: ['3 nights boutique hotel', 'All food tours', 'Cooking classes', 'Market visits', 'Breakfast'],
        notIncluded: ['Flights', 'Drinks', 'Travel insurance'],
        rating: 4.7,
        reviewCount: 167,
        spotsAvailable: 8,
        maxSpots: 10,
        featured: false,
        difficulty: 'Easy',
        groupSize: { min: 2, max: 10 }
    },
    {
        tripId: 't9',
        title: 'Tuscany Wine Tour',
        location: 'Florence, Italy',
        duration: '3 days',
        budget: '€490',
        price: 490,
        currency: 'EUR',
        tags: ['wine', 'countryside', 'food', 'culture'],
        image: 'https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1523528283115-9bf9b1699245?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1441407613312-f3bf6b2c837e?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Sample finest wines and explore the rolling hills of Tuscany.',
        description: 'Savor the dolce vita in Tuscany\'s sun-drenched vineyards. Visit centuries-old wineries, learn from master vintners, and feast on farm-to-table cuisine amid some of Italy\'s most breathtaking landscapes.',
        itinerary: [
            { day: 1, title: 'Chianti Region', description: 'Drive through Chianti, visit two wineries, truffle lunch' },
            { day: 2, title: 'Wine & Cooking', description: 'Premium wine tasting, Tuscan cooking class, vineyard dinner' },
            { day: 3, title: 'Val d\'Orcia', description: 'UNESCO landscape tour, Brunello tasting, sunset in Montepulciano' }
        ],
        highlights: ['Wine tasting', 'Vineyard tours', 'Local cuisine', 'Cooking class'],
        included: ['2 nights agriturismo', 'All wine tastings', 'Cooking class', 'Lunches', 'Transport'],
        notIncluded: ['Flights', 'Dinners', 'Travel insurance'],
        rating: 4.8,
        reviewCount: 198,
        spotsAvailable: 6,
        maxSpots: 8,
        featured: false,
        difficulty: 'Easy',
        groupSize: { min: 2, max: 8 }
    },
    {
        tripId: 't10',
        title: 'Great Barrier Reef Dive',
        location: 'Cairns, Australia',
        duration: '3 days',
        budget: 'AU$750',
        price: 520,
        currency: 'USD',
        tags: ['diving', 'marine', 'adventure', 'nature'],
        image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Discover the underwater wonders of the Great Barrier Reef.',
        description: 'Dive into one of the world\'s natural wonders. Explore vibrant coral gardens, swim alongside sea turtles, and witness the incredible biodiversity of the Great Barrier Reef on this underwater adventure.',
        itinerary: [
            { day: 1, title: 'Reef Introduction', description: 'Diving certification or refresher, first reef dive' },
            { day: 2, title: 'Outer Reef', description: 'Two-tank dive at outer reef, snorkeling, marine biology talk' },
            { day: 3, title: 'Marine Expedition', description: 'Morning dive with marine biologist, underwater photography' }
        ],
        highlights: ['Coral reefs', 'Marine life', 'Scuba diving', 'Sea turtles'],
        included: ['2 nights liveaboard', 'All dives', 'Equipment', 'Marine biologist guide', 'Meals'],
        notIncluded: ['Flights', 'Dive certification', 'Photography package'],
        rating: 4.7,
        reviewCount: 156,
        spotsAvailable: 8,
        maxSpots: 12,
        featured: false,
        difficulty: 'Moderate',
        groupSize: { min: 2, max: 12 }
    },
    {
        tripId: 't11',
        title: 'Moroccan Desert Adventure',
        location: 'Marrakech, Morocco',
        duration: '4 days',
        budget: '€420',
        price: 420,
        currency: 'EUR',
        tags: ['desert', 'culture', 'adventure', 'camping'],
        image: 'https://images.unsplash.com/photo-1539650116455-251d93d5ce3d?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1539650116455-251d93d5ce3d?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1545167496-28be8f7a29e6?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Journey through the Sahara on camelback and sleep under the stars.',
        description: 'Experience the magic of Morocco from bustling medinas to silent dunes. Ride camels into the Sahara, sleep in a traditional desert camp, and discover the rich culture of the Berber people.',
        itinerary: [
            { day: 1, title: 'Marrakech Medina', description: 'Explore the souks, visit Bahia Palace, traditional hammam' },
            { day: 2, title: 'Atlas Crossing', description: 'Drive through Atlas Mountains, Aït Benhaddou, reach desert edge' },
            { day: 3, title: 'Desert Camp', description: 'Camel trek into Erg Chebbi, Berber music, sleep under stars' },
            { day: 4, title: 'Sunrise Trek', description: 'Sunrise from dunes, return camel ride, journey back' }
        ],
        highlights: ['Camel trek', 'Desert camping', 'Stargazing', 'Medina exploration'],
        included: ['3 nights accommodation', 'Camel trek', 'Desert camp', 'All transport', 'Meals'],
        notIncluded: ['Flights', 'Drinks', 'Hammam tips', 'Travel insurance'],
        rating: 4.6,
        reviewCount: 234,
        spotsAvailable: 10,
        maxSpots: 12,
        featured: false,
        difficulty: 'Moderate',
        groupSize: { min: 2, max: 12 }
    },
    {
        tripId: 't12',
        title: 'Swiss Alps Hiking',
        location: 'Zermatt, Switzerland',
        duration: '4 days',
        budget: 'CHF 890',
        price: 980,
        currency: 'USD',
        tags: ['hiking', 'mountains', 'nature', 'scenic'],
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1600&auto=format&fit=crop'
        ],
        summary: 'Trek through stunning Alpine landscapes with Matterhorn views.',
        description: 'Conquer iconic Alpine trails with the legendary Matterhorn as your backdrop. Hike past crystal lakes, traverse flower-filled meadows, and experience Swiss mountain hospitality at its finest.',
        itinerary: [
            { day: 1, title: 'Zermatt Arrival', description: 'Scenic train to Zermatt, warm-up hike, mountain village tour' },
            { day: 2, title: 'Hörnli Trail', description: 'Classic Matterhorn viewpoint trail, alpine hut lunch' },
            { day: 3, title: 'Five Lakes Walk', description: 'Iconic five lakes trail, each reflecting the Matterhorn' },
            { day: 4, title: 'Glacier Paradise', description: 'Cable car to Klein Matterhorn, glacier walk, farewell raclette' }
        ],
        highlights: ['Matterhorn views', 'Alpine lakes', 'Glacier visit', 'Mountain trains'],
        included: ['3 nights mountain hotel', 'Cable car passes', 'Hiking guide', 'Half-board meals'],
        notIncluded: ['Flights', 'Train to Zermatt', 'Lunch', 'Travel insurance'],
        rating: 4.8,
        reviewCount: 143,
        spotsAvailable: 6,
        maxSpots: 8,
        featured: true,
        difficulty: 'Moderate',
        groupSize: { min: 2, max: 8 }
    }
];

// Sample reviews for seeding
const sampleReviews = [
    {
        tripId: 't1',
        author: { name: 'Emma Wilson', email: 'emma@example.com' },
        rating: 5,
        title: 'Perfect Weekend Getaway!',
        content: 'The canal cruise was magical and cycling through the city was the best way to explore. Our guide knew all the hidden gems. The Van Gogh museum was a highlight!',
        travelDate: new Date('2025-09-15')
    },
    {
        tripId: 't2',
        author: { name: 'Michael Chen', email: 'michael@example.com' },
        rating: 5,
        title: 'Unforgettable Sunsets',
        content: 'Santorini exceeded all expectations. The sunset from Oia was absolutely breathtaking. The caldera cruise with wine tasting was pure bliss. Highly recommend!',
        travelDate: new Date('2025-08-20')
    },
    {
        tripId: 't3',
        author: { name: 'Sarah Johnson', email: 'sarah@example.com' },
        rating: 5,
        title: 'Cultural Paradise',
        content: 'The tea ceremony was a spiritual experience. Walking through the bamboo forest felt like stepping into another world. The ryokan stay was authentic and peaceful.',
        travelDate: new Date('2025-10-05')
    },
    {
        tripId: 't4',
        author: { name: 'David Park', email: 'david@example.com' },
        rating: 5,
        title: 'Life-Changing Trek',
        content: 'Challenging but absolutely worth every step. Seeing Machu Picchu at sunrise brought tears to my eyes. The guides were knowledgeable and supportive.',
        travelDate: new Date('2025-07-12')
    },
    {
        tripId: 't7',
        author: { name: 'Lisa Anderson', email: 'lisa@example.com' },
        rating: 5,
        title: 'Paradise Found',
        content: 'The overwater villa was a dream come true. Snorkeling with manta rays was incredible. Staff went above and beyond. Pure luxury and relaxation.',
        travelDate: new Date('2025-11-01')
    }
];

async function seedDatabase() {
    try {
        await connectDB();

        console.log('\n🌱 Starting database seed...\n');

        // Clear existing data
        await Trip.deleteMany({});
        await Review.deleteMany({});
        console.log('✓ Cleared existing data');

        // Insert trips
        const insertedTrips = await Trip.insertMany(trips);
        console.log(`✓ Inserted ${insertedTrips.length} trips`);

        // Insert reviews with trip references
        for (const review of sampleReviews) {
            const trip = await Trip.findOne({ tripId: review.tripId });
            if (trip) {
                const newReview = new Review({
                    ...review,
                    trip: trip._id,
                    author: {
                        ...review.author,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author.name)}&background=random`
                    }
                });
                await newReview.save();
            }
        }
        console.log(`✓ Inserted ${sampleReviews.length} sample reviews`);

        console.log('\n✅ Database seeded successfully!\n');
        console.log('📊 Summary:');
        console.log(`   Trips: ${trips.length}`);
        console.log(`   Reviews: ${sampleReviews.length}`);
        console.log(`   Featured: ${trips.filter(t => t.featured).length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

seedDatabase();
