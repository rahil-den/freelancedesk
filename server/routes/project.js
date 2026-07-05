const router = require('express').Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, clientName, status } = req.body;
    const project = await Project.create({ 
      title, clientName, status, userId: req.user.id 
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;