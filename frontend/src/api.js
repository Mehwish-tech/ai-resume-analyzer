// src/api.js
// ─────────────────────────────────────────────
// Backend se baat karne ka ek jagah
// ─────────────────────────────────────────────
import axios from "axios"

const BASE_URL = "http://localhost:8000"

/**
 * Resume analyze karo
 * @param {File}   file           - PDF ya DOCX file
 * @param {string} jobDescription - Job posting text
 * @returns {Promise<object>}     - Full analysis result
 */
export async function analyzeResume(file, jobDescription) {

  // FormData banao — file + text dono ek saath bhejne ke liye
  const formData = new FormData()
  formData.append("file",            file)
  formData.append("job_description", jobDescription)

  const response = await axios.post(
    `${BASE_URL}/api/analyze`,
    formData,
    {
      headers : { "Content-Type": "multipart/form-data" },
      timeout : 60000,   // 60 seconds — AI time leta hai
    }
  )

  return response.data
}