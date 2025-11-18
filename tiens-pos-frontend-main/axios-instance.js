import axios from "axios";

 const HOST_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3001' : window.location.origin;

//const HOST_URL = "https://pos-tiens-backend.onrender.com"
 //const HOST_URL = "https://pp.flflstore.com"

export const UPLOADS_URL = HOST_URL + "/useruploads/";


const axiosInstance = axios.create({
	baseURL: HOST_URL + "/api",
});	

const requestHandler = (request) => {
	request.headers.Authorization = `Bearer ${localStorage.getItem('schoolSoftToken')}`;

	return request;
}
const errorHandler = (error) => Promise.reject(error);

axiosInstance.interceptors.request.use(
	(request) => requestHandler(request),
	(error) => errorHandler(error),
);

axiosInstance.interceptors.response.use(
	(response) => response,

	(error) => {
		if (error?.response?.status === 401) {
			localStorage.clear();
			window.location.href = '/';
		}
	},
);

export default axiosInstance;
