import React from 'react'
import Layout from '../components/Layout'
import setting from '../setting'

export default function Home (): JSX.Element {
  return (
    <Layout>
      <div id='Index' className='d-flex flex-column align-items-center'>
        <h1>{setting.title}</h1>
        <img id='Logo' className='mt-3' style={{ width: '100%', maxWidth: '100px' }} src={`${setting.basePath}/tako.png`} alt='Logo' />
      </div>
    </Layout>
  )
}
