import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Alert, OverlayTrigger, Spinner, Table, Tooltip } from 'react-bootstrap'
import { BsLightningChargeFill, BsLightningCharge } from 'react-icons/bs'
import useSWR from 'swr'
import dayjs from 'dayjs'
import setting from '../setting'
import Layout from '../components/Layout'

interface IPortscanResult {
  id: number
  host: string
  ip_address: string
  created_at: Date
  updated_at: Date
  portscan_results: Array<{
    id: number
    port_number: number
    open: boolean
    created_at: Date
    updated_at: Date
    port: {
      port_number: number
      service: string
      severity: number
    }
  }>
}

function Component (): JSX.Element {
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
  >(id != null ? `${setting.apiPath}/api/portscans/${id}` : null, async (url: string) => {
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

  if (error != null) return <Alert variant="danger">Error: failed to fetch data.</Alert>
  if (data == null) return <Spinner animation="border" />
  if (responseStatus === 404) return <Alert variant="danger">Error: not found.</Alert>
  if (responseStatus === 999) return <Alert variant="danger">Error: unknown error.</Alert>

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
      <Table className='text-center' striped bordered hover>
        <thead>
          <tr>
            <th>Port</th>
            <th>Open</th>
            <th>Severity</th>
            <th>Exec Date</th>
          </tr>
        </thead>
        <tbody>
          {data.portscan_results
            .sort((a, b) => a.port_number - b.port_number)
            .map((portscanResult) => (
            <tr key={portscanResult.id}>
              <td>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="tooltip-bottom">
                      {portscanResult.port.service}
                    </Tooltip>
                  }
                >
                  <span role="button">{portscanResult.port_number}</span>
                </OverlayTrigger>
              </td>
              <td>{portscanResult.open ? <BsLightningChargeFill className='text-danger' /> : <BsLightningCharge opacity={0.3} />}</td>
              <td>
                {
                  (() => {
                    const jsxes: JSX.Element[] = []
                    for (let i = 0; i < portscanResult.port.severity; i++) {
                      jsxes.push(<BsLightningChargeFill className={portscanResult.open ? 'text-danger' : 'text-info'} key={i} />)
                    }
                    for (let i = 0; i < 5 - portscanResult.port.severity; i++) {
                      jsxes.push(<BsLightningCharge opacity={0.3} key={i + portscanResult.port.severity} />)
                    }
                    return jsxes
                  })()
                }
              </td>
              <td>{dayjs(portscanResult.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
            ))}
        </tbody>
      </Table>
    </>
  )
}

export default function ResultPage (): JSX.Element {
  return (
    <Layout>
      <h1>Portscan Result</h1>
      <Component />
    </Layout>
  )
}
