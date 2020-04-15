import React from 'react'

import './index.scss'

export const Footer = () => (
  <footer className="footer">
    ©{' '}<a href="https://github.com/RickBr0wn">Rick Brown {new Date().getFullYear()}</a>, Built with{' '}
    <a href="https://www.gatsbyjs.org">
      Gatsby
    </a>
  </footer>
)
