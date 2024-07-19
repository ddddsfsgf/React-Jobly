import axios from "axios";
import jwt_decode from "jwt-decode";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
const JoblyApi = {
    // Makes generis API request
    async request(endpoint, { token, ...data } ={}, method = "get") {
        console.debug("API Call:", endpoint, token, data, method);
        const url = `${BASE_URL}/${endpoint}`;
        const headers = token ? { Authorization: `Bearer ${token}`} : {};
        const params = (method === "get") ? data : {};
        try {
            return(await axios({ url, method, data, params, headers })).data;
        } catch(err) {
            console.error("API Error:", err.response);
            let message = err.response.data.erro.message;
            throw Array.isArray(message) ? message : [message];
        }
    },
    // Start login session
    async login(username, password) {
        const { token } = await this.request("auth/token", { username, password }, "post");
        return token;
    },
    async register(username, password, firstName, lastName, email) {
        const { token } = await this.request("auth/register", {
            username, password, firstName, lastName, email
        }, "post");
        return token;
    },
    // Retrieve and update profile details of user
    async getUserDeatils(token) {
        const { username } = jwt_decode(token);
        const { user } = await this.request(`users/${username}`, { token });
        return user;
    },
    async updateUserDetails(token, details) {
        const { username } = jwt_decode(token);
        await this.request(`users/${username}`, { token, ...details }, "patch");
    },
    // Lookup companies
    async searchCompanies(searchQuery) {
        const { companies } = await this.request("companies", searchQuery, "get")
        return companies;
    },
    // Lookup jobs
    async searchJobs(searchQuery) {
        const { jobs } = await this.request("jobs", searchQuery, "get")
        return jobs;
    },
    // Get details of a company
    async getCompanyDetails(handle) {
        const { company } = await this.request(`companies/${handle}`);
        return company;
    },
    // Apply for a job
    async applyForJob(token, jobId) {
        const { username } = jwt_decode(token);
        await this.request(`users/${username}/jobs/${jobId}`, { token }, "post");
    }

}

export default JoblyApi;