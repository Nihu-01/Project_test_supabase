const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 6000;


// Middleware to parse incoming requests with JSON payloads
app.use(bodyParser.json());

const { createClient } = require('@supabase/supabase-js');

// Replace 'YOUR_SUPABASE_URL' and 'YOUR_SUPABASE_PUBLIC_KEY' with your actual Supabase project URL and public key
const supabase = createClient('https://bsytzzcubnemqfxpvrzz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzeXR6emN1Ym5lbXFmeHB2cnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMxMzc5NzIsImV4cCI6MjAxODcxMzk3Mn0.7WnfRpAxc6D9PB7yz9IeAxs52QhoalUFRpHwTNDpRvY');

console.log("supabase client created:",supabase);
// In-memory array to store tasks
//let tasks = [
  //{ id: 1, title: 'Task 1' },
 // { id: 2, title: 'Task 2' },
//];

// CRUD operations

// Read all tasks
app.get('/tasks', async (req, res) => {
    // Fetch tasks from Supabase instead of using the in-memory array
    const { data: tasks, error } = await supabase.from('Tasks').select('*');
  
    if (error) {
      return res.status(500).json({ message: 'Error fetching tasks from Supabase' });
    }
  
    res.json(tasks);
  });
  
  // Read a specific task by ID
  app.get('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    const { data: task, error } = await supabase.from('Tasks').select('*').eq('id', taskId).single();
  
    if (error || !task) {
      return res.status(404).json({ message: 'Task not found' });
    }
  
    res.json(task);
  });
  
  // Create a new task
  // Create a new task
app.post('/tasks', async (req, res) => {
    try {
      const { title } = req.body;
      const { data: newTask, error } = await supabase.from('Tasks').insert([{ title }]);
  
      if (error) {
        return res.status(500).json({ message: 'Error creating a new task in Supabase' });
      }
  
      if (!newTask || newTask.length === 0) {
        return res.status(500).json({ message: 'New task is null or empty' });
      }
  
      res.status(201).json(newTask[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Update a task by ID
  app.put('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title } = req.body;
  
    const { data: updatedTask, error } = await supabase
      .from('Tasks')
      .update({ title })
      .eq('id', taskId);
  
    if (error || !updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
  
    res.json(updatedTask[0]);
  });
  
  // Delete a task by ID
  app.delete('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    const { error } = await supabase.from('Tasks').delete().eq('id', taskId);
  
    if (error) {
      return res.status(500).json({ message: 'Error deleting the task from Supabase' });
    }
  
    res.json({ message: 'Task deleted successfully' });
  });
  
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});



