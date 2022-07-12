import React, { Component } from "react";

export default class index extends Component {
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
                    className="input"
                    type="text"
                    placeholder="Enter Amount"
                  />
                </div>
                <div className="column is-4 pl-1">
                  <div className="select">
                    <select>
                      <option>TRC</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="columns mt-5">
                <div className="column">
                  <button className="button is-warning is-fullwidth">
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
