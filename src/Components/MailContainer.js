import React, { useEffect, useState } from 'react'
import { Layout, Tabs, Icon } from 'antd'
import styled from '@emotion/styled'
import TableInbox from 'Pages/TableInbox'

const { Content } = Layout
const { TabPane } = Tabs

const MailContainer = () => {
  const [mails, setMails] = useState(null)

  useEffect(() => {
    if (!mails)
      fetch('mails').then(async res => {
        const text = await res.text()
        setMails(JSON.parse(text))
      })
  }, [mails, setMails])

  return (
    <StyledContent>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <Icon type="download" />
              Entrada
            </span>
          }
          key="1"
        >
          {mails && mails.length}
          {/* <TableInbox /> */}
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="upload" />
              Salida
            </span>
          }
          key="2"
        >
          Outbox
        </TabPane>
      </Tabs>
    </StyledContent>
  )
}

export default MailContainer

const StyledContent = styled(Content)`
  padding: 20px;
  > .ant-tabs > .ant-tabs-content > .ant-tabs-tabpane {
    background: #fff;
    padding: 16px;
  }
`
