import React, { Component } from "react";
import { Toast } from "../components/Helper";
import swal from "sweetalert";
import Router from "next/router";
import axios from "axios";

export default class index extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      uid: null,
      appCode: null,
      rate: 0,
      loading: false,
    };
    this.amount = React.createRef();
    this.coin = React.createRef();
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

  async processOrderMetamask() {
    var coin = this.coin.current.value;
    var amount = this.amount.current.value;
    if (amount < process.env.NEXT_PUBLIC_MIN_BUY_AMT) {
      return Toast(
        "You must buy minimum " + process.env.NEXT_PUBLIC_MIN_BUY_AMT + " TRC"
      );
    }
    if (!this.state.isLoggedIn) {
      Toast("Please login your account first or create a new account.");
      return Router.push("/login");
    }
    this.setState({ loading: true });
    var rate = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=" + coin
    );
    if (coin == "BNB") {
      this.setState({ rate: rate.data.BNB });
    }
    if (coin == "ETH") {
      this.setState({ rate: rate.data.ETH });
    }
    swal({
      title: "Are you sure?",
      text:
        "You want to buy " +
        amount +
        " TRC" +
        " of worth $ " +
        amount * process.env.NEXT_PUBLIC_COIN_USD_VAL +
        " USD",
      icon: "info",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await this.trustwallet();
      } else {
        this.setState({ loading: false });
      }
    });
  }

  async buyMetamask(address) {
    var amount = this.amount.current.value;
    var payable_amount = amount * this.state.rate;
    const { ethereum } = window;
    try {
      var hex = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS,
            value: Number(payable_amount * 1e18).toString(16),
          },
        ],
      });
      if (hex) {
        var data = await axios.post(
          process.env.NEXT_PUBLIC_URL + "/api/trxfrcoin",
          {
            amount: amount,
            from: address,
            hex: Date.now(),
            id: this.state.uid,
            appcode: this.state.appCode,
          }
        );
        if (data.data.status === true) {
          Toast(data.data.message + " Hash: " + data.data.hash, "success");
        } else {
          Toast(data.data.message);
        }
        return this.setState({ loading: false });
      }
    } catch (e) {
      Toast("Some error occured." + e);
      return this.setState({ loading: false });
    }
  }

  async trustwallet() {
    if (!this.isMetaMaskInstalled || !this.isTrustWalletInstalled) {
      return Toast(
        "Oops ! Your have to connect using trustwallet or metamask."
      );
    }
    this.setState({ loading: true });
    var coin = this.coin.current.value;
    const { ethereum } = window;
    if (coin == "BNB" || coin == "BUSD") {
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
    } else {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: "0x1",
          },
        ],
      });
    }

    var address = await this.getAddress();
    if (address[0]) {
      await this.buyMetamask(address[0]);
    }
    this.setState({ loading: false });
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
      var address = await ethereum.request({ method: "eth_requestAccounts" });
      return address;
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Trade {process.env.NEXT_PUBLIC_TOKEN_NAME}</h1>
          <div style={{ maxWidth: 600 }}>
            <hr />
          </div>
          <p className="subtitle">
            Fast Trading with Highest <strong>Security</strong>!
          </p>
          <div className="card has-background-link" style={{ maxWidth: 600 }}>
            <header className="card-header">
              <p className="card-header-title has-text-white">
                Buy {process.env.NEXT_PUBLIC_TOKEN_NAME}
              </p>
            </header>
            <div className="card-content">
              <div className="columns is-mobile mt-2">
                <div className="column is-8 pr-0">
                  <label className="has-text-white mb-2">
                    Please Enter Amount
                  </label>
                  <input
                    ref={this.amount}
                    className="input"
                    type="text"
                    placeholder="Enter Amount"
                  />
                </div>
                <div className="column is-4 pl-1">
                  <label className="has-text-white mb-2">Select Crypto</label>
                  <div className="select is-fullwidth">
                    <select ref={this.coin}>
                      <option>BNB</option>
                      <option>ETH</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="columns mt-5">
                <div className="column">
                  {this.state.loading ? (
                    <button className="button is-warning is-fullwidth is-loading">
                      Wait..
                    </button>
                  ) : (
                    <button
                      className="button is-warning is-fullwidth"
                      onClick={() => {
                        this.processOrderMetamask();
                      }}
                    >
                      Metamask / Trust Wallet
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
