import React, { CSSProperties, MouseEventHandler } from 'react'
import { useDispatch } from 'react-redux'
import * as AllIcons from './icons'
import * as FaIcons from './icons/fa'
import { StyledPrtClick } from './style'

export const Icon: React.FC<{
  ui?: true
  src?: string
  ext?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  pr?: true
  className?: string
  click?: string
  payload?: string
  menu?: string
  flip?: boolean
  invert?: 'true'
  rounded?: 'true'
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  color?: CSSProperties['color']
  margin?: CSSProperties['margin']
  icon?: keyof typeof AllIcons
  open?: boolean | null
  active?: boolean
  fafa?: keyof typeof FaIcons
}> = (props) => {
  const dispatch = useDispatch()
  let src = `${import.meta.env.BASE_URL}img/icon/${
    props.ui != null ? 'ui/' : ''
  }${props.src}.png`
  if (props.src && (props.ext != null || props.src.includes('http'))) {
    src = props.src
  }

  const prtclk =
    props.src && (props.onClick != null || props.pr != null) ? 'cg-prtclk' : ''

  const clickDispatch: MouseEventHandler<HTMLDivElement> = (event) => {
    const target = event.target as HTMLDivElement
    const action = {
      type: target.dataset.action,
      payload: target.dataset.payload,
    }

    if (action.type) {
      dispatch(action)
    }
  }

  if (props.fafa != null) {
    const FaIcon = FaIcons[props.fafa]
    return (
      <StyledPrtClick
        className={`cg-uicon cg-prtclk ${props.className || ''}`}
        onClick={props.onClick || (props.click && clickDispatch) || undefined}
        data-action={props.click}
        data-payload={props.payload}
        data-menu={props.menu}
      >
        <FaIcon
          data-flip={props.flip != null}
          data-invert={props.invert ?? 'false'}
          data-rounded={props.rounded ?? 'false'}
          style={{
            width: props.width,
            height: props.height || props.width,
            color: props.color,
            margin: props.margin,
          }}
        />
      </StyledPrtClick>
    )
  }
  if (props.icon != null) {
    const CustomIcon = AllIcons[props.icon]
    return (
      <StyledPrtClick
        className={`cg-uicon cg-prtclk ${props.className || ''}`}
        onClick={props.onClick || (props.click && clickDispatch) || undefined}
        data-action={props.click}
        data-payload={props.payload}
        data-menu={props.menu}
      >
        <CustomIcon
          data-flip={props.flip != null}
          data-invert={props.invert ?? 'false'}
          data-rounded={props.rounded ?? 'false'}
          style={{
            width: props.width,
            height: props.height || props.width,
            fill: props.color || undefined,
            margin: props.margin || undefined,
          }}
        />
      </StyledPrtClick>
    )
  }
  return (
    <StyledPrtClick
      className={`cg-uicon ${props.className || ''} ${prtclk}`}
      data-open={props.open}
      data-action={props.click}
      data-active={props.active}
      data-payload={props.payload}
      onClick={props.onClick || (props.pr && clickDispatch) || undefined}
      data-menu={props.menu}
      data-pr={props.pr}
    >
      <img
        width={props.width}
        height={props.height}
        data-action={props.click}
        data-payload={props.payload}
        data-click={props.click != null}
        onClick={props.click != null ? clickDispatch : undefined}
        data-flip={props.flip != null}
        data-invert={props.invert != null ? 'true' : 'false'}
        data-rounded={props.rounded != null ? 'true' : 'false'}
        src={src}
        style={{
          margin: props.margin || undefined,
        }}
        alt=""
      />
    </StyledPrtClick>
  )
}
