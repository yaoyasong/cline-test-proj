'use client'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import Layout from '../components/Layout'

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps } 
}) {
  // 仅对非认证页面应用Layout
  const isAuthPage = Component.authPage
  
  return (
    <SessionProvider session={session}>
      {isAuthPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
  )
}
