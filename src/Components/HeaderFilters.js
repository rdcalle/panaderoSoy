import React, { useContext } from 'react'
import { Select, Button } from 'antd'
import styled from '@emotion/styled'
import Context from 'Utils/context'

const HeaderFilters = () => {
  const { setTextFilters } = useContext(Context)

  return (
    <HeaderRow>
      <StyledInput
        mode="tags"
        placeholder="Filtros de texto"
        onChange={setTextFilters}
        allowClear
      />
      <Button type="primary">Salir</Button>
    </HeaderRow>
  )
}

export default HeaderFilters

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`
const StyledInput = styled(Select)`
  flex: 1;
  margin-right: 30px;
`
