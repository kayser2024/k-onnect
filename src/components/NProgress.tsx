'use client'

import React from 'react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const NProgress = () => {
  return (
    <ProgressBar
      height="5px"
      color="#0082ca"
      options={{ showSpinner: true }}
      shallowRouting
    />
  )
}

export default NProgress