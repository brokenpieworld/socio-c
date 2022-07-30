import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Toast } from "./Helper";

export default function Layout({ children }) {
  const [isLoggedIn, setisLoggedIN] = useState(false);
  const [isActive, setisActive] = React.useState(false);

  useEffect(() => {
    if (typeof window !== undefined) {
      if (localStorage.getItem("uid")) {
        setisLoggedIN(true);
      }
    }
  });
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
            className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
            onClick={() => {
              setisActive(!isActive);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div
          id="navbarExampleTransparentExample"
          className={`navbar-menu ${isActive ? "is-active" : ""}`}
        >
          <div className="navbar-end">
            <li className="navbar-item">
              <Link href={"/"}>
                <a>Home</a>
              </Link>
            </li>
            <div className="navbar-item">
              <div className="field is-grouped">
                <p className="control">
                  {isLoggedIn ? (
                    <Link href={"/panel/home"}>
                      <a className="is-warning button">Dashboard</a>
                    </Link>
                  ) : (
                    <Link href={"/login"}>
                      <a className="is-link button">Login</a>
                    </Link>
                  )}
                </p>
                <p className="control">
                  {isLoggedIn && (
                    <a
                      onClick={() => {
                        Toast("You have been logged out", "success");
                        if (typeof window !== undefined) {
                          localStorage.clear();
                        }
                        setisLoggedIN(false);
                        return Router.push("/");
                      }}
                      className="is-link button"
                    >
                      Logout
                    </a>
                  )}
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
            <strong>&copy; All rights reserved</strong>. Crypto Investments are subject
            to market risks. <br /> Privacy: We never share user
            information with any third party at any condition except required by
            law.
          </p>
        </div>
      </footer>
    </>
  );
}
