import React, { useState, useRef } from 'react'
import { Table, Divider, Tag, Input, Icon } from 'antd'
import Highlighter from 'react-highlight-words'
import styled from '@emotion/styled'
import moment from 'moment'
import decoder from 'Utils/decoder'

const TableInbox = ({ incommingMails }) => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef()

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <FilterDialog>
        <Input
          ref={searchInput}
          value={selectedKeys[0]}
          onChange={({ target: { value } }) => console.info(value)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
      </FilterDialog>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current.select())
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  })

  const columns = {
    incomming: [
      {
        title: 'De',
        dataIndex: 'from',
        key: 'from',
        render: decoder,
        ...getColumnSearchProps('from'),
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

  return (
    <Table
      columns={columns.incomming}
      dataSource={incommingMails}
      rowKey="file"
      size="small"
      pagination={{ pageSize: 50, position: 'both' }}
    />
  )
}

export default TableInbox

const FilterDialog = styled.div`
  padding: 8px;
`
