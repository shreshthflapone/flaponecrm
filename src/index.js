import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from './store/store';
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { Provider } from "react-redux";
import { GoogleOAuthProvider, useGoogleLogin, googleLogout } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
     <GoogleOAuthProvider clientId="107670372887-t0ag84ucj00qmrtuvcubfq6jivfsb125.apps.googleusercontent.com">
    <Provider store={store}>
      <Router>
        <App />
        <ScrollToTop />
      </Router>
    </Provider>
    </GoogleOAuthProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
