import React, { createContext, useEffect, useState } from "react";
import ProductsAPI from "./api/ProductsAPI";
import UserAPI from "./api/UserAPI";
import CategoriesAPI from "./api/CategoriesAPI";
import axios from "axios";

axios.defaults.withCredentials = true;

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  const refreshToken = async () => {
    try {
      const res = await axios.get("https://deploymentshop.onrender.com/user/refresh_token");
      console.log('Response data:', res.data); // Debugging log
      if (res.data && res.data.accesstoken) {
        setToken(res.data.accesstoken);
      }else{
        const storedToken = localStorage.getItem("accessToken");
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error refreshing token:', error.response ? error.response.data : error);
    }
  };

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const refreshTokenInterval = async () => {
        await refreshToken();
        setTimeout(refreshTokenInterval, 10 * 60 * 1000);
      };
      refreshTokenInterval();
    }
  }, []);

  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    userAPI: UserAPI(token),
    categoriesAPI: CategoriesAPI(),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};