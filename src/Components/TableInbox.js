import React from 'react'
import { Table, Divider, Tag } from 'antd'
import moment from 'moment'
import decoder from 'Utils/decoder'

const columns = {
  incomming: [
    {
      title: 'De',
      dataIndex: 'from',
      key: 'from',
      render: decoder,
    },
    {
      title: 'Asunto',
      dataIndex: 'subject',
      key: 'subject',
      render: decoder,
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

const TableInbox = ({ incommingMails }) => (
  <Table
    columns={columns.incomming}
    dataSource={incommingMails}
    rowKey="file"
    size="small"
    pagination={{ pageSize: 50, position: 'both' }}
  />
)

export default TableInbox
