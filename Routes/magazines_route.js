const express = require('express');
const router = express.Router();
const Magazines = require('../models/Magazines');
const Admins = require('../models/Admins'); // Assuming you have an Admins model

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  const { userId } = req.body; // Adjust this to where you get your userId from, e.g., from req.user if using a JWT

  const admin = await Admins.findByPk(userId);
  if (!admin) {
    return res.status(403).json({ message: 'Forbidden: Only admins can perform this action' });
  }
  next();
};
// Route to get all magazines for the current month only
router.get('/magazines', async (req, res) => {
    try {
        // Calculate the start and end of the current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0); // Set day to 0 to get last day of the month

        // Fetch magazines within the current month
        const magazines = await Magazines.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            },
        });

        res.json(magazines);
    } catch (error) {
        console.error('Error fetching magazines:', error);
        res.status(500).json({ message: 'Failed to fetch magazines' });
    }
});
// Route to get a magazine by ID search 
router.get('/magazines/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const magazine = await Magazines.findByPk(id);
    if (!magazine) {
      return res.status(404).json({ message: 'Magazine not found' });
    }
    res.json(magazine);
  } catch (error) {
    console.error('Error fetching magazine:', error);
    res.status(500).json({ message: 'Failed to fetch magazine' });
  }
});

// Route to create a new magazine (only admins)
router.post('/magazines', isAdmin, async (req, res) => {
  const { id, imageFile, owner, title, description, likes, isPublished, createdAt } = req.body;

  try {
    const newMagazine = await Magazines.create({
      id,
      imageFile,
      owner,
      title,
      description,
      likes,
      isPublished,
      createdAt: createdAt || new Date()
    });

    res.status(201).json(newMagazine);
  } catch (error) {
    console.error('Error creating magazine:', error);
    res.status(500).json({ message: 'Failed to create magazine' });
  }
});

// Route to update a magazine (only admins)
router.put('/magazines/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const magazine = await Magazines.findByPk(id);
    if (!magazine) {
      return res.status(404).json({ message: 'Magazine not found' });
    }

    await magazine.update(updatedData);
    res.json({ message: 'Magazine updated successfully', magazine });
  } catch (error) {
    console.error('Error updating magazine:', error);
    res.status(500).json({ message: 'Failed to update magazine' });
  }
});

// Route to delete a magazine (only admins)
router.delete('/magazines/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const magazine = await Magazines.findByPk(id);
    if (!magazine) {
      return res.status(404).json({ message: 'Magazine not found' });
    }

    await magazine.destroy();
    res.json({ message: 'Magazine deleted successfully' });
  } catch (error) {
    console.error('Error deleting magazine:', error);
    res.status(500).json({ message: 'Failed to delete magazine' });
  }
});

module.exports = router;
