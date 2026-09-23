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
          <link rel="icon" href="/favicon.ico" />
          {/* Browser bars match the page edges; see html/body in globals.css. */}
          <meta name="color-scheme" content="light dark" />
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#cce5ff" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#18181b" />
          {/* Lets the CSS hold the hero tagline back until its intro reveals it. */}
          <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
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