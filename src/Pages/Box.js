import React, { useState } from 'react'
import { Layout } from 'antd'
import MailContainer from 'Components/MailContainer'
import HeaderFilters from 'Components/HeaderFilters'
import Context from 'Utils/context'

const { Header, Footer } = Layout

const Box = () => {
  const [textFilters, setTextFilters] = useState([])
  const [dateFilter, setDateFilter] = useState([null, null])
  const contextValue = {
    textFilters,
    setTextFilters,
    dateFilter,
    setDateFilter,
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Context.Provider value={contextValue}>
        <Layout>
          <Header style={{ padding: '0 20px 0 0' }}>
            <HeaderFilters />
          </Header>
          <MailContainer />
          <Footer>&copy; Ricardo Díaz de la Calle</Footer>
        </Layout>
      </Context.Provider>
    </Layout>
  )
}

export default Box
