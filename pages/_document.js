import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="Full-stack Web Engineer experienced in JavaScript, Angular, React, Vue.js and Node.js" />
          <link rel="icon" href="/favicon.ico" />
          
          <meta property="og:title" content="Zahid Mahmood" />
          <meta property="og:description" content="Full-stack Web Engineer" />
          <meta property="og:image" content="https://www.zmdev.com/assets/og_card.jpg" />
          <meta property="og:url" content="https://www.zmdev.com" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:site_name" content="Zahid Mahmood" />
          <meta name="twitter:image:alt" content="Full-stack Web Engineer" />
        </Head>
        <body>
          <Main />
          <div id="modal" />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument