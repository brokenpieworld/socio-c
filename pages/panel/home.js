import axios from "axios";
import Router from "next/router";
import React, { Component } from "react";
import { Toast } from "../../components/Helper";

export default class home extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      uid: null,
      appCode: null,
      txns: [],
    };
  }

  async componentDidMount() {
    if (typeof window !== undefined) {
      if (localStorage.getItem("uid")) {
        await this.setState({
          isLoggedIn: true,
          uid: localStorage.getItem("uid"),
          appCode: localStorage.getItem("appcode"),
        });
        await this.gettxns();
      } else {
        return Router.push("/login");
      }
    }
  }

  async gettxns() {
    var data = await axios.post("/api/list-txns", {
      id: this.state.uid,
      appcode: this.state.appCode,
    });
    if (data.data.status === true) {
      await this.setState({ txns: data.data.message });
    } else {
      return Toast(data.data.message);
    }
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <h4 className="title">My Transactions</h4>
          <br />
          <div className="table-container">
            <table class="table is-fullwidth is-striped">
              <thead>
                <tr>
                  <th>Txn Hash</th>
                  <th>Receiving Address</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {this.state.txns.length > 0 &&
                  this.state.txns.map((e) => (
                    <tr>
                      <td>{e.hash}</td>
                      <td>{e.address}</td>
                      <td>{e.type}</td>
                      <td>{e.date}</td>
                      <td>
                        <a
                          target={"_blank"}
                          className="button is-small is-link"
                          href={e.chain + e.hash}
                        >
                          Check
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }
}
