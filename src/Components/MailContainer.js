import React, { useEffect, useState, useContext } from 'react'
import { Layout, Tabs, Icon, Tag } from 'antd'
import styled from '@emotion/styled'
import TableInbox from 'Components/TableInbox'
import decoder from 'Utils/decoder'
import Context from 'Utils/context'

const { Content } = Layout
const { TabPane } = Tabs

const checkFilters = (mails, filters) =>
  mails.map(mail => ({
    ...mail,
    visible:
      !filters.length ||
      filters.every(filter => RegExp(filter, 'i').test(mail.from)),
  }))

const MailContainer = () => {
  const { textFilters } = useContext(Context)
  const [mails, setMails] = useState()

  useEffect(() => {
    console.info('el de relleno de mails')
    if (!mails)
      fetch('mails').then(async res => {
        const text = await res.text()
        const parsedMails = JSON.parse(text)
        const classifiedMails = parsedMails.reduce(
          (mails, mail) => {
            if (!mail.date) return mails
            mails[mail.from ? 'incomming' : 'outcomming'].push({
              ...mail,
              visible: true,
              from: decoder(mail.from),
              to: mail.to ? decoder(mail.to) : mail.to,
              subject: decoder(mail.subject),
            })
            return mails
          },
          { incomming: [], outcomming: [] },
        )
        setMails(classifiedMails)
      })
  }, [mails])

  useEffect(() => {
    console.info('el de un nuevo filtro', textFilters)
    if (mails)
      setMails({
        incomming: checkFilters(mails.incomming, textFilters),
        outcomming: checkFilters(mails.outcomming, textFilters),
      })
  }, [textFilters])

  if (!mails) return null

  const incomming = mails.incomming.filter(({ visible }) => visible)
  const outcomming = mails.outcomming.filter(({ visible }) => visible)

  return (
    <StyledContent>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <Icon type="download" />
              Entrada <Tag color="orange">{incomming.length}</Tag>
            </span>
          }
          key="1"
        >
          <TableInbox incommingMails={incomming} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="upload" />
              Salida <Tag color="orange">{outcomming.length}</Tag>
            </span>
          }
          key="2"
        >
          <TableInbox incommingMails={outcomming} />
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
