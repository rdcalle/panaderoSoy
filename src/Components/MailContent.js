import React from 'react'
import { Drawer, Divider, Col, Row } from 'antd'
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

const MailContent = ({ mail, ...props }) =>
  !mail ? null : (
    <Drawer
      width={640}
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
            title={mail.from ? 'De' : 'Para'}
            content={mail.from || mail.to}
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>Aquí irá el cuerpo del mensaje</Col>
      </Row>
    </Drawer>
  )

export default MailContent
