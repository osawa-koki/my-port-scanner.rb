import React, { type ReactNode } from 'react'
import Head from 'next/head'
import setting from '../setting'
import Menu from './Menu'

interface Props {
  children?: ReactNode
  title?: string
  menu?: boolean
  footer?: boolean
}

const Layout = ({
  children,
  title = setting.title,
  menu = true,
  footer = true
}: Props): JSX.Element => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        rel="shortcut icon"
        href={`${setting.basePath}favicon.ico`}
        type="image/x-icon"
      />
    </Head>
    <div id="Wrapper">
      {menu
        ? (
        <>
          <main>{children}</main>
          <Menu />
        </>
          )
        : (
            children
          )}
    </div>
    {footer && (
      <footer>
        <a
          href="https://github.com/osawa-koki"
          target="_blank"
          rel="noreferrer"
        >
          @osawa-koki
        </a>
      </footer>
    )}
  </div>
)

export default Layout
