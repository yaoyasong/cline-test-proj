import Head from 'next/head'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>DG Helper</title>
        <meta name="description" content="DG Helper Application" />
      </Head>
      <main className="flex-1 container mx-auto px-4 py-8 mb-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
