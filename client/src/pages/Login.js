import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const data = {
        username: '',
        password: ''
    };
    const [user, setUser] = useState(data);
    const [userToken, setUserToken] = useState(null);
    const handleData = (e) => {
        setUser({
            ...user,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user.username || !user.password) {
            alert("Please fill all the fields");
            return;
        }
        axios.post("http://localhost:5000/api/login", user)
            .then((response) => {
                console.log(response);
                const token = response.data.userToken;
                if (token) {
                    localStorage.setItem("userToken", token);
                    setUserToken(token);
                    navigate("/");
                }
            }).catch((error) => {
                if (error.response.status === 401) {
                    alert("Username or password is incorrect.");
                } else {
                    console.error(error);
                }
            });

    };

    return (
        <div className='login-container'>
            <form className='login-form' onSubmit={handleSubmit}>
                <input placeholder="Username" className='custom-input' type="text" id="username" onChange={handleData} /><br /><br />
                <input placeholder="Password" className='custom-input' type="password" id="password" onChange={handleData} /><br /><br />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 230}}>
                    <button className="custom-button" type="submit">Login</button>
                    <button className="custom-button" style={{ padding: 10 }} onClick={() => navigate("/register")}>Register</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', marginRight: 74 }}>
                    <button className="custom-button" onClick={() => navigate("/")}>Home</button>
                </div>
            </form>
        </div>
    );
};

export default Login;