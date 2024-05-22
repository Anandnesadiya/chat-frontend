import React from 'react'
import Header from '../Components/Header/header'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer/footer'

const Layout = () => {
  return (
    <>
        <Header/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default Layout
