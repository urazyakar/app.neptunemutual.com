import React, { useEffect, useState } from 'react'
import { Header } from '@/common/Header/Header'
import { DisclaimerModal } from '@/common/Disclaimer/DisclaimerModal'
import { ScrollToTopButton } from '@/common/ScrollToTop/ScrollToTopButton'
import { CookiePolicy, getLSAcceptedCookie } from '@/common/CookiePolicy'
import Router from 'next/router'

export const PageLoader = () => {
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setShowLoader(true))
    Router.events.on('routeChangeComplete', () => setShowLoader(false))
    Router.events.on('routeChangeError', () => setShowLoader(false))

    return () => {
      Router.events.off('routeChangeStart', () => setShowLoader(false))
      Router.events.off('routeChangeComplete', () => setShowLoader(false))
      Router.events.off('routeChangeError', () => setShowLoader(false))
    }
  }, [])

  if (!showLoader) {
    return null
  }

  return (
    <div className='w-full bg-gray-200 fixed top-0 z-50'>
      <div data-testid='progress-bar' className='w-full h-2 shim-progress' />
    </div>
  )
}

export const MainLayout = ({ noHeader = false, children }) => {
  const [isCookieOpen, setIsCookieOpen] = useState(() => !getLSAcceptedCookie())

  return (
    <>
      <PageLoader />
      {!noHeader && <Header />}
      <div className='relative sm:static'>
        {children}
        <CookiePolicy
          isOpen={isCookieOpen}
          onClose={() => setIsCookieOpen(false)}
        />
        {!isCookieOpen && <DisclaimerModal />}
        <ScrollToTopButton />
      </div>
    </>
  )
}
