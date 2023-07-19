import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Alert, OverlayTrigger, Spinner, Table, Tooltip } from 'react-bootstrap'
import useSWR from 'swr'
import dayjs from 'dayjs'
import setting from '../setting'
import Layout from '../components/Layout'

type IPortscanResult = {
  id: number
  host: string
  ip_address: string
  created_at: Date
  updated_at: Date
  portscan_results: {
    id: number
    port_number: number
    open: boolean
    created_at: Date
    updated_at: Date
  }[]
}

function Component(): JSX.Element {
  const router = useRouter()

  const [id, setId] = useState<number | null>(null)
  const [responseStatus, setResponseStatus] = useState<200 | 404 | 999 | null>(null)

  useEffect(() => {
    const id = router.query.id as string | undefined
    if (id != null) setId(parseInt(id))
  }, [router.query.page])

  const {
    data,
    error
  } = useSWR<
    IPortscanResult
  >(id ? `${setting.apiPath}/api/portscans/${id}` : null, async (url: string) => {
    const response = await fetch(url)
    if (response.status === 404) {
      setResponseStatus(404)
      return null
    }
    if (response.status === 200) {
      setResponseStatus(200)
      return await response.json()
    }
    setResponseStatus(999)
    return null
  })

  // return <>{JSON.stringify(data)}</>

  if (error != null) return <Alert variant="danger">Error: failed to fetch data.</Alert>
  if (data == null) return <Spinner animation="border" />

  return (
    <>
      <Table bgcolor='red'>
        <tbody>
          <tr>
            <td>Host</td>
            <td>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="tooltip-bottom">
                    {data.ip_address}
                  </Tooltip>
                }
              >
                <span role="button">{data.host}</span>
              </OverlayTrigger>
            </td>
          </tr>
          <tr>
            <td>Exec Date</td>
            <td>{dayjs(data.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
          </tr>
        </tbody>
      </Table>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Port</th>
            <th>Open</th>
            <th>Exec Date</th>
          </tr>
        </thead>
        <tbody>
          {data.portscan_results.map((portscanResult) => (
            <tr key={portscanResult.id}>
              <td>{portscanResult.port_number}</td>
              <td>{portscanResult.open ? 'Open' : 'Close'}</td>
              <td>{dayjs(portscanResult.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default function ResultPage(): JSX.Element {
  return (
    <Layout>
      <h1>Portscan Result</h1>
      <Component />
    </Layout>
  )
}