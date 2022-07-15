import axios from "axios";
import Link from "next/link";
import React, { Component } from "react";
import { Toast } from "../components/Helper";

export default class login extends Component {
  constructor() {
    super();
    this.state = {
      address: null,
    };
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

  async trustwallet() {
    if (!this.isMetaMaskInstalled || !this.isTrustWalletInstalled) {
      return Toast(
        "Oops ! Your have to connect using trustwallet or metamask."
      );
    }
  }

  async processLogin() {
    if (this.state.address == "") {
      return Toast("Oops ! Your have to connect using trustwallet or metamask");
    }
    var detail = await axios.post(process.env.NEXT_PUBLIC_URL + "/api/login", {
      address: this.state.address,
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

  isMetaMaskInstalled() {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  }
  isTrustWalletInstalled() {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isTrust);
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
              <div className="card-content m-5">
                <div className="columns is-mobile">
                  <div className="column">
                    <button
                      onClick={() => {
                        this.trustwallet();
                      }}
                      className="button is-link mt-2 is-fullwidth"
                    >
                      Trustwallet
                    </button>
                  </div>
                  <div className="column">
                    <button className="button is-danger mt-2 is-fullwidth">
                      Metamask
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
