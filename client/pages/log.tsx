/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Alert, Pagination, Spinner, Table } from 'react-bootstrap'
import useSWR from 'swr'
import dayjs from 'dayjs'
import Layout from '../components/Layout'
import setting from '../setting'

interface IPortscan {
  id: number
  host: string
  ip_address: string
  created_at: Date
  updated_at: Date
}

interface IPagination {
  current_page: number
  next_page: number | null
  prev_page: number | null
  total_pages: number
  total_count: number
}

const emptyFunction = (): void => {}
const fetcher = async (url: string): Promise<any> => await fetch(url).then(async (res) => res.ok ? await res.json() : null)

function TableComponent (): JSX.Element {
  const [page, setPage] = useState<number>(1)
  const router = useRouter()
  const [firstLock, setFirstLock] = useState(false)
  useEffect(() => {
    const _page = router.query.page
    const page = (typeof _page === 'string' ? _page : _page?.join('')) ?? null
    if (page != null) setPage(parseInt(page ?? '1'))
    setFirstLock(true)
  }, [router.query.page])
  useEffect(() => {
    if (!firstLock) return
    router.replace({
      pathname: '/log/',
      query: { page }
    }).then(emptyFunction).catch(emptyFunction)
  }, [page])

  const {
    data,
    error
  } = useSWR<{
    data: IPortscan[]
    pagination: IPagination
  }>(`${setting.apiPath}/api/portscans?page=${page}`, fetcher)

  const {
    portscans,
    pagination
  } = useMemo(() => {
    return {
      portscans: data?.data,
      pagination: data?.pagination
    }
  }, [data])

  if (error != null) return <Alert variant='danger'>Error: failed to fetch data.</Alert>
  if (data == null) return <Spinner animation='border' />

  return (
    <>
    <Alert variant='info'>
      ポートスキャンの結果は、全ユーザで共有されます。
    </Alert>
    <Pagination className='mt-3'>
      <Pagination.First onClick={() => { setPage(1) }} disabled={page === 1} />
      <Pagination.Prev onClick={() => { setPage(pagination!.current_page - 1) }} disabled={pagination?.prev_page === null} />
      <Pagination.Item>{pagination?.current_page}</Pagination.Item>
      <Pagination.Next onClick={() => { setPage(pagination!.current_page + 1) }} disabled={pagination?.next_page === null} />
      <Pagination.Last onClick={() => { setPage(pagination!.total_pages) }} disabled={page === pagination?.total_pages} />
    </Pagination>
    <Table className='mt-3' striped bordered hover>
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
            <td>
              <Link href={`/result/?id=${portscan.id}`}>#{portscan.id}</Link>
            </td>
            <td>{portscan.host}</td>
            <td>{portscan.ip_address}</td>
            <td>{dayjs(portscan.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    </>
  )
}

export default function LogPage (): JSX.Element {
  return (
    <Layout>
      <h1>Portscan Log</h1>
      <TableComponent />
    </Layout>
  )
}
