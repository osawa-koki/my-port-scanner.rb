/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Alert, Badge, Pagination, Spinner, Table } from 'react-bootstrap'
import { BsLightningFill } from 'react-icons/bs'
import useSWR from 'swr'
import Layout from '../components/Layout'
import setting from '../setting'

interface IProtocol {
  id: number
  name: string
  description: string
}

interface IPort {
  id: number
  port_number: number
  service: string
  description: string
  severity: number
  protocols: IProtocol[]
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
      pathname: '/port/',
      query: { page }
    }).then(emptyFunction).catch(emptyFunction)
  }, [page])

  const {
    data,
    error
  } = useSWR<{
    data: IPort[]
    pagination: IPagination
  }>(`${setting.apiPath}/api/ports?page=${page}`, fetcher)

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
    <Pagination className='mt-3'>
      <Pagination.First onClick={() => { setPage(1) }} disabled={page === 1} />
      {[3, 2, 1].map((index) => {
        return <Pagination.Item key={index} onClick={() => { setPage(pagination!.current_page - index) }} disabled={pagination!.current_page - index < 1}>{
          pagination!.current_page - index < 1 ? '-' : pagination!.current_page - index
        }</Pagination.Item>
      })}
      <Pagination.Item className='mx-3'>{pagination!.current_page}</Pagination.Item>
      {[1, 2, 3].map((index) => {
        return <Pagination.Item key={index} onClick={() => { setPage(pagination!.current_page + index) }} disabled={pagination!.current_page + index > pagination!.total_pages}>{
          pagination!.total_pages < pagination!.current_page + index ? '-' : pagination!.current_page + index
        }</Pagination.Item>
      })}
      <Pagination.Last onClick={() => { setPage(pagination!.total_pages) }} disabled={page === pagination!.total_pages} />
    </Pagination>
    <Table className='mt-3' striped bordered hover>
      <thead>
        <tr>
          <th>Port Number</th>
          <th>Protocols</th>
          <th>Service</th>
          <th>Description</th>
          <th>Severity</th>
        </tr>
      </thead>
      <tbody>
        {portscans?.map((portscan) => (
          <tr key={portscan.id}>
            <td>{portscan.port_number}</td>
            <td>
              {
                portscan.protocols.map((protocol) => (
                  <Badge key={protocol.id} className='mx-1 my-1' bg="secondary">{protocol.name}</Badge>
                ))
              }
            </td>
            <td>{portscan.service}</td>
            <td>{portscan.description}</td>
            <td>
              {
                (() => {
                  const jsxes: JSX.Element[] = []
                  for (let i = 0; i < portscan.severity; i++) jsxes.push(<BsLightningFill className='text-danger' />)
                  for (let i = 0; i < 5 - portscan.severity; i++) jsxes.push(<BsLightningFill style={{ opacity: 0.25 }} />)
                  return jsxes
                })()
              }
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    </>
  )
}

export default function PortPage (): JSX.Element {
  return (
    <Layout>
      <h1>Ports</h1>
      <TableComponent />
    </Layout>
  )
}
