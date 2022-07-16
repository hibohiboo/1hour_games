import React, { CSSProperties } from 'react'
import { useDispatch } from 'react-redux'
import { StyledImageCont } from './styled'

export const Image: React.FC<{
  src: string
  back?: boolean
  id?: string
  className?: string
  dir?: string
  ext?: string
  err?: string
  var?: string
  free?: string
  payload?: string
  click?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  w?: CSSProperties['width']
  h?: CSSProperties['height']
  lazy?: boolean
}> = (props) => {
  const dispatch = useDispatch()
  const { src } = props

  const errorHandler: React.ReactEventHandler<HTMLImageElement> = (e) => {
    if (props.err) {
      ;(e.target as HTMLImageElement).src = props.err
    }
  }

  const clickDispatch: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const target = event.target as HTMLDivElement
    const action = {
      type: target.dataset.action,
      payload: target.dataset.payload,
    }

    if (action.type) {
      dispatch(action)
    }
  }

  return (
    <StyledImageCont
      className={`cg-prtclk ${props.className || ''}`}
      id={props.id}
      style={{
        backgroundImage: props.back ? `url(${src})` : undefined,
      }}
      data-back={props.back != null}
      onClick={props.onClick || (props.click && clickDispatch) || undefined}
      data-action={props.click}
      data-payload={props.payload}
      data-var={props.var}
    >
      {!props.back ? (
        <img
          width={props.w}
          height={props.h}
          data-free={props.free != null}
          data-var={props.var}
          loading={props.lazy ? 'lazy' : undefined}
          src={src}
          alt=""
          onError={errorHandler}
        />
      ) : null}
    </StyledImageCont>
  )
}
