import { useState, useEffect } from "react";

export function useBasket() {
    const [basket, setBasket] = useState([]);

    // učita korpu iz localStorage kad se app pokrene
    useEffect(() => {
        const saved = localStorage.getItem("basket");
        if (saved) {
            setBasket(JSON.parse(saved));
        }
    }, []);

    // svaki put kad se korpa promijeni → sacuva je u localStorage
    useEffect(() => {
        localStorage.setItem("basket", JSON.stringify(basket));
    }, [basket]);

    const addToBasket = (item) => {
        setBasket((prev) => {
            // ako već postoji isti item_type, povećaj količinu
            const existing = prev.find(
                (i) => i.itemTypeId === item.itemTypeId
            );
            if (existing) {
                return prev.map((i) =>
                    i.itemTypeId === item.itemTypeId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
    };

    const removeFromBasket = (itemTypeId) => {
        setBasket((prev) => prev.filter((i) => i.itemTypeId !== itemTypeId));
    };

    const clearBasket = () => setBasket([]);

    return { basket: basket, addToBasket, removeFromBasket, clearBasket };
}
