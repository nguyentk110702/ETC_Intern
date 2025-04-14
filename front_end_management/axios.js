    import axios from "axios";
const apiClient = axios.create({
    baseURL: 'https://e04c-2405-4800-1f06-3200-3496-9264-a4c0-93f.ngrok-free.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiClient