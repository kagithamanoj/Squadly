import Event from '../models/Event.js';

// @desc    Get all events for user
// @route   GET /api/events
// @access  Private
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({
            $or: [
                { createdBy: req.user._id },
                { attendees: req.user._id }
            ]
        })
            .populate('createdBy', 'name avatar')
            .populate('attendees', 'name avatar')
            .sort({ date: 1 });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
export const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name avatar')
            .populate('attendees', 'name avatar');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
    try {
        const { title, date, time, location, category, description, image } = req.body;

        const event = new Event({
            title,
            date,
            time,
            location,
            category,
            description,
            image,
            createdBy: req.user._id,
            attendees: [req.user._id]
        });

        await event.save();
        await event.populate('createdBy', 'name avatar');
        await event.populate('attendees', 'name avatar');

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is the creator
        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { title, date, time, location, category, description, image } = req.body;

        event.title = title || event.title;
        event.date = date || event.date;
        event.time = time || event.time;
        event.location = location || event.location;
        event.category = category || event.category;
        event.description = description || event.description;
        event.image = image || event.image;

        await event.save();
        await event.populate('createdBy', 'name avatar');
        await event.populate('attendees', 'name avatar');

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is the creator
        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add attendee to event
// @route   POST /api/events/:id/attend
// @access  Private
export const attendEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already attending
        if (event.attendees.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already attending' });
        }

        event.attendees.push(req.user._id);
        await event.save();
        await event.populate('createdBy', 'name avatar');
        await event.populate('attendees', 'name avatar');

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove attendee from event
// @route   DELETE /api/events/:id/attend
// @access  Private
export const leaveEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.attendees = event.attendees.filter(
            attendee => attendee.toString() !== req.user._id.toString()
        );

        await event.save();
        await event.populate('createdBy', 'name avatar');
        await event.populate('attendees', 'name avatar');

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
