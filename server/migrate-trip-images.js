import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Trip from './models/Trip.js';

// Load environment variables
dotenv.config();

// Dynamic Image Assignment - Same as in tripController.js
const CITY_IMAGES = {
    // Major US Cities
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    'Los Angeles': 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=1200&q=80',
    'Chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1200&q=80',
    'Houston': 'https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?auto=format&fit=crop&w=1200&q=80',
    'Phoenix': 'https://images.unsplash.com/photo-1521320226546-87b106956014?auto=format&fit=crop&w=1200&q=80',
    'Philadelphia': 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?auto=format&fit=crop&w=1200&q=80',
    'San Antonio': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=1200&q=80',
    'San Diego': 'https://images.unsplash.com/photo-1503891450247-ee5f8ec46dc3?auto=format&fit=crop&w=1200&q=80',
    'Dallas': 'https://images.unsplash.com/photo-1570514833906-43698059530e?auto=format&fit=crop&w=1200&q=80',
    'San Jose': 'https://images.unsplash.com/photo-1585218356057-da5258203d57?auto=format&fit=crop&w=1200&q=80',
    'Austin': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=1200&q=80',
    'Jacksonville': 'https://images.unsplash.com/photo-1585155967849-91c73653ace6?auto=format&fit=crop&w=1200&q=80',
    'Fort Worth': 'https://images.unsplash.com/photo-1595867865413-f9333917d23d?auto=format&fit=crop&w=1200&q=80',
    'Columbus': 'https://images.unsplash.com/photo-1604071570776-651664278c5c?auto=format&fit=crop&w=1200&q=80',
    'Charlotte': 'https://images.unsplash.com/photo-1597040663442-871b782b3a72?auto=format&fit=crop&w=1200&q=80',
    'San Francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
    'Indianapolis': 'https://images.unsplash.com/photo-1628623726983-d34341951555?auto=format&fit=crop&w=1200&q=80',
    'Seattle': 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?auto=format&fit=crop&w=1200&q=80',
    'Denver': 'https://images.unsplash.com/photo-1620215769228-56743132a676?auto=format&fit=crop&w=1200&q=80',
    'Washington': 'https://images.unsplash.com/photo-1617581629397-a72507c3de9e?auto=format&fit=crop&w=1200&q=80',
    'Boston': 'https://images.unsplash.com/photo-1506197061617-7f5c0b093236?auto=format&fit=crop&w=1200&q=80',
    'Nashville': 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&w=1200&q=80',
    'Portland': 'https://images.unsplash.com/photo-1541457523724-95f54f7740cc?auto=format&fit=crop&w=1200&q=80',
    'Las Vegas': 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=1200&q=80',
    'Miami': 'https://images.unsplash.com/photo-1514214246283-efbb2752a780?auto=format&fit=crop&w=1200&q=80',
    'Atlanta': 'https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?auto=format&fit=crop&w=1200&q=80',
    'Orlando': 'https://images.unsplash.com/photo-1597466599360-3b9775841aec?auto=format&fit=crop&w=1200&q=80',
    'Honolulu': 'https://images.unsplash.com/photo-1542259548-3b1a3b0092bb?auto=format&fit=crop&w=1200&q=80',
    // International
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea936a7d486?auto=format&fit=crop&w=1200&q=80',
    'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    'Amsterdam': 'https://images.unsplash.com/photo-1512470876302-687da745313d?auto=format&fit=crop&w=1200&q=80'
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80';

async function migrateTripImages() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/squadly');
        console.log('Connected to MongoDB');

        // Find all trips without coverImage
        const trips = await Trip.find({ $or: [{ coverImage: null }, { coverImage: { $exists: false } }] });
        console.log(`Found ${trips.length} trips without cover images`);

        let updated = 0;
        for (const trip of trips) {
            // Extract city name from destination
            const cityMatch = trip.destination.split('(')[0].trim();
            const coverImage = CITY_IMAGES[cityMatch] || DEFAULT_IMAGE;

            // Update the trip
            trip.coverImage = coverImage;
            await trip.save();
            updated++;
            console.log(`Updated trip "${trip.name}" with image for ${cityMatch}`);
        }

        console.log(`\n✅ Migration complete! Updated ${updated} trips.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateTripImages();
