//index.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { DublinCore } = require('../models/User');

// Serve the main page of the app
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
      if (req.user.role === 'admin') {
          // Correct the path according to your directory structure
          res.sendFile(path.join(__dirname, '..', 'views', 'admin_dashboard.html'));
      } else {
        // Serve student dashboard view
        res.sendFile(path.join(__dirname, '..', 'views', 'student_dashboard.html'));
      }
  } else {
      res.redirect('/login');
  }
});

router.get('/facts', (req, res) => {
    // Assuming authentication is not required to view facts
    res.sendFile(path.join(__dirname, '..', 'views', 'facts.html'));
});

// Serve the Michael Cooley collection page
router.get('/michaelcooleycollection', (req, res) => {
    // Assuming authentication is not required to view the collection
    res.sendFile(path.join(__dirname, '..', 'views', 'michaelcooleycollection.html'));
});

// Serve the Michael Cooley collection page
router.get('/dublinCoreIndex', (req, res) => {
    // Assuming authentication is not required to view the collection
    res.sendFile(path.join(__dirname, '..', 'views', 'dublinCoreIndex.html'));
});

router.get('/api/collection', async (req, res) => {
  try {
      const entries = await DublinCore.find(); // Fetches all entries from MongoDB
      res.json(entries); // Sends the entries as JSON to the client
  } catch (err) {
      console.error('Failed to get collection entries:', err);
      res.status(500).send('Internal Server Error');
  }
});

//DublinCoreMetadata
router.post('/submit-metadata', async (req, res) => {
    try {
      // Create a new object that will contain the cleaned-up field names
      const metadataFields = {};
      
      // Iterate over the keys in the request body
      for (const key of Object.keys(req.body)) {
        // Remove the 'dc:' and 'dcterms:' prefixes and assign the value to the new object
        const cleanKey = key.replace(/^dc:|dcterms:/, '');
        metadataFields[cleanKey] = req.body[key];
      }
      
      // Now create the DublinCore document with the cleaned-up object
      const metadata = new DublinCore(metadataFields);
      await metadata.save();
      res.status(201).json(metadata);
    } catch (error) {
      console.error('Error submitting metadata:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

module.exports = router;
