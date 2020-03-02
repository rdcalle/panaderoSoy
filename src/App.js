import React from 'react'
import { Router, Redirect } from '@reach/router'
import Login from 'Pages/Login'
import Box from 'Pages/Box'

const App = () => {
  return (
    <Router>
      <Login path="/login" />
      <Box path="/box" />
      <Redirect noThrow from="*" to="/login" />
    </Router>
  )
}

export default App
