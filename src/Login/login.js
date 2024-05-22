import React from 'react'
import LoginCss from "./login.module.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


const Login = () => {

    const { register, handleSubmit } = useForm();

    const navigate = useNavigate();

    function onSignUp() {
        return navigate("/signup");
    }

    const onSubmit = (user) => {
        const userData = {
            Email: user.Email,
            Password: user.Password,
        };

        loginAPI(userData).then((res) => {
            console.log(res);
            localStorage.setItem('accesstoken', res.token.accesstoken)
            navigate("/layout/dashboard");
        }).catch((err) => {
            console.log(err);
            navigate("/")
            alert("email or password is incorrect")
        })
        console.log(userData);
    };

    async function loginAPI(userData) {
        try {
            const res = await fetch("http://localhost:4000/user/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!res.ok) {
                throw new Error('Failed to sign up');
            }
            return res.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={LoginCss.container}>
                <h1>Login</h1>
                <hr />

                <label htmlFor="email"><b>Email</b></label>
                <input {...register("Email")} type="text" placeholder="Enter Email" required />

                <label htmlFor="psw"><b>Password</b></label>
                <input  {...register("Password")} type="password" placeholder="Enter Password" required />

                <br />

                <div className={`${LoginCss.clearfix} ${LoginCss.loginDiv}`}>
                    <button type="submit" className="loginbtn">Login</button>
                    <button type="button" className="signupbtn" onClick={onSignUp}>SignUp</button>
                </div>
            </div>
        </form>
    )
}

export default Login
