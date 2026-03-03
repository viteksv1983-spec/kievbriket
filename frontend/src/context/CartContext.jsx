import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            if (typeof window === 'undefined') return [];
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Failed to parse cart from local storage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, flavor = null, weight = null, deliveryDate = null, deliveryMethod = 'pickup') => {
        const finalWeight = weight !== null ? weight : product.weight;
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item =>
                item.id === product.id &&
                item.flavor === flavor &&
                item.weight === finalWeight &&
                item.deliveryDate === deliveryDate &&
                item.deliveryMethod === deliveryMethod
            );
            if (existingItem) {
                return prevItems.map(item =>
                    (item.id === product.id &&
                        item.flavor === flavor &&
                        item.weight === finalWeight &&
                        item.deliveryDate === deliveryDate &&
                        item.deliveryMethod === deliveryMethod)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity, flavor, weight: finalWeight, deliveryDate, deliveryMethod }];
            }
        });
    };

    const removeFromCart = (productId, flavor = null, weight = null, deliveryDate = null, deliveryMethod = null) => {
        setCartItems(prevItems => prevItems.filter(item =>
            !(item.id === productId &&
                item.flavor === flavor &&
                item.weight === weight &&
                item.deliveryDate === deliveryDate &&
                item.deliveryMethod === deliveryMethod)
        ));
    };

    const updateQuantity = (productId, flavor = null, weight = null, deliveryDate = null, deliveryMethod = null, quantity) => {
        if (quantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                (item.id === productId &&
                    item.flavor === flavor &&
                    item.weight === weight &&
                    item.deliveryDate === deliveryDate &&
                    item.deliveryMethod === deliveryMethod) ? { ...item, quantity: quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
