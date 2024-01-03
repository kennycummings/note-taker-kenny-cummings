const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware to handle JSON data
app.use(express.json());

// Serve static assets
app.use(express.static('public'));

// Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  try {
    const newNote = req.body;
    newNote.id = generateUniqueId();

    const notes = getNotes();
    notes.unshift(newNote);

    saveNotes(notes);

    res.json(newNote);
  } catch (error) {
    console.error('Error in /api/notes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/notes/:id', (req, res) => {
  removeNote(req.params.id)
    .then(() => res.json({ ok: true }))
    .catch((err) => res.status(500).json(err));
});

// Default route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Helper functions
const getNotes = () => {
  const data = fs.readFileSync(path.join(__dirname, 'db/db.json'), 'utf8');
  return JSON.parse(data);
};

const saveNotes = (notes) => {
  fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), 'utf8');
};

const removeNote=(id) => {
  // Get all notes, remove the note with the given id, write the filtered notes
  return getNotes()
    .then((notes) => notes.filter((note) => note.id !== id))
    .then((filteredNotes) => saveNotes(filteredNotes));
}

const generateUniqueId = () => {
  return Date.now().toString();
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
