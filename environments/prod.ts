const BASE_API_URL = "https://jee-simplified-api-274150960347.us-central1.run.app/api";

export const apiUrls = {
  tests: {
    getAll: `${BASE_API_URL}/tests`,
    create: `${BASE_API_URL}/tests/create`,
    getById: (id: string) => `${BASE_API_URL}/tests/${id}`,
    register: (id: string) => `${BASE_API_URL}/tests/${id}/register`,
    delete: (id: string) => `${BASE_API_URL}/tests/${id}`,
  },
  auth: {
    login: `${BASE_API_URL}/auth/login`,
    signup: `${BASE_API_URL}/auth/signup`,
    logout: `${BASE_API_URL}/auth/logout`,
    // Add more auth-related routes here
  },
  users: {
    profile: `${BASE_API_URL}/users/profile`,
    updateProfile: `${BASE_API_URL}/users/update`,
    registerForTest: `${BASE_API_URL}/users/test-registration/`,
  },
  templates: {
    getAll: `${BASE_API_URL}/templates`,
  },
  questions: {
    getAll: `${BASE_API_URL}/questions`,
  },
};
