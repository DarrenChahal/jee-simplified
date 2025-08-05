const BASE_API_URL = "https://jee-simplified-api-1075829581.us-central1.run.app/api";

export const apiUrls = {
  tests: {
    getAll: `${BASE_API_URL}/tests`,
    create: `${BASE_API_URL}/tests/create`,
    getById: (id: string) => `${BASE_API_URL}/tests/${id}`,
    register: (id: string) => `${BASE_API_URL}/tests/${id}/register`,

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
    // Add more user-related routes here
  },

};
