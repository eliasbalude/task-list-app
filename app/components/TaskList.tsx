'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<
    'low' | 'medium' | 'high'
  >('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
    // Load tasks from local storage on component mount
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever tasks state changes
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskTitle.trim() !== '') {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTaskTitle.trim(),
          description: newTaskDescription.trim(),
          completed: false,
          priority: newTaskPriority,
        },
      ]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
    }
  };

  // Save tasks to local storage whenever tasks state changes
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // Remove a task from the list
  const removeTask = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const editTask = (id: number) => {
    setEditingTaskId(id);
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setNewTaskTitle(taskToEdit.title);
      setNewTaskDescription(taskToEdit.description);
      setNewTaskPriority(taskToEdit.priority);
    }
  };

  const updateTask = () => {
    if (editingTaskId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: newTaskTitle.trim(),
                description: newTaskDescription.trim(),
                priority: newTaskPriority,
              }
            : task,
        ),
      );
      setEditingTaskId(null);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const priorityColors = {
    low: 'bg-green-100 border-green-300',
    medium: 'bg-purple-100 border-purple-300',
    high: 'bg-orange-100 border-orange-300',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {editingTaskId !== null ? 'Edit Task' : 'Add New Task'}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task title"
            className="w-full p-2 border rounded"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <textarea
            placeholder="Task description"
            className="w-full p-2 border rounded"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <select
              value={newTaskPriority}
              onChange={(e) =>
                setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')
              }
              className="p-2 border rounded"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              onClick={editingTaskId !== null ? updateTask : addTask}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              {editingTaskId !== null ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-2">
        <button
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <AnimatePresence>
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`${priorityColors[task.priority]} border p-4 rounded-lg mb-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Checkbox to toggle task completion */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5"
                />
                {/* Task title with conditional styling based on completion status */}
                <h3
                  className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}
                >
                  {task.title}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {/* Expand/collapse button for task description */}
                <button
                  onClick={() =>
                    setExpandedTaskId(
                      expandedTaskId === task.id ? null : task.id,
                    )
                  }
                >
                  {expandedTaskId === task.id ? <ChevronUp /> : <ChevronDown />}
                </button>

                {/* Edit and delete buttons */}
                <button
                  onClick={() => editTask(task.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit2 />
                </button>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X />
                </button>
              </div>
            </div>

            {/* Task description, shown only if the task is expanded */}
            {expandedTaskId === task.id && (
              <p className="mt-2 text-gray-600">{task.description}</p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
