import axios from "axios";
import Variables from '../../config/variables.json';

export const api = axios.create({
  baseURL: Variables.apiBaseUrl
})
