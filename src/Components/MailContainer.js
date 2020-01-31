import React, { useEffect, useState } from 'react'
import { Layout, Tabs, Icon } from 'antd'
import styled from '@emotion/styled'
import TableInbox from 'Components/TableInbox'

const { Content } = Layout
const { TabPane } = Tabs

const MailContainer = () => {
  const [mails, setMails] = useState()

  useEffect(() => {
    if (!mails)
      fetch('mails').then(async res => {
        const text = await res.text()
        const parsedMails = JSON.parse(text)
        const classifiedMails = parsedMails.reduce(
          (mails, mail) => {
            if (!mail.date) return mails
            mails[mail.from ? 'incomming' : 'outcomming'].push(mail)
            return mails
          },
          { incomming: [], outcomming: [] },
        )
        setMails(classifiedMails)
      })
  }, [mails, setMails])

  return !mails ? null : (
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
          <TableInbox incommingMails={mails.incomming} />
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
          <TableInbox incommingMails={mails.outcomming} />
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
