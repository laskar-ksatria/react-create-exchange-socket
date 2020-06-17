import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'

function Login() {

    const [loginData, setLoginData] = React.useState({email: "", password: ""});

    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios({
            url: 'http://localhost:3005/users/login',
            method: 'POST',
            data: {
                email: loginData.email,
                password: loginData.password
            }
        })
        .then(({data}) => {
            alert('success')
            localStorage.setItem('codeotoken', data.token);
            history.push("/main")
        })
        .catch(err => {
            console.log(err);
        })
    };

    const handleChange = (e) => {
        setLoginData({...loginData, [e.target.name]: e.target.value})
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="email" name="email" onChange={handleChange}/>
                <br />
                <input name="password" onChange={handleChange} placeholder="Password" type="password" />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )

};

export default Login;