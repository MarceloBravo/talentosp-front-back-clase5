import { useState } from "react"
import instance from "../axios/axiosInstance"

export const useHttp = () => {
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState(null)
    const [ data, setData ] = useState(null)

    const sendRequest = async (url, method, data, config) => {
        try{
            setIsLoading(true)
            const result = await instance({
                url,
                method,
                data, 
                ...config
            })
            console.log('result', result);
            if(result.data.code === 400){
                setError(result.data.error)
                return result.data
            }
            setData(result.data)
            return result.data
        }catch(err){
            console.log('err', err);
            setError(err.response?.data?.error || (err.response?.data?.message || err.message))
        }finally{
            setIsLoading(false)
        }
    }

    const resetError = () => {
        setError(null)
    }

    return { isLoading, error, data, sendRequest, resetError }
}