import React, { useState } from 'react'
import Layout from '../components/Layout'
import { Alert, Button, ButtonGroup, Form, Spinner } from 'react-bootstrap'
import setting from '../setting'
import Link from 'next/link'

export default function ScanPage() {

  const [host, setHost] = useState('google.com')
  const [portStart, setPortStart] = useState(1)
  const [portEnd, setPortEnd] = useState(100)
  const [loading, setLoading] = useState(false)
  const [link, setLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const scan = async (): Promise<void> => {
    setLoading(true)
    const response = await fetch(`${setting.apiPath}/api/portscans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: host,
        port_start: portStart,
        port_end: portEnd
      })
    })
    if (!response.ok) {
      setError('スキャン中にエラーが発生しました。')
      setLoading(false)
      return
    }
    const data = await response.json()
    const id = data.id
    setLink(`/result/?id=${id}`)
    setLoading(false)
  }

  return (
    <Layout>
      <h1>Scan</h1>
      <Form>
        <Form.Group className='mt-3'>
          <Form.Label>Host</Form.Label>
          <Form.Control type="text" placeholder="Enter host" value={host} onInput={
            (e: React.ChangeEvent<HTMLInputElement>) => setHost(e.target.value)
          } />
        </Form.Group>
        <Form.Group className='mt-3'>
          <Form.Label>Port</Form.Label>
          <div className='d-flex align-items-center'>
            <Form.Control type="number" placeholder="Enter port (start)" value={portStart} onInput={
              (e: React.ChangeEvent<HTMLInputElement>) => setPortStart(parseInt(e.target.value))
            } />
            <span className='mx-3'>〜</span>
            <Form.Control type="number" placeholder="Enter port (end)" value={portEnd} onInput={
              (e: React.ChangeEvent<HTMLInputElement>) => setPortEnd(parseInt(e.target.value))
            } />
          </div>
        </Form.Group>
        <Button variant="primary" type="button" className='mt-5 d-block m-auto' onClick={scan} disabled={loading}>
          Scan
        </Button>
      </Form>
      {
        loading &&
        <div className='mt-5 d-flex justify-content-between'>
          {
            Array.from(Array(5).keys()).map((_, index) => (
              <Spinner key={index} animation="border" variant="primary" />
            ))
          }
        </div>
      }
      {
        error &&
        <Alert variant='danger' className='mt-5'>
          {error}
        </Alert>
      }
      {
        link &&
        <>
          <hr />
          <Link href={link} className='text-decoration-none'>
            <Button variant='outline-success' type='button' className='d-block m-auto w-100'>
              結果を見る
            </Button>
          </Link>
        </>
      }
    </Layout>
  )
}
