import axios from "axios";
import Link from "next/link";
import React, { Component } from "react";
import { Toast } from "../components/Helper";

export default class login extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
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
    this.setState({ loading: true });

    const { ethereum } = window;
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      });
    } catch (switchError) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x38",
            chainName: "Binance Smart Chain",
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com"],
            nativeCurrency: {
              symbol: "BNB",
              decimals: 18,
            },
          },
        ],
      });
    }
    alert(1);
    var address = await this.getAddress();
    alert(2);
    if (address[0]) {
      alert(3);
      await this.processLogin(address[0]);
    }
    alert(4);
    this.setState({ loading: false });
    return Toast("Oops ! Your have to connect using trustwallet or metamask");
  }

  async processLogin(address) {
    if (address == "") {
      this.setState({ loading: false });
      return Toast("Oops ! Your have to connect using trustwallet or metamask");
    }
    var detail = await axios.post(process.env.NEXT_PUBLIC_URL + "/api/login", {
      address: address,
    });
    this.setState({ loading: false });
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
  async getAddress() {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      const { ethereum } = window;
      var address = await ethereum.request({ method: "eth_requestAccounts" });
      return address;
    } catch (error) {
      alert(error);
      console.error(error);
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
              <div className="card-content m-5">
                <div className="columns is-mobile">
                  {this.state.loading ? (
                    <>
                      <button className="button is-loading is-info m-5 is-fullwidth">
                        Wait a Momemnt..
                      </button>
                    </>
                  ) : (
                    <>
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
                        <button
                          onClick={() => {
                            this.trustwallet();
                          }}
                          className="button is-danger mt-2 is-fullwidth"
                        >
                          Metamask
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
