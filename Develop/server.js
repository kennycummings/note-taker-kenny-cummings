const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
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
  const newNote = req.body;
  newNote.id = generateUniqueId();

  const notes = getNotes();
  notes.push(newNote);
  saveNotes(notes);

  res.json(newNote);

fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes))
  
});

// Default route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Helper functions
const getNotes = () => {
  const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
  return JSON.parse(data);
};

const saveNotes = (notes) => {
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes), 'utf8');
};

const generateUniqueId = () => {
  return Date.now().toString();
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
