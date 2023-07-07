import axios from 'axios'

const http = axios.create({
  baseURL: "http://110.41.176.195:2336",
})

export default http
