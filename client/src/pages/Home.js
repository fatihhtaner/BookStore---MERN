import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../cards/BookCard';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addBook, removeBook, selectBooks, selectBasketCount } from '../redux/basketSlice';

const Home = () => {
    const [isbn, setIsbn] = useState("");
    const [books, setBooks] = useState([]);
    const [bookData, setBookData] = useState(null);
    const navigate = useNavigate();
    const [login, setLogin] = useState(false);

    const handleData = (e) => {
        setIsbn(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Gönderilen İstek:", { ISBN: isbn });
        if (books.find((book) => book.ISBN === isbn)) {
            return;
        }
        axios.post("http://localhost:5000/api", { ISBN: isbn })
            .then((response) => {
                console.log(response);
                setBooks(prevBooks => [...prevBooks, response.data]);
                setBookData(response.data);
            })
            .catch((error) => {
                alert("Book with given ISBN is not found!");
                console.error(error);
            });
    };

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        if (token) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    }, []);

    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem("userToken");

            if (token) {
                // Token süresini kontrol et
                // Eğer süre dolmuşsa çıkış işlemini gerçekleştir
                // Örneğin: jwt.decode kullanarak token'ın süresini kontrol edebilirsiniz
                // const decodedToken = jwt.decode(token);
                // if (decodedToken.exp < Date.now() / 1000) {
                //     logout();
                // }
            }
        };

        checkTokenExpiration();
    }, [login]);

    const logout = () => {
        localStorage.removeItem("userToken");
        setLogin(false);
        console.log(localStorage.getItem("userToken"));
    }

    const basketCount = useSelector(selectBasketCount);

    return (
        <div >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                <h2 className='home-title'> Welcome to the Home Page</h2>
                {login ? <button className="home-button" style={{ marginRight: 150 }} onClick={logout}>Logout</button>
                 : <button className="home-button" onClick={() => navigate("/login")}>Login</button>
                  }
                   <button className="home-button" style={{ marginRight: 150 }} onClick={() => navigate("/basket")}>
      Basket ({basketCount})
    </button>
            </div>
            <form style={{ padding: 10 }}>
                <input className="home-input" type="text" placeholder="Enter ISBN" onChange={handleData} />
                <button className="home-button" type="submit" onClick={handleSubmit}>Search</button>

            </form>
            <div style={{padding: 5}}>
                {books.map((book, index) => (
                    <BookCard key={index} book={book}/>
                ))}
            </div>
        </div>
    );
};

export default Home;
