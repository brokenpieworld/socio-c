import axios from "axios";
import Router from "next/router";
import React, { Component } from "react";
import { Toast } from "../components/Helper";

export default class login extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }

  async componentDidMount() {
    if (typeof window !== undefined) {
      await this.trustwallet();
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

    var address = await this.getAddress();
    if (address) {
      await this.processLogin(address);
    }
    this.setState({ loading: false });
    return Toast("Oops ! Your have to connect using trustwallet or metamask.");
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
    if (typeof window !== undefined) {
      var address = Router.query.address;
      if (address && address.length > 2) {
        return address;
      }
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
              <div className="card-content m-5 title">Please wait...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
