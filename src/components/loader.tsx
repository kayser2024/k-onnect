'use client'
import React from 'react'
import './loader.css'

export const Loader = () => {
    return (
        <>
            <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30 " />
            <div className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm" />
            <div className="loader-container">

                <div className="lds-ripple z-20 m-auto"><div></div><div></div></div>
            </div>
        </>
    )
}
