import React, { useState, useEffect } from 'react'
import Switch from 'react-switch'

import * as Dom from '../../utils/dom'
import { THEME } from '../../constants'

import { IoMdSunny, IoMdMoon } from 'react-icons/io';
import './index.scss'

function getTheme(checked) {
  // WORKAROUND: switched from checked ? THEME.DARK : THEME.LIGHT
  return checked ? THEME.LIGHT : THEME.DARK
}

function toggleTheme(theme) {
  switch (theme) {
    case THEME.LIGHT: {
      Dom.addClassToBody(THEME.LIGHT)
      Dom.removeClassToBody(THEME.DARK)
      break
    }
    case THEME.DARK: {
      Dom.addClassToBody(THEME.DARK)
      Dom.removeClassToBody(THEME.LIGHT)
      break
    }
  }
}

export const ThemeSwitch = () => {
  const [checked, setChecked] = useState(false)

  const handleChange = checked => {
    const theme = getTheme(checked)

    setChecked(checked)
    toggleTheme(theme)
  }

  useEffect(() => {
    // WORKAROUND: switched from THEME.DARK
    const checked = Dom.hasClassOfBody(THEME.LIGHT)

    handleChange(checked)
  }, [])

  return (
    <div className="switch-container">
      <label htmlFor="normal-switch">
        <Switch
          onChange={handleChange}
          checked={checked}
          id="normal-switch"
          height={24}
          width={48}
          // WORKAROUND:  switch these icons
          checkedIcon={<div className="icon uncheckedIcon"><IoMdMoon /></div>}
          uncheckedIcon={<div className="icon checkedIcon"><IoMdSunny /></div>}
          // WORKAROUND: switched these colors
          onColor={'#d9dfe2'}
          onHandleColor={'#fff'}
          offColor={'#999'}
          offHandleColor={'#282c35'}
        />
      </label>
    </div>
  )
}
