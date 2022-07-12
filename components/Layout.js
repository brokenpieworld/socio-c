import Head from "next/head";
import React from "react";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          Trade {process.env.NEXT_PUBLIC_TOKEN_NAME} in just a second.
        </title>
      </Head>
      <nav className="navbar is-transparent">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <span
              style={{
                fontSize: 25,
                fontWeight: "bold",
                fontVariant: "all-small-caps",
                backgroundColor: "blue",
                color: "#fff",
                padding: 10,
                borderRadius: 10,
              }}
            >
              Tauras
              <span style={{ fontWeight: 300 }}>&nbsp;Coin</span>
            </span>
          </a>
          <div
            className="navbar-burger"
            data-target="navbarExampleTransparentExample"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navbarExampleTransparentExample" className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="field is-grouped">
                <p className="control">
                  <a className="bd-tw-button button">
                    <span>Login</span>
                  </a>
                </p>
                <p className="control">
                  <a className="button is-primary">
                    <span>Signup</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {children}
      <footer className="footer mt-5">
        <div className="content has-text-centered">
          <p>
            <strong>&copy; Tauras Coin</strong>. Crypto Investments are subject
            to market risks. <br /> Privacy: Tauras Coin never share user
            information with any third party at any condition except required by
            law.
          </p>
        </div>
      </footer>
    </>
  );
}