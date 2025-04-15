    import axios from "axios";
const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})
    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status;

            if (status === 401 || status === 403) {
                message.warning("Phiên làm việc đã hết hoặc tài khoản bị khóa!");
                // Xoá localStorage/sessionStorage nếu cần
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                sessionStorage.removeItem("token");

                // Đưa người dùng về trang login nếu không đã ở đó
                if (router.currentRoute.value.path !== "/login") {
                    router.push("/login");
                }
            }

            return Promise.reject(error);
        }
    );
export default apiClient