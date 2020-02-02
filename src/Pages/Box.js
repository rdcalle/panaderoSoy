import React, { useState } from 'react'
import { Layout } from 'antd'
import MailContainer from 'Components/MailContainer'
import HeaderFilters from 'Components/HeaderFilters'
import Context from 'Utils/context'

const { Header, Footer, Sider } = Layout

const Box = () => {
  const [textFilters, setTextFilters] = useState([])
  const contextValue = {
    textFilters,
    setTextFilters,
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Context.Provider value={contextValue}>
        <Sider>Sider</Sider>
        <Layout>
          <Header style={{ padding: '0 20px 0 0' }}>
            <HeaderFilters />
          </Header>
          <MailContainer />
          <Footer>Footer</Footer>
        </Layout>
      </Context.Provider>
    </Layout>
  )
}

export default Box
