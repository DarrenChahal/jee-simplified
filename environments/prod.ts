//const BASE_API_URL = "https://jee-simplified-api-274150960347.us-central1.run.app/api";
const BASE_API_URL = "http://localhost:5000/api";

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
    unregisterForTest: `${BASE_API_URL}/users/test-unregistration/`,
    submitTest: `${BASE_API_URL}/users/test-submission/`,
    getRegisteredTests: (email: string) => `${BASE_API_URL}/users/registrations/${email}`,
    getSubmittedTests: `${BASE_API_URL}/users/submitted-tests/`,
  },
  templates: {
    getAll: `${BASE_API_URL}/templates`,
  },
  questions: {
    getAll: `${BASE_API_URL}/questions`,

  },
  answers: {
    create: `${BASE_API_URL}/answers/`,
    getByUserAndTest: (userId: string, testId: string) => `${BASE_API_URL}/answers?user_id=${userId}&test_id=${testId}`,
  },
  system: {
    time: `${BASE_API_URL}/system/time`,
  },
};
