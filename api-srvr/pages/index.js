import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'

export default function Home() {
  const [inputValue, setInputValue] = React.useState('')
  const [url, setUrl] = React.useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/url', {
      method: 'get',
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
    <div className={styles.container}>
      <Head>
        <title>Fetch URL Logo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Fetch A Logo from URL</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Enter a Twitter username
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </label>
          <button>Submit</button>
        </form>
        {userFollowers.followerCount >= 0 ? (
          <p>Followers: {userFollowers.followerCount}</p>
        ) : (
          <p>{userFollowers.error}</p>
        )}
      </main>
    </div>
  )
}