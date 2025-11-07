import React from 'react'
import moment from 'moment'

const TaskListTable = ({ tableData = [] }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-600/40'
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-600/40'
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400 border border-blue-600/40'
      default:
        return 'bg-slate-700/30 text-slate-400 border border-slate-600/30'
    }
  }

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border border-red-600/40'
      case 'Medium':
        return 'bg-orange-500/20 text-orange-400 border border-orange-600/40'
      case 'Low':
        return 'bg-green-500/20 text-green-400 border border-green-600/40'
      default:
        return 'bg-slate-700/30 text-slate-400 border border-slate-600/30'
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/40 bg-linear-to-b from-slate-900 to-slate-950 shadow-md shadow-indigo-900/30">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="bg-linear-to-r from-slate-800 to-indigo-950 text-slate-200 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Priority</th>
            <th className="px-6 py-3">Created On</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((task) => (
              <tr
                key={task._id}
                className="border-t border-slate-800/40 hover:bg-slate-800/30 transition-all duration-200"
              >
                <td className="px-6 py-3 font-medium text-slate-100">
                  {task.title}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusBadgeColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getPriorityBadgeColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-400">
                  {task.createdAt
                    ? moment(task.createdAt).format('Do MMM YYYY')
                    : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="text-center py-6 text-slate-500 italic"
              >
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TaskListTable
