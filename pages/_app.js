import { useState, useEffect } from "react";
import { UserContext } from "../lib/UserContext";
import App from "next/app";
import Router from "next/router";
import Head from "next/head";
import Header from "../components/header";
import { magic } from "../lib/magic";
import { ThemeProvider } from "@magiclabs/ui";
import "@magiclabs/ui/dist/cjs/index.css";

function Prolo({ Component, pageProps }) {
  const [user, setUser] = useState();

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, redirect to /login and set UserContext to { user: null }
  useEffect(() => {
    setUser({ loading: true });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getMetadata().then((userData) => setUser(userData));
      } else {
        Router.push("/login");
        setUser({ user: null });
      }
    });
  }, []);

  return (
    <ThemeProvider root>
      <UserContext.Provider value={[user, setUser]}>
        <Head>
          <title>pro.lo- cryptocurrency profit/loss tracker</title>
          <link rel="icon" href="/prolo_black_symbolWhite_logo.png" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          ></meta>
        </Head>
        <Header />
        <div className="container">
          <Component {...pageProps} />
        </div>
      </UserContext.Provider>
      <style jsx global>{`
        * {
          font-family: "Ubuntu", sans-serif !important;
          outline: none;
        }
        .container {
          max-width: 42rem;
          margin: 0 auto;
          padding: 0 10px;
          // background-color: lightgray;
        }
      `}</style>
    </ThemeProvider>
  );
}

Prolo.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default Prolo;
