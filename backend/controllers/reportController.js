import Task from "../models/Task.js";
import User from "../models/User.js";
import ExcelJS from "exceljs";

const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tasks Report');

        // Define columns
        worksheet.columns = [
            { header: 'Task ID', key: 'id', width: 25 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Priority', key: 'priority', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Assigned To', key: 'assignedTo', width: 30 },
            { header: 'Due Date', key: 'dueDate', width: 20 },
        ];

        // Add rows
        tasks.forEach(task => {
            const assignedTo = task.assignedTo.map(user => `${user.name} (${user.email})`).join(', ');
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                assignedTo: assignedTo || 'Unassigned',
                dueDate: task.dueDate.toISOString().split('T')[0],
            });
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=tasks_report.xlsx');

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } catch (error) {
        console.error('Error exporting tasks report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select('name email _id').lean();
        const userTasks = await Task.find().populate('assignedTo', 'name email _id');

        const userTaskMap = {};
        users.forEach(user => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0
            };
        } );

        userTasks.forEach(task => {
            if (task.assignedTo) {
                task.assignedTo.forEach(user => {
                    if (userTaskMap[user._id]) {
                        userTaskMap[user._id].taskCount += 1;
                        if (task.status === 'Pending') userTaskMap[user._id].pendingTasks += 1;
                        else if (task.status === 'In Progress') userTaskMap[user._id].inProgressTasks += 1;
                        else if (task.status === 'Completed') userTaskMap[user._id].completedTasks += 1;
                    }
                });
            }   
        });

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('User Task Report');

        // Define columns
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Total Assigned Tasks', key: 'taskCount', width: 15 },
            { header: 'Pending Tasks', key: 'pendingTasks', width: 15 },
            { header: 'In Progress Tasks', key: 'inProgressTasks', width: 15 },
            { header: 'Completed Tasks', key: 'completedTasks', width: 15 },
        ];

        // Add rows
        Object.values(userTaskMap).forEach((userData) => {
            worksheet.addRow(userData);
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=user_task_report.xlsx');

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } catch (error) {
        console.error('Error exporting users report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { exportTasksReport, exportUsersReport };