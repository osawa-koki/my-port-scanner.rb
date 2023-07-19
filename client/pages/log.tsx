import React, { useMemo } from 'react'
import Layout from '../components/Layout'
import setting from '../setting'
import { Table } from 'react-bootstrap'
import useSWR from 'swr'
import dayjs from 'dayjs'

type Portscan = {
  id: number
  host: string
  ip_address: string
  created_at: Date
  updated_at: Date
}

type Pagination = {
  current_page: number
  next_page: number | null
  prev_page: number | null
  total_pages: number
  total_count: number
}

function TableComponent (): JSX.Element {

  const {
    data,
    error
  } = useSWR<{
    data: Portscan[]
    pagination: Pagination
  }>(`${setting.apiPath}/api/portscans`, (url) => fetch(url).then((res) => res.json()))

  const {
    portscans,
    pagination
  } = useMemo(() => {
    return {
      portscans: data?.data,
      pagination: data?.pagination
    }
  }, [data])

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Host</th>
          <th>IP</th>
          <th>Exec Date</th>
        </tr>
      </thead>
      <tbody>
        {portscans?.map((portscan) => (
          <tr key={portscan.id}>
            <td>{portscan.id}</td>
            <td>{portscan.host}</td>
            <td>{portscan.ip_address}</td>
            <td>{dayjs(portscan.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default function LogPage(): JSX.Element {

  return (
    <Layout>
      <h1>Portscan Log</h1>
      <TableComponent />
    </Layout>
  )
}
