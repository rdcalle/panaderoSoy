import React, { useEffect, useState, useContext } from 'react'
import { Layout, Tabs, Icon, Tag } from 'antd'
import styled from '@emotion/styled'
import TableInbox from 'Components/TableInbox'
import decoder from 'Utils/decoder'
import Context from 'Utils/context'

const { Content } = Layout
const { TabPane } = Tabs

const checkFilters = (mails, filters, fieldsToFilter) => {
  return mails.map(mail => ({
    ...mail,
    visible:
      !filters.length ||
      fieldsToFilter.some(field =>
        filters.every(filter => RegExp(filter, 'i').test(mail[field])),
      ),
  }))
}

const MailContainer = () => {
  const { textFilters, dateFilter, setDateFilter } = useContext(Context)
  const [mails, setMails] = useState()

  useEffect(() => {
    if (!mails)
      fetch('mails').then(async res => {
        const text = await res.text()
        const parsedMails = JSON.parse(text)
        const {
          incomming,
          outcomming,
          oldestDate,
          nearestDate,
        } = parsedMails.reduce(
          (mails, mail) => {
            if (!mail.date) return mails
            mails[mail.from ? 'incomming' : 'outcomming'].push({
              ...mail,
              visible: true,
              from: decoder(mail.from),
              to: mail.to ? decoder(mail.to.join(' ')) : mail.to,
              subject: decoder(mail.subject),
            })
            mails.oldestDate = !mails.oldestDate
              ? mail.date
              : mail.date < mails.oldestDate
              ? mail.date
              : mails.oldestDate
            mails.nearestDate = !mails.nearestDate
              ? mail.date
              : mail.date > mails.nearestDate
              ? mail.date
              : mails.nearestDate

            return mails
          },
          { incomming: [], outcomming: [], oldestDate: 0, nearestDate: 0 },
        )
        setMails({ incomming, outcomming })
        setDateFilter([oldestDate, nearestDate])
      })
  }, [mails])

  useEffect(() => {
    if (mails)
      setMails({
        incomming: checkFilters(mails.incomming, textFilters, [
          'from',
          'subject',
        ]),
        outcomming: checkFilters(mails.outcomming, textFilters, [
          'to',
          'subject',
        ]),
      })
  }, [textFilters])

  useEffect(() => {
    const [startDate, endDate] = dateFilter
    if (startDate && endDate) {
      setMails({
        incomming: mails.incomming.map(mail => ({
          ...mail,
          visible: mail.date >= startDate && mail.date <= endDate,
        })),
        outcomming: mails.outcomming.map(mail => ({
          ...mail,
          visible: mail.date >= startDate && mail.date <= endDate,
        })),
      })
    }
  }, [dateFilter])

  if (!mails) return null

  const incomming = mails.incomming.filter(({ visible }) => visible)
  const outcomming = mails.outcomming.filter(({ visible }) => visible)

  return (
    <StyledContent>
      <Tabs defaultActiveKey="2">
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
          <TableInbox outcommingMails={outcomming} />
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
