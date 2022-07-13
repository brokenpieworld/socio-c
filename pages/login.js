import axios from "axios";
import Link from "next/link";
import React, { Component } from "react";
import { Toast } from "../components/Helper";

export default class login extends Component {
  constructor() {
    super();
    this.email = React.createRef();
    this.password = React.createRef();
  }

  componentDidMount() {
    if (typeof window !== undefined) {
      if (localStorage.getItem("uid")) {
        this.setState({
          isLoggedIn: true,
          uid: localStorage.getItem("uid"),
          appCode: localStorage.getItem("appcode"),
        });
      }
    }
  }

  async processLogin() {
    var email = this.email.current.value;
    var password = this.password.current.value;
    if (email == "" || password == "") {
      return Toast("Oops ! Your have to put email and password both");
    }
    var detail = await axios.post(process.env.NEXT_PUBLIC_URL + "/api/login", {
      email: email,
      password: password,
    });
    if (detail.data.status) {
      if (typeof window !== undefined) {
        localStorage.setItem("uid", detail.data.message.uid);
        localStorage.setItem("appcode", detail.data.message.appcode);
      }
      Toast("Successfully Logged In", "success");
      return (window.location = "/");
    } else {
      return Toast(detail.data.message);
    }
  }

  render() {
    return (
      <div className="section">
        <div className="columns is-align-items-center">
          <div className="column is-half is-offset-one-quarter">
            <div className="card">
              <header className="card-header has-background-link">
                <p className="card-header-title has-text-white">
                  Login Your Account
                </p>
              </header>
              <div className="card-content">
                <div className="field">
                  <label>Enter Your Email ID</label>
                  <input ref={this.email} className="input" type="email" />
                </div>
                <div className="field">
                  <label>Enter Your Password</label>
                  <input
                    ref={this.password}
                    className="input"
                    type="password"
                  />
                </div>
                <Link href={"/forgot"}>
                  <a>Forgot Password ?</a>
                </Link>
                <br />
                <div className="columns is-mobile">
                  <div className="column">
                    <button
                      onClick={() => {
                        this.processLogin();
                      }}
                      className="button is-link mt-2 is-fullwidth"
                    >
                      Login
                    </button>
                  </div>
                  <div className="column">
                    <button className="button is-warning mt-2 is-fullwidth">
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
