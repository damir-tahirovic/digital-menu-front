import React, { createContext, useContext } from "react";
import { useBasket } from "../hooks/useCart";

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
    const basket = useBasket();
    return <BasketContext.Provider value={basket}>{children}</BasketContext.Provider>;
};

export const useBasketContext = () => useContext(BasketContext);
