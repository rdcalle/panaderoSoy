import React, { useState, useEffect } from 'react'
import { navigate } from '@reach/router'
import styled from '@emotion/styled'
import { Form, Icon, Input, Button } from 'antd'
import { chiperedPasswd, checkPasswd, setSession } from 'Utils/access'

const Login = ({ form: { getFieldDecorator, validateFields } }) => {
  const [wrongPassword, setWrongPassword] = useState(false)

  useEffect(() => {
    if (wrongPassword) setTimeout(() => setWrongPassword(false), 3000)
  }, [wrongPassword])

  const handleSubmit = e => {
    e.preventDefault()
    validateFields((_, { username, password }) => {
      const cipheredPwd = chiperedPasswd(password)
      if (username === 'paniMan' && checkPasswd(cipheredPwd)) {
        navigate('/box')
        setSession(cipheredPwd)
      }
    })
    setWrongPassword(true)
  }

  return (
    <LoginContainer>
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: 'Introduce el nombre de usuario' },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Usuario"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Introduce tu contraseña' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Contraseña"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            disabled={wrongPassword}
          >
            Acceder
          </Button>
        </Form.Item>
        {wrongPassword && (
          <Form.Item extra="Usuario y/o contraseña incorrecta" />
        )}
      </Form>
    </LoginContainer>
  )
}

export default Form.create({ name: 'login' })(Login)

const LoginContainer = styled.div`
  text-align: right;
  display: flex;
  justify-content: center;
  margin-top: 50px;
`
