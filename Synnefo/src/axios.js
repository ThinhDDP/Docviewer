
import axios from 'axios'

const axiosInstance = axios.create()

const refreshAccessToken = async () => {
    const refreshToken = JSON.parse(localStorage.getItem('token_refresh'))
    let config  = {
        headers: {
            'x-access-token': refreshToken
        }
    }
    let newAccessToken = await axios.post('http://localhost:3333/docviewerapi/asia-east2/api/refresh', {}, config)
    return newAccessToken.data
}

axiosInstance.interceptors.request.use(
    async config => {
        const token = sessionStorage.getItem('token_key')
        config.headers = {
            'x-access-token': token
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(response => {
    return response
}, async function(error){
    const originalReq = error.config
    if (error.response.status == 401 && !originalReq._retry){
        if (originalReq.url.includes("refresh")){
            window.location.href = "/login"
        }
        else {
            originalReq._retry = true
            const accessToken = await refreshAccessToken()
            sessionStorage.setItem("token_key", accessToken)
            console.log(accessToken)
            return axiosInstance(originalReq)
        }

    }
    return Promise.reject(error)
})

export default axiosInstance