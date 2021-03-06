import React, { useState, useContext } from 'react'
import { Table } from 'antd'
import moment from 'moment'
import Highlighter from 'react-highlight-words'
import Context from 'Utils/context'
import MailContent from 'Components/MailContent'
import { keepAliveSession } from 'Utils/access'

const TableMails = ({ incommingMails, outcommingMails }) => {
  const { textFilters } = useContext(Context)
  const [readingMail, setReadingMail] = useState(null)

  const highlightedText = text => (
    <Highlighter
      highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
      searchWords={textFilters}
      autoEscape
      textToHighlight={text}
    />
  )

  const columns = {
    common: [
      {
        title: 'Asunto',
        dataIndex: 'subject',
        key: 'subject',
        width: '60%',
        render: highlightedText,
      },
      {
        title: 'Cuándo',
        dataIndex: 'date',
        key: 'date',
        sorter: (a, b) => a.date - b.date,
        defaultSortOrder: 'descend',
        sortDirections: ['ascend', 'descend', 'ascend'],
        render: date => moment(date).format(`DD/MM/YY`),
      },
    ],
    incomming: [
      {
        title: 'De',
        dataIndex: 'from',
        key: 'from',
        render: highlightedText,
      },
    ],
    outcomming: [
      {
        title: 'Para',
        dataIndex: 'to',
        key: 'to',
        render: highlightedText,
      },
    ],
  }

  const onRowClicked = mail => {
    // console.info(mail)
    setReadingMail(mail)
    keepAliveSession()
  }

  return (
    <>
      <Table
        columns={[
          ...columns[incommingMails ? 'incomming' : 'outcomming'],
          ...columns.common,
        ]}
        dataSource={incommingMails || outcommingMails}
        rowKey="file"
        size="small"
        pagination={{ pageSize: 25, position: 'both' }}
        locale={{ emptyText: 'Sin correos que mostrar' }}
        sortBy="date"
        onRow={(mail, rowId) => ({
          onClick: () => onRowClicked(mail, rowId),
        })}
        onChange={keepAliveSession}
      />
      <MailContent
        mail={readingMail}
        onClose={() => {
          setReadingMail(null)
          keepAliveSession()
        }}
        isInbox={!!incommingMails}
      />
    </>
  )
}

export default TableMails
