import React, { Component } from "react";
import { Toast } from "../components/Helper";
import swal from "sweetalert";

export default class index extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      uid: null,
      appCode: null,
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
        "You must buy minimum " +
          process.env.NEXT_PUBLIC_MIN_BUY_AMT +
          " " +
          coin
      );
    }
    if (!this.state.isLoggedIn) {
      return Toast("Please login your account first or create a new account.");
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
              <label className="has-text-white">Please Enter Amount</label>
              <div className="columns is-mobile mt-2">
                <div className="column is-8 pr-0">
                  <input
                    ref={this.amount}
                    className="input"
                    type="text"
                    placeholder="Enter Amount"
                  />
                </div>
                <div className="column is-4 pl-1">
                  <div className="select">
                    <select ref={this.coin}>
                      <option>TRC</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="columns mt-5">
                <div className="column">
                  <button
                    className="button is-warning is-fullwidth"
                    onClick={() => {
                      this.processOrderMetamask();
                    }}
                  >
                    Metamask / Trust Wallet (BNB)
                  </button>
                </div>
                <div className="column">
                  <button className="button is-primary is-fullwidth">
                    BTC / ETH / TRX / Other
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
