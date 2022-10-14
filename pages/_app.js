import "../styles/globals.css";
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
	return (
	  <>
		<Head>
			<title>Zahid Mahmood | Full-stack Web Engineer</title>
		</Head>
		<Component {...pageProps} />
	  </>
	)
  }

export default MyApp

