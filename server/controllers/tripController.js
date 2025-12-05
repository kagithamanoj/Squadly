import Trip from '../models/Trip.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailService.js';
import fs from 'fs';
import path from 'path';

// Dynamic Image Assignment
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
    'El Paso': 'https://images.unsplash.com/photo-1627932042263-1e7c273854e4?auto=format&fit=crop&w=1200&q=80',
    'Nashville': 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&w=1200&q=80',
    'Detroit': 'https://images.unsplash.com/photo-1610996123485-611c03507d6f?auto=format&fit=crop&w=1200&q=80',
    'Oklahoma City': 'https://images.unsplash.com/photo-1619623637172-e07503923328?auto=format&fit=crop&w=1200&q=80',
    'Portland': 'https://images.unsplash.com/photo-1541457523724-95f54f7740cc?auto=format&fit=crop&w=1200&q=80',
    'Las Vegas': 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=1200&q=80',
    'Memphis': 'https://images.unsplash.com/photo-1569931727733-4f4337223f82?auto=format&fit=crop&w=1200&q=80',
    'Louisville': 'https://images.unsplash.com/photo-1579705194883-40135d94346b?auto=format&fit=crop&w=1200&q=80',
    'Baltimore': 'https://images.unsplash.com/photo-1582297273016-167817e94479?auto=format&fit=crop&w=1200&q=80',
    'Milwaukee': 'https://images.unsplash.com/photo-1625078716328-c70502177558?auto=format&fit=crop&w=1200&q=80',
    'Albuquerque': 'https://images.unsplash.com/photo-1565671193427-e89290f38f3e?auto=format&fit=crop&w=1200&q=80',
    'Tucson': 'https://images.unsplash.com/photo-1558484446-95d68189bdcd?auto=format&fit=crop&w=1200&q=80',
    'Fresno': 'https://images.unsplash.com/photo-1568219656418-15c752d53891?auto=format&fit=crop&w=1200&q=80',
    'Sacramento': 'https://images.unsplash.com/photo-1572629471380-63287f39564e?auto=format&fit=crop&w=1200&q=80',
    'Kansas City': 'https://images.unsplash.com/photo-1528291954423-c0c71c12baeb?auto=format&fit=crop&w=1200&q=80',
    'Mesa': 'https://images.unsplash.com/photo-1523430410476-0185cb1f6ff9?auto=format&fit=crop&w=1200&q=80',
    'Atlanta': 'https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?auto=format&fit=crop&w=1200&q=80',
    'Omaha': 'https://images.unsplash.com/photo-1569230516306-5a8cb5586399?auto=format&fit=crop&w=1200&q=80',
    'Colorado Springs': 'https://images.unsplash.com/photo-1571302963762-096672e18580?auto=format&fit=crop&w=1200&q=80',
    'Raleigh': 'https://images.unsplash.com/photo-1596567181723-d2b6d6b65146?auto=format&fit=crop&w=1200&q=80',
    'Miami': 'https://images.unsplash.com/photo-1514214246283-efbb2752a780?auto=format&fit=crop&w=1200&q=80',
    'Long Beach': 'https://images.unsplash.com/photo-1565896311069-b105080747c6?auto=format&fit=crop&w=1200&q=80',
    'Virginia Beach': 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=1200&q=80',
    'Oakland': 'https://images.unsplash.com/photo-1597262243042-42f782364432?auto=format&fit=crop&w=1200&q=80',
    'Minneapolis': 'https://images.unsplash.com/photo-1533633354729-79c7a7779262?auto=format&fit=crop&w=1200&q=80',
    'Tulsa': 'https://images.unsplash.com/photo-1574459633312-75535497447c?auto=format&fit=crop&w=1200&q=80',
    'Arlington': 'https://images.unsplash.com/photo-1599582106038-f8b812f369b3?auto=format&fit=crop&w=1200&q=80',
    'Tampa': 'https://images.unsplash.com/photo-1572569941904-741083141151?auto=format&fit=crop&w=1200&q=80',
    'New Orleans': 'https://images.unsplash.com/photo-1571893544028-06b07af6ed28?auto=format&fit=crop&w=1200&q=80',
    'Wichita': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
    'Cleveland': 'https://images.unsplash.com/photo-1588611910602-0c0350614b4c?auto=format&fit=crop&w=1200&q=80',
    'Bakersfield': 'https://images.unsplash.com/photo-1568407431368-5ea1a07a4d1b?auto=format&fit=crop&w=1200&q=80',
    'Aurora': 'https://images.unsplash.com/photo-1534234828563-0239ecda1364?auto=format&fit=crop&w=1200&q=80',
    'Anaheim': 'https://images.unsplash.com/photo-1595967783075-316372594a63?auto=format&fit=crop&w=1200&q=80',
    'Honolulu': 'https://images.unsplash.com/photo-1542259548-3b1a3b0092bb?auto=format&fit=crop&w=1200&q=80',
    'Santa Ana': 'https://images.unsplash.com/photo-1596138252452-4500992051a8?auto=format&fit=crop&w=1200&q=80',
    'Riverside': 'https://images.unsplash.com/photo-1595239541172-520d963504d6?auto=format&fit=crop&w=1200&q=80',
    'Corpus Christi': 'https://images.unsplash.com/photo-1584285418504-081d5b71949f?auto=format&fit=crop&w=1200&q=80',
    'Lexington': 'https://images.unsplash.com/photo-1581262177000-8139a463e531?auto=format&fit=crop&w=1200&q=80',
    'Henderson': 'https://images.unsplash.com/photo-1548685913-fe6678babe8d?auto=format&fit=crop&w=1200&q=80',
    'Stockton': 'https://images.unsplash.com/photo-1572206912757-211a8c75439e?auto=format&fit=crop&w=1200&q=80',
    'Saint Paul': 'https://images.unsplash.com/photo-1617122193489-63465f8c460f?auto=format&fit=crop&w=1200&q=80',
    'Cincinnati': 'https://images.unsplash.com/photo-1592860956983-95517520e728?auto=format&fit=crop&w=1200&q=80',
    'St. Louis': 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1200&q=80',
    'Pittsburgh': 'https://images.unsplash.com/photo-1568551166526-880424c8e487?auto=format&fit=crop&w=1200&q=80',
    'Greensboro': 'https://images.unsplash.com/photo-1620662736427-b8a198f52a4d?auto=format&fit=crop&w=1200&q=80',
    'Lincoln': 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80',
    'Anchorage': 'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&w=1200&q=80',
    'Plano': 'https://images.unsplash.com/photo-1578922746465-3a80a228f28c?auto=format&fit=crop&w=1200&q=80',
    'Orlando': 'https://images.unsplash.com/photo-1597466599360-3b9775841aec?auto=format&fit=crop&w=1200&q=80',
    'Irvine': 'https://images.unsplash.com/photo-1605218427368-35b0f996963f?auto=format&fit=crop&w=1200&q=80',
    'Newark': 'https://images.unsplash.com/photo-1592930954854-7d07c82aa77c?auto=format&fit=crop&w=1200&q=80',
    'Durham': 'https://images.unsplash.com/photo-1598812273937-340d582183a6?auto=format&fit=crop&w=1200&q=80',
    'Chula Vista': 'https://images.unsplash.com/photo-1595239541172-520d963504d6?auto=format&fit=crop&w=1200&q=80',
    'Toledo': 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1200&q=80',
    'Fort Wayne': 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1200&q=80',
    'St. Petersburg': 'https://images.unsplash.com/photo-1566363531558-75a54645e78c?auto=format&fit=crop&w=1200&q=80',
    'Laredo': 'https://images.unsplash.com/photo-1584285418504-081d5b71949f?auto=format&fit=crop&w=1200&q=80',
    'Jersey City': 'https://images.unsplash.com/photo-1548504769-900b70ed122e?auto=format&fit=crop&w=1200&q=80',
    'Chandler': 'https://images.unsplash.com/photo-1523430410476-0185cb1f6ff9?auto=format&fit=crop&w=1200&q=80',
    'Madison': 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80',
    'Lubbock': 'https://images.unsplash.com/photo-1584285418504-081d5b71949f?auto=format&fit=crop&w=1200&q=80',
    'Scottsdale': 'https://images.unsplash.com/photo-1562920616-0b61e0c77113?auto=format&fit=crop&w=1200&q=80',
    'Reno': 'https://images.unsplash.com/photo-1557333610-900e1e860b70?auto=format&fit=crop&w=1200&q=80',
    'Buffalo': 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1200&q=80',
    'Gilbert': 'https://images.unsplash.com/photo-1523430410476-0185cb1f6ff9?auto=format&fit=crop&w=1200&q=80',
    'Glendale': 'https://images.unsplash.com/photo-1523430410476-0185cb1f6ff9?auto=format&fit=crop&w=1200&q=80',
    'North Las Vegas': 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=1200&q=80',
    'Winston-Salem': 'https://images.unsplash.com/photo-1596567181723-d2b6d6b65146?auto=format&fit=crop&w=1200&q=80',
    'Chesapeake': 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=1200&q=80',
    'Norfolk': 'https://images.unsplash.com/photo-1589483232738-46c4231a71b9?auto=format&fit=crop&w=1200&q=80',
    'Fremont': 'https://images.unsplash.com/photo-1585218356057-da5258203d57?auto=format&fit=crop&w=1200&q=80',
    'Garland': 'https://images.unsplash.com/photo-1570514833906-43698059530e?auto=format&fit=crop&w=1200&q=80',
    'Irving': 'https://images.unsplash.com/photo-1570514833906-43698059530e?auto=format&fit=crop&w=1200&q=80',
    'Hialeah': 'https://images.unsplash.com/photo-1514214246283-efbb2752a780?auto=format&fit=crop&w=1200&q=80',
    'Spokane': 'https://images.unsplash.com/photo-1570654621852-9dd24b71946d?auto=format&fit=crop&w=1200&q=80',
    'Richmond': 'https://images.unsplash.com/photo-1575540325855-006022a7436b?auto=format&fit=crop&w=1200&q=80',
    'Boise': 'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?auto=format&fit=crop&w=1200&q=80',
    'Baton Rouge': 'https://images.unsplash.com/photo-1571893544028-06b07af6ed28?auto=format&fit=crop&w=1200&q=80',
    'Des Moines': 'https://images.unsplash.com/photo-1585155967849-91c73653ace6?auto=format&fit=crop&w=1200&q=80',
    'Salt Lake City': 'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?auto=format&fit=crop&w=1200&q=80',
    'Birmingham': 'https://images.unsplash.com/photo-1574459633312-75535497447c?auto=format&fit=crop&w=1200&q=80',
    'Little Rock': 'https://images.unsplash.com/photo-1574459633312-75535497447c?auto=format&fit=crop&w=1200&q=80',
    'Charleston': 'https://images.unsplash.com/photo-1582297273016-167817e94479?auto=format&fit=crop&w=1200&q=80',
    'Providence': 'https://images.unsplash.com/photo-1506197061617-7f5c0b093236?auto=format&fit=crop&w=1200&q=80',
    'Hartford': 'https://images.unsplash.com/photo-1506197061617-7f5c0b093236?auto=format&fit=crop&w=1200&q=80',
    'Burlington': 'https://images.unsplash.com/photo-1506197061617-7f5c0b093236?auto=format&fit=crop&w=1200&q=80',

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

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req, res) => {
    try {
        console.log('Creating trip with body:', req.body);
        console.log('User:', req.user._id);

        const { name, origin, destination, startDate, endDate, budget } = req.body;

        // Extract city name from destination (e.g., "New York (JFK)" -> "New York")
        const cityMatch = destination.split('(')[0].trim();
        const coverImage = CITY_IMAGES[cityMatch] || DEFAULT_IMAGE;

        const tripData = {
            name,
            origin,
            destination,
            budget,
            coverImage, // Add the cover image
            createdBy: req.user._id,
            travelers: [req.user._id]
        };

        if (startDate) tripData.startDate = startDate;
        if (endDate) tripData.endDate = endDate;

        console.log('Trip data to save:', tripData);

        const trip = await Trip.create(tripData);
        console.log('Trip created successfully:', trip._id);

        res.status(201).json(trip);
    } catch (error) {
        console.error('Error creating trip:', error);

        // Log to file
        const logPath = path.join(process.cwd(), 'server_error.log');
        const logMessage = `${new Date().toISOString()} - Error creating trip: ${error.message}\nStack: ${error.stack}\n\n`;
        fs.appendFileSync(logPath, logMessage);

        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// @desc    Get all trips for user
// @route   GET /api/trips
// @access  Private
export const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({
            travelers: req.user._id
        }).sort({ startDate: 1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
export const getTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate('createdBy', 'name email avatar')
            .populate('travelers', 'name email avatar')
            .populate('chat.sender', 'name avatar');

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check if user is part of the trip
        const isTraveler = trip.travelers.some(t => t._id.toString() === req.user._id.toString());
        if (!isTraveler) {
            return res.status(403).json({ message: 'Not authorized to view this trip' });
        }

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Invite traveler to trip
// @route   POST /api/trips/:id/invite
// @access  Private
export const inviteTraveler = async (req, res) => {
    try {
        const { email } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check if user is authorized (creator or existing traveler)
        const isAuthorized = trip.createdBy.toString() === req.user._id.toString() ||
            trip.travelers.includes(req.user._id);

        if (!isAuthorized) {
            return res.status(401).json({ message: 'Not authorized to invite travelers' });
        }

        // Check if already invited
        const alreadyInvited = trip.invites.find(invite => invite.email === email);
        if (alreadyInvited) {
            return res.status(400).json({ message: 'User already invited' });
        }

        trip.invites.push({ email, status: 'pending' });
        await trip.save();

        // Send Email Notification
        const inviteLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/trips/${trip._id}/join?email=${email}`;
        await sendEmail({
            to: email,
            subject: `You've been invited to join ${trip.name} on Squadly!`,
            html: `
                <h1>You're invited!</h1>
                <p>${req.user.name} has invited you to join the trip <strong>${trip.name}</strong>.</p>
                <p>Click the link below to join:</p>
                <a href="${inviteLink}">${inviteLink}</a>
                <p>If you don't have an account, you'll be asked to sign up first.</p>
            `
        });

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel invite
// @route   DELETE /api/trips/:id/invite/:email
// @access  Private
export const cancelInvite = async (req, res) => {
    try {
        const { email } = req.params;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Only creator can cancel invites
        if (trip.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to cancel invites' });
        }

        trip.invites = trip.invites.filter(invite => invite.email !== email);
        await trip.save();

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add activity to itinerary
// @route   POST /api/trips/:id/itinerary
// @access  Private
export const addActivity = async (req, res) => {
    try {
        const { date, type, description, location, startTime, endTime, cost, notes } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check if user is authorized (traveler or creator)
        const isAuthorized = trip.travelers.includes(req.user._id) || trip.createdBy.toString() === req.user._id.toString();
        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Find the day in itinerary
        const activityDate = new Date(date);
        let day = trip.itinerary.find(d =>
            new Date(d.date).toDateString() === activityDate.toDateString()
        );

        // If day doesn't exist, create it
        if (!day) {
            trip.itinerary.push({
                date: activityDate,
                activities: []
            });
            day = trip.itinerary[trip.itinerary.length - 1];
        }

        // Add activity
        day.activities.push({
            type,
            description,
            location,
            startTime,
            endTime,
            cost,
            notes
        });

        // Sort activities by start time
        day.activities.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update trip details
// @route   PUT /api/trips/:id
// @access  Private
export const updateTrip = async (req, res) => {
    try {
        const { name, origin, destination, startDate, endDate, budget } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check authorization (only creator can update)
        if (trip.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this trip' });
        }

        trip.name = name || trip.name;
        trip.origin = origin || trip.origin;

        // If destination changes, update the image
        if (destination && destination !== trip.destination) {
            trip.destination = destination;
            const cityMatch = destination.split('(')[0].trim();
            trip.coverImage = CITY_IMAGES[cityMatch] || DEFAULT_IMAGE;
        } else if (!trip.coverImage && trip.destination) {
            // If no image exists (legacy trip), try to assign one based on existing destination
            const cityMatch = trip.destination.split('(')[0].trim();
            trip.coverImage = CITY_IMAGES[cityMatch] || DEFAULT_IMAGE;
        }

        trip.startDate = startDate || trip.startDate;
        trip.endDate = endDate || trip.endDate;
        trip.budget = budget || trip.budget;

        const updatedTrip = await trip.save();
        res.json(updatedTrip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check authorization (only creator can delete)
        if (trip.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this trip' });
        }

        await trip.deleteOne();
        res.json({ message: 'Trip removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update activity
// @route   PUT /api/trips/:id/itinerary/:activityId
// @access  Private
export const updateActivity = async (req, res) => {
    try {
        const { date, type, description, location, startTime, endTime, cost, notes } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check authorization
        const isAuthorized = trip.travelers.includes(req.user._id) || trip.createdBy.toString() === req.user._id.toString();
        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Find the activity
        let activityFound = false;
        for (let day of trip.itinerary) {
            const activity = day.activities.id(req.params.activityId);
            if (activity) {
                activity.type = type || activity.type;
                activity.description = description || activity.description;
                activity.location = location || activity.location;
                activity.startTime = startTime || activity.startTime;
                activity.endTime = endTime || activity.endTime;
                activity.cost = cost !== undefined ? cost : activity.cost;
                activity.notes = notes !== undefined ? notes : activity.notes;

                // If date changed, we might need to move it (complex, for now assume date doesn't change or handle simply)
                // For simplicity in this iteration, we update fields in place. 
                // If date changes, it's better to delete and re-add, but let's see if we can support it.

                activityFound = true;
                break;
            }
        }

        if (!activityFound) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete activity
// @route   DELETE /api/trips/:id/itinerary/:activityId
// @access  Private
export const deleteActivity = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check authorization
        const isAuthorized = trip.travelers.includes(req.user._id) || trip.createdBy.toString() === req.user._id.toString();
        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Remove activity
        let activityRemoved = false;
        trip.itinerary.forEach(day => {
            if (day.activities.id(req.params.activityId)) {
                day.activities.pull(req.params.activityId);
                activityRemoved = true;
            }
        });

        if (!activityRemoved) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send chat message
// @route   POST /api/trips/:id/chat
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check if user is part of the trip
        const isTraveler = trip.travelers.some(id => id.toString() === req.user._id.toString()) ||
            trip.createdBy.toString() === req.user._id.toString(); // Fixed: creator -> createdBy

        if (!isTraveler) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        trip.chat.push({
            sender: req.user._id,
            message
        });

        await trip.save();

        // Return the populated chat message
        const populatedTrip = await Trip.findById(req.params.id).populate('chat.sender', 'name avatar');
        const newMessage = populatedTrip.chat[populatedTrip.chat.length - 1];

        res.json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// @desc    Update packing list item
// @route   PUT /api/trips/:id/packing
// @access  Private
export const updatePackingItem = async (req, res) => {
    try {
        const { item, category, isChecked, assignedTo, itemId } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check authorization
        const isAuthorized = trip.travelers.includes(req.user._id) || trip.createdBy.toString() === req.user._id.toString();
        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (itemId) {
            // Update existing item
            const packingItem = trip.packingList.id(itemId);
            if (packingItem) {
                if (item !== undefined) packingItem.item = item;
                if (category !== undefined) packingItem.category = category;
                if (isChecked !== undefined) packingItem.isChecked = isChecked;
                if (assignedTo !== undefined) packingItem.assignedTo = assignedTo;
            }
        } else {
            // Add new item
            trip.packingList.push({
                item,
                category: category || 'General',
                isChecked: false,
                assignedTo
            });
        }

        await trip.save();

        // Return populated trip
        const populatedTrip = await Trip.findById(req.params.id)
            .populate('packingList.assignedTo', 'name avatar')
            .populate('travelers', 'name avatar email');

        res.json(populatedTrip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete packing list item
// @route   DELETE /api/trips/:id/packing/:itemId
// @access  Private
export const deletePackingItem = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check authorization
        const isAuthorized = trip.travelers.includes(req.user._id) || trip.createdBy.toString() === req.user._id.toString();
        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        trip.packingList.pull(req.params.itemId);
        await trip.save();

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate trip pass
// @route   POST /api/trips/:id/generate-pass
// @access  Private
export const generateTripPass = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Only creator can generate pass
        if (trip.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { permissions, expiryDays } = req.body;

        // Generate unique code
        const passCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        trip.tripPass = {
            code: passCode,
            isActive: true,
            expiresAt: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
            permissions: permissions || 'view_only',
            usageCount: 0
        };

        await trip.save();

        res.json({ passCode, expiresAt: trip.tripPass.expiresAt });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join trip with pass
// @route   POST /api/trips/join/:passCode
// @access  Private
export const joinTripWithPass = async (req, res) => {
    try {
        const trip = await Trip.findOne({ 'tripPass.code': req.params.passCode });

        if (!trip) {
            return res.status(404).json({ message: 'Invalid trip pass' });
        }

        if (!trip.tripPass.isActive) {
            return res.status(403).json({ message: 'Trip pass is inactive' });
        }

        if (new Date() > trip.tripPass.expiresAt) {
            return res.status(403).json({ message: 'Trip pass has expired' });
        }

        // Add user to travelers if not already added
        if (!trip.travelers.includes(req.user._id)) {
            trip.travelers.push(req.user._id);
            trip.tripPass.usageCount += 1;
            await trip.save();
        }

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
