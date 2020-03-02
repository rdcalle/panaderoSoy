import React, { useContext, useState, useEffect } from 'react'
import { navigate } from '@reach/router'
import { DatePicker, Select, Button } from 'antd'
import styled from '@emotion/styled'
import moment from 'moment'
import Context from 'Utils/context'
const { RangePicker } = DatePicker

const dateFormat = 'DD/MM/YYYY'

const HeaderFilters = () => {
  const { setTextFilters, dateFilter, setDateFilter } = useContext(Context)
  const [initialPeriod, setInitialPeriod] = useState([])

  useEffect(() => {
    if (!initialPeriod[0]) {
      setInitialPeriod([...dateFilter])
    }
  }, [dateFilter])

  return (
    <HeaderRow>
      <StyledInput
        mode="tags"
        placeholder="Textos a buscar por De, Asunto o Cuerpo del mensaje"
        onChange={setTextFilters}
        allowClear
      />
      {initialPeriod[0] && (
        <RangePicker
          value={[moment(dateFilter[0]), moment(dateFilter[1])]}
          format={dateFormat}
          onChange={period =>
            setDateFilter(!period[0] ? initialPeriod : period)
          }
        />
      )}
      <Button type="primary" onClick={() => navigate('/login')}>
        Salir
      </Button>
    </HeaderRow>
  )
}

export default HeaderFilters

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  > * {
    margin: 0 15px;
  }
`
const StyledInput = styled(Select)`
  flex: 1;
`
