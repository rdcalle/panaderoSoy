import React, { useEffect } from 'react'
import { Router, Redirect, navigate } from '@reach/router'
import Login from 'Pages/Login'
import Box from 'Pages/Box'
import { Modal } from 'antd'
import { keepAliveSession } from 'Utils/access'

const App = () => {
  useEffect(() => {
    window.onstorage = () => {
      navigate('/login')
    }
    window.addEventListener('timeout', () => {
      if (!window.location.href.endsWith('/login')) countDown()
    })
  }, [])

  const countDown = () => {
    let secondsToGo = 60
    const modal = Modal.success({
      title: 'La sesión va a cerrarse por inactividad',
      content: `Se producirá el logout en ${secondsToGo} segundos.`,
      onOk() {
        keepAliveSession()
      },
    })
    const timer = setInterval(() => {
      secondsToGo -= 1
      modal.update({
        content: `Se producirá el logout en ${secondsToGo} segundos.`,
      })
    }, 1000)
    setTimeout(() => {
      clearInterval(timer)
      modal.destroy()
    }, secondsToGo * 1000)
  }

  return (
    <Router>
      <Login path="/login" />
      <Box path="/box" />
      <Redirect noThrow from="*" to="/login" />
    </Router>
  )
}

export default App
