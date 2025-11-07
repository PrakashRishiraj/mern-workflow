export const BASE_URL = "http://localhost:5001/api";

export const API_PATHS = {
    AUTH: {
        REGISTER: `/auth/register`,
        LOGIN: `/auth/login`,
        GET_PROFILE: `/auth/profile`,
    },

    USERS: {
        GET_ALL_USERS: `/users`,
        GET_USER_BY_ID: (userId) => `/users/${userId}`,
        UPDATE_USER: (userId) => `/users/${userId}`,
        DELETE_USER: (userId) => `/users/${userId}`,
        CREATE_USER: `/users`,
    },

    TASKS: {
        GET_DASHBOARD_DATA: "/tasks/dashboard-data",
        GET_USER_DASHBOARD_DATA: `/tasks/user-dashboard-data`,
        GET_ALL_TASKS: `/tasks`,
        GET_TASK_BY_ID: (taskId) => `/tasks/${taskId}`,
        CREATE_TASK: `/tasks`,
        UPDATE_TASK: (taskId) => `/tasks/${taskId}`,
        DELETE_TASK: (taskId) => `/tasks/${taskId}`,

        UPDATE_TASK_STATUS: (taskId) => `/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKLIST: (taskId) => `/tasks/${taskId}/todo`,
    },

    REPORTS: {
        EXPORT_TASKS: `/reports/export/tasks`,
        EXPORT_USERS: `/reports/export/users`,
    },

    IMAGE: {
        UPLOAD_IMAGE: `/auth/upload-image`,
    },
};
