import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const data = {
        username: '',
        email: '',
        password: ''
    };
    const [user, setUser] = useState(data);
    const [userToken, setUserToken] = useState(null);
    const navigate = useNavigate();
    const handleData = (e) => {
        setUser({
            ...user,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.username || !user.password || !user.email) {
            alert("Please fill all the fields");
            return;
        }
        try {
            const response = await axios.post("http://localhost:5000/api/register", user);
            console.log(response);
            const token = response.data.userToken;
            alert("User registered successfully");
            navigate("/login");
        } catch (error) {
            if (error.response.status === 409) {
                alert("User with this username or email already exists.");

            } else if (error.response.status === 400) {
                alert("Password must be at least 6 characters long.")
            }
            else {
                console.error(error);
            }
        }
    };

    return (
        <div className='login-container'>
            <form className='login-form' onSubmit={handleSubmit}>
                <input style={{ padding: 5 }} placeholder="Username" className='custom-input' type="text" id="username" onChange={handleData} /><br /><br />
                <input placeholder="Email" className='custom-input' type="email" id="email" onChange={handleData} /><br /><br />
                <input placeholder="Password" className='custom-input' type="password" id="password" onChange={handleData} /><br /><br />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 85, padding: 10 }}>
                    <button className="custom-button" type="submit">Submit</button>

                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 85, padding: 10 }}>
                    <button className="custom-button" style={{ padding: 10 }} onClick={() => navigate("/")}>Home</button>
                </div>
            </form>
        </div>
    );
};

export default Register;