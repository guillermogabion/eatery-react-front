import React from "react"
import { OverlayTrigger } from "react-bootstrap"

const OverlayComp: React.FC<any> = React.forwardRef((props, ref) => (
  <OverlayTrigger innerRef={ref} {...props}>
    {props.children}
  </OverlayTrigger>
))

export default OverlayComp
