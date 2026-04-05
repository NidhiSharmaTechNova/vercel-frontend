import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);


    // const getAuthState = async () => {
    //     try {
    //         const token = localStorage.getItem("token");

    //         const { data } = await axios.get(backendUrl + '/api/auth/is-auth', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });

    //         if (data.success) {
    //             setIsLoggedin(true);
    //             getUserData();
    //         }

    //     } catch (error) {
    //         toast.error(error.message)
    //     }
    // }


    // const getUserData = async () => {
    //     try {
    //         const token = localStorage.getItem("token");

    //         const { data } = await axios.get(backendUrl + '/api/user/data', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });

    //         data.success ? setUserData(data.userData) : toast.error(data.message);

    //     } catch (error) {
    //         toast.error(error.message)
    //     }
    // }

    const getAuthState = async () => {
        try {
            axios.defaults.withCredentials = true;

            const token = localStorage.getItem("token");

            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // ✅ Get User Data
    const getUserData = async () => {
        try {
            const token = localStorage.getItem("token");

            const { data } = await axios.get(`${backendUrl}/api/user/data`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };



    useEffect(() => {
        getAuthState();
    }, [])

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}