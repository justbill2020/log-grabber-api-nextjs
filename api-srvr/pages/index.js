import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import React from 'react'


export default function Home() {
  const [inputValue, setInputValue] = React.useState('')
  const [urlResult, setUrl] = React.useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/url', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ url: inputValue }),
    })
      .then((res) => res.json())
      .then((urlData) => {
        setUrl(urlData)
      })
  }
  return (
    <div >
      <Head>
        <title>Fetch URL Logo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >
        <h1>Fetch A Logo from URL</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Enter a website URL
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </label>
          <button>Submit</button>
        </form>
        {urlResult.logoUrl ? (
          <div>
            <picture><img referrerPolicy="same-origin-when-cross-origin" src={urlResult.logoUrl}></img></picture>
            <iframe referrerPolicy="same-origin-when-cross-origin" src={urlResult.logoUrl}></iframe>
          </div>
        ) : (
          <p>{urlResult.error}</p>
        )}
      </main>
    </div>
  )
}