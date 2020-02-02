import React from 'react'
import { Table } from 'antd'
import Highlighter from 'react-highlight-words'
import styled from '@emotion/styled'
import moment from 'moment'

const TableInbox = ({ incommingMails }) => {
  // <Highlighter
  //   highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
  //   searchWords={[searchText]}
  //   autoEscape
  //   textToHighlight={decoder(text)}
  // />

  const columns = {
    incomming: [
      {
        title: 'De',
        dataIndex: 'from',
        key: 'from',
      },
      {
        title: 'Asunto',
        dataIndex: 'subject',
        key: 'subject',
        width: '60%',
      },
      {
        title: 'Cuándo',
        dataIndex: 'date',
        key: 'date',
        render: date => moment(date).format(`DD/MM/YY`),
      },
    ],
  }

  return (
    <Table
      columns={columns.incomming}
      dataSource={incommingMails}
      rowKey="file"
      size="small"
      pagination={{ pageSize: 50, position: 'both' }}
      locale={{ emptyText: 'Sin correos que mostrar' }}
    />
  )
}

export default TableInbox

const FilterDialog = styled.div`
  padding: 8px;
`
