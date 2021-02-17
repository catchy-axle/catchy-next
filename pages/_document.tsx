import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />
        <body className="has-navbar-fixed-top">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
