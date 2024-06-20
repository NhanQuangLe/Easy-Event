import React, { useContext, useRef, useState } from "react";
import "./Auth.css";
import AuthContext from "../../context/auth-context";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const context = useContext(AuthContext);
  const emailEL = useRef();
  const passwordEL = useRef();

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const email = emailEL.current.value;
    const password = passwordEL.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = {
      query: `
            query Login($email: String!, $password: String!){
                login(email: $email, password: $password) {
                    userId
                    token
                    tokenExpiration
                }
            }
        `,
      variables: {
        email: email,
        password: password,
      },
    };
    if (!isLogin) {
      requestBody = {
        query: `
                mutation CreateUser($email: String!, $password: String!){
                    createUser(userInput: {email: $email, password: $password}){
                        _id
                        email
                    }
                }
            `,
        variables: {
          email: email,
          password: password,
        },
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        if (isLogin) {
          if (resData.data.login.token) {
            console.log("Doo");
            context.login(resData.data.login.token, resData.data.login.userId);
          }
        }
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" ref={emailEL} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEL} />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={switchModeHandler}>
          Switch to {isLogin ? "Signup" : "Login"}
        </button>
      </div>
    </form>
  );
}
