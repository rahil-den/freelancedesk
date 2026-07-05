const router = require('express').Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

router.get('/:projectId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ 
      projectId: req.params.projectId, 
      userId: req.user.id 
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, dueDate, projectId } = req.body;
    const task = await Task.create({ 
      title, dueDate, projectId, userId: req.user.id 
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;