import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBooks, selectTotalCost } from '../redux/basketSlice';
import BookCard from '../cards/BookCard';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const Basket = () => {
    const navigate = useNavigate();
    const userToken = localStorage.getItem("userToken");
    const totalCost = useSelector(selectTotalCost);

    const books = useSelector(selectBooks);

    const handleConfirmOrder = () => {
        if (!userToken) {
            alert("You must be logged in to confirm an order!")
            navigate("/login");
            return;
        }

        const decoded = jwtDecode(userToken);

        const orderBooks = books.map(book => ({
            ISBN: book.ISBN,
            quantity: book.quantity,
        }));

        const orderData = {
            user: decoded.id,
            orderBooks: orderBooks,
        };

        axios.post("http://localhost:5000/api/orders", orderData, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        })
            .then(response => {
                alert("Order confirmed!")
                console.log("Order confirmed:", response.data);

            })
            .catch(error => {
                console.error("Order confirmation error:", error);
            });
    };


    return (
        <div>
            <h1 style={{ fontSize: 25 }}>Order Basket</h1>
            {books.length === 0 ? (
                <p>Basket is empty</p>
            ) : (
                <div>
                    {books.map((book, index) => (
                        <BookCard key={index} book={book} showAddToBasketButton={false} />
                    ))}
                    <div>
                        <p style={{ fontSize: 15 }}>Total Cost: {totalCost}</p>
                    </div>
                    <button onClick={handleConfirmOrder} className="basket-button">Confirm Order</button>
                </div>

            )}

            <button onClick={() => navigate("/")} className="basket-button">Go Back</button>

        </div>
    );
};

export default Basket;