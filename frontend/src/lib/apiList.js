export const server = "http://localhost:8080";


const apiList = {
  login: `${server}/auth/login`,
  signup: `${server}/auth/signup`,
  uploadResume: `${server}/upload/resume`,
  uploadProfileImage: `${server}/upload/profile`,
  jobs: `${server}/api/jobs`,
  applications: `${server}/api/applications`,
  rating: `${server}/api/rating`,
  user: `${server}/api/user`,
  applicants: `${server}/api/applicants`,
  adminLogin: `${server}/auth/admin/login`, 
  adminSignup: `${server}/auth/admin/signup`,
  verify: `${server}/api/verify`,
  getRecruiter: `${server}/api/getRecruiters`,
  status: `${server}/api/recruiter/status`,
  resetPass: `${server}/auth/reset-password`,
  googleSign: `${server}/auth/signup/google`,


};

export default apiList;
