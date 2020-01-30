import React from 'react'
import { Layout } from 'antd'
import { Affix, Button } from 'antd'
import MailContainer from 'Components/MailContainer'

const { Header, Footer, Sider } = Layout

const Box = () => (
  <Layout style={{ minHeight: '100vh' }}>
    <Sider>Sider</Sider>
    <Layout>
      <Header>Header</Header>
      <MailContainer />
      <Footer>Footer</Footer>
    </Layout>
    <Affix style={{ position: 'absolute', top: '10px', right: '10px' }}>
      <Button type="primary">Salir</Button>
    </Affix>
  </Layout>
)

export default Box
