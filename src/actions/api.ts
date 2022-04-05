import axios from 'axios';

const BaseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

export default axios.create({
  baseURL: BaseURL
});