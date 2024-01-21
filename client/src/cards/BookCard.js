import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBook, removeBook, selectBooks, selectBasketCount, selectBookQuantity } from '../redux/basketSlice';

const BookCard = ({ book, addToCart, showAddToBasketButton = true }) => {
    const basket = useSelector(selectBooks);
    const dispatch = useDispatch();
    //const basketCount = useSelector(selectBasketCount);
    const bookQuantity = useSelector(state => selectBookQuantity(state, book.ISBN));


    const handleAddToBasket = () => {
        if (book) {
            dispatch(addBook(book));
        }
    };

    useEffect(() => {
        console.log(basket);
    }, [basket]);

    /*const handleRemoveFromBasket = (isbnToRemove) => {
        dispatch(removeBook({ ISBN: isbnToRemove }));
    };*/

    const handleIncreaseQuantity = () => {
        if (book) {
            dispatch(addBook(book));
        }
    };

    const handleDecreaseQuantity = () => {
        if (bookQuantity > 0) {
            dispatch(removeBook({ ISBN: book.ISBN }));
        }
    };

    return (
        <div className="book-card">
            <div>
                <p style={{fontSize: 15}}>{book.title}</p>
                <p style={{fontSize: 15}}>Author: {book.author}</p>
                <p style={{fontSize: 15}}>Page Number: {book.pageNumber}</p>
                <p style={{fontSize: 15}}>Cost: {book.cost}</p>
            </div>
       
            <div className="button-container">
            {showAddToBasketButton ? <button className="basket-button" onClick={handleAddToBasket}>Add To Basket</button>
              : (
                <div>
                    <button className="quantity-button" onClick={handleDecreaseQuantity}>-</button>
                    <span style={{ margin: '0 5px' }}>{bookQuantity}</span>
                    <button className="quantity-button" onClick={handleIncreaseQuantity}>+</button>
                </div>
            )}
            </div>
        </div>
    );
};

export default BookCard;