import axios from "axios";

// Define your API base URL
const API_BASE_URL = "http://localhost:3000"; // Or wherever your server is hosted

let currentId = 1;  // Start the ID at 1, you can modify this to any starting value.

// Initialize currentId based on the existing quizzes
const initializeCurrentId = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes`);
    const quizzes = response.data;
    if (quizzes.length > 0) {
      // Set currentId to max existing ID + 1
      currentId = Math.max(...quizzes.map(quiz => quiz.id)) + 1;
    }
  } catch (error) {
    console.error("Error initializing currentId:", error);
  }
};

// Call initializeCurrentId at the start
initializeCurrentId();

const ApiService = {
  // Fetch all quizzes
  getAllQuizzes: () => axios.get(`${API_BASE_URL}/quizzes`),

  // Fetch a quiz by its ID
  getQuizById: (quizId) => axios.get(`${API_BASE_URL}/quizzes/${quizId}`),

  // Fetch results for a specific user
  getUserResults: (username) => axios.get(`${API_BASE_URL}/results?username=${username}`),
  getAllResults: (username) => axios.get(`${API_BASE_URL}/results`),


  // Fetch admin data
  getAdminData: () => axios.get(`${API_BASE_URL}/admin/results`),

  // Update a quiz by its ID
  updateQuiz: (quizId, quizData) => axios.put(`${API_BASE_URL}/quizzes/${quizId}`, quizData),

  // Submit a quiz
  submitQuiz: async (quizId, username, answers, score) => {
    try {
      // Check if result exists for the given username and quizId
      const response = await axios.get(`${API_BASE_URL}/results`, {
        params: { username, quizId }
      });

      const results = response.data;

      if (results.length > 0) {
        // If result exists, update it
        const result = results[0];
        result.answers = answers;
        result.score = score;

        return axios.put(`${API_BASE_URL}/results/${result.id}`, result);
      } else {
        // If result does not exist, create a new one
        const newResult = { username, quizId, score, answers };
        return axios.post(`${API_BASE_URL}/results`, newResult);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      throw error;
    }
  },
  addQuiz: (quiz) => {
    quiz.id = currentId;
    currentId++;  // Increment the ID for the next quiz

    return axios.post(`${API_BASE_URL}/quizzes`, quiz)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error adding quiz:", error);
        throw error;
      });
  },

  // Delete a quiz by ID
  deleteQuiz: (id) => axios.delete(`${API_BASE_URL}/quizzes/${id}`)
    .then(() => {
      console.log("Quiz deleted!");
    })
    .catch((error) => {
      console.error("Error deleting quiz:", error);
      throw error;
    }),
    getUsers: () => axios.get(`${API_BASE_URL}/users`),
  addUser: (username) => axios.post(`${API_BASE_URL}/users`, username),
};

export default ApiService;