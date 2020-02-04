import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { Drawer, Divider, Col, Row } from 'antd'
import Highlighter from 'react-highlight-words'
import Context from 'Utils/context'
import moment from 'moment'
import 'moment/locale/es'

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
}

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        marginBottom: 0,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
)

const MailContent = ({ mail, isInbox, ...props }) => {
  const { textFilters } = useContext(Context)

  return !mail ? null : (
    <Drawer
      width={750}
      placement="right"
      closable={false}
      visible={!!mail}
      {...props}
    >
      <p style={{ ...pStyle }}>{mail.subject}</p>
      <Divider />
      <p style={pStyle}>{moment(mail.date).format('DD MMMM YYYY')}</p>
      <Row>
        <Col span={24}>
          <DescriptionItem
            title={isInbox ? 'De' : 'Para'}
            content={isInbox ? mail.from : mail.to}
          />
        </Col>
      </Row>
      {isInbox && (
        <Row>
          <Col span={24}>
            <DescriptionItem title={'Para'} content={mail.to} />
          </Col>
        </Row>
      )}
      <Row>
        <Col span={24}>
          <DescriptionItem title={'CC'} content={mail.cc} />
        </Col>
      </Row>
      {!isInbox && (
        <Row>
          <Col span={24}>
            <DescriptionItem title={'CCO'} content={mail.cco} />
          </Col>
        </Row>
      )}
      <Divider />
      <Row>
        <Col span={24}>
          <Paper>
            {Array.isArray(mail.body) ? (
              mail.body
            ) : (
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={textFilters}
                autoEscape
                textToHighlight={mail.body}
              />
            )}
            }
          </Paper>
        </Col>
      </Row>
      <Divider />
      <DescriptionItem title="Contenido original" content={mail.file} />
      <Row>
        <Col span={24}>
          {(mail.content || []).map((line, i) => (
            <OriginalLine key={i}>{line}</OriginalLine>
          ))}
        </Col>
      </Row>
      <Divider />
    </Drawer>
  )
}

export default MailContent

const Paper = styled.pre`
  background: antiquewhite;
  padding: 0 20px;
`
const OriginalLine = styled.p`
  font-size: 12px;
  margin: 0;
`
