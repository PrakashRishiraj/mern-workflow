import Task from "../models/Task.js";

const getTasks = async (req, res) => {
    try {
        const {status} = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === 'admin') {
            tasks = await Task.find(filter).populate('assignedTo', 'name email profileImageUrl');
        }
        else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate('assignedTo', 'name email profileImageUrl');
        }

        // Add completed todoChecklist count for each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedTodoCount = task.todoChecklist.filter(item => item.completed).length;
                return {
                    ...task._doc,
                    completedTodoCount
                };
            })
        );

        // Status Summary counts
        const allTasks = await Task.countDocuments(req.user.role === 'admin' ? {} : { assignedTo: req.user._id });

        const pendingTasks = await Task.countDocuments({ 
            ...filter,
            status: 'Pending' ,
            ...(req.user.role === 'admin' ? {} : { assignedTo: req.user._id }), 
        });

        const inProgressTasks = await Task.countDocuments({ 
            ...filter,
            status: 'In Progress',
            ...(req.user.role === 'admin' ? {} : { assignedTo: req.user._id }), 
        });

        const completedTasks = await Task.countDocuments({ 
            ...filter,
            status: 'Completed',
            ...(req.user.role === 'admin' ? {} : { assignedTo: req.user._id }), 
        });

        res.status(200).json({
            tasks,
            statusSummary: {
                all: allTasks,
                pending: pendingTasks,
                inProgress: inProgressTasks,
                completed: completedTasks
            }
        });

    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description,priority, dueDate, assignedTo, attachments, todoChecklist} = req.body;

        if(!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: 'assignedTo must be an array of user IDs' });
        }

        console.log("📩 Received assignedTo:", assignedTo);

        const newTask = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments
        });

        res.status(201).json({message: 'Task created successfully', newTask});
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if(!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: 'assignedTo must be an array of user IDs' });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.status(200).json({ message: 'Task updated successfully', updatedTask }); 

    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTask = async (req, res) => {
    try {  
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }   
        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTaskChecklist = async (req, res) => {
    try {
       const {todoChecklist} = req.body;
       const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if(!task.assignedTo.some(userId => userId.toString() === req.user._id.toString()) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not assigned to this task' });
        }

        task.todoChecklist = todoChecklist; // Replace with updated checklist

        // Update progress based on completed checklist items
        const completedItems = todoChecklist.filter(item => item.completed).length;
        const totalItems = todoChecklist.length;
        task.progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

        // Auto-update status if all items are completed
        if (task.progress === 100) {
            task.status = 'Completed';
        } else if (task.progress > 0) {
            task.status = 'In Progress';
        } else {
            task.status = 'Pending';
        }

        await task.save();

        const updatedTask = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');

        res.status(200).json({ message: 'Task checklist updated successfully', task: updatedTask });
    } catch (error) {
        console.error('Error updating task checklist:', error);
        res.status(500).json({ message: 'Server error' });
    }  
};

const updateTaskStatus = async (req, res) => {
    try {
         const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const isAssigned = task.assignedTo.some(userId => userId.toString() === req.user._id.toString());

        if (!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not assigned to this task' });
        }

        task.status = req.body.status || task.status;

        if (task.status === 'Completed') {
            task.progress = 100;
            task.todoChecklist.forEach(item => item.completed = true);
        }

        await task.save();

        res.status(200).json({ message: 'Task checklist updated successfully', task });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getDashboardData = async (req, res) => {
    try {
        //Fetch Statistics for Dashboard
        const totalTasks = await Task.countDocuments({});
        const completedTasks = await Task.countDocuments({ status: 'Completed' });
        const pendingTasks = await Task.countDocuments({ status: 'Pending' });
        const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
        const overdueTasks = await Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: 'Completed' } });

        //Ensure all possible statuses are represented
        const taskStatuses = ['Pending', 'In Progress', 'Completed'];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]); 

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ''); // Remove spaces for response keys
            acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks; //Add total count to taskDistribution

        // Ensure all priority levels are represented
        const taskPriorities = ['Low', 'Medium', 'High'];
        const priorityDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = priorityDistributionRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        } , {});

        // Fetch recent 10 tasks
        const recentTasks = await Task.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title status priority dueDate createdAt');

        res.status(200).json({
            statistics: {
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        //Fetch user-specific task statistics
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: 'Completed' });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: 'Pending' });
        const inProgressTasks = await Task.countDocuments({ assignedTo: userId, status: 'In Progress' });
        const overdueTasks = await Task.countDocuments({ assignedTo: userId, dueDate: { $lt: new Date() }, status: { $ne: 'Completed' } });

        //Task distribution by status
        const taskStatuses = ['Pending', 'In Progress', 'Completed'];
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ''); // Remove spaces for response keys
            acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks; //Add total count to taskDistribution

        //Task distribution by priority
        const taskPriorities = ['Low', 'Medium', 'High'];
        const priorityDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = priorityDistributionRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        } , {});

        // Fetch recent 10 tasks assigned to user
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title status priority dueDate createdAt');

        res.status(200).json({
            statistics: {
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                overdueTasks
            },
            charts: {   
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks
        });
    } catch (error) {
        console.error('Error fetching user dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskChecklist,
    updateTaskStatus,
    getDashboardData,
    getUserDashboardData,
};