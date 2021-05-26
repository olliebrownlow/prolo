import Head from 'next/head';
import Header from './header';

const Layout = (props) => (
  <>
    <Head>
      <title>pro.lo- cryptocurrency profit/loss tracker</title>
      <link rel="icon" href="/prolo_black_symbolWhite_logo.png" />
      <link href="https://fonts.googleapis.com/css2?family=Ubuntu" rel="stylesheet" />
    </Head>

    <Header />
    <main>
      <div className='container'>{props.children}</div>
    </main>
    <style jsx global>{`
      * {
        font-family: 'Ubuntu', sans-serif !important;
        outline: none;
      }
      .container {
        max-width: 42rem;
        margin: 0 auto;
        padding: 0 10px;
        // background-color: lightgray;
      }
    `}</style>
  </>
);

export default Layout;
