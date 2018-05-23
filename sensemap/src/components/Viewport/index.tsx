// import * as React from 'react';

interface RenderPropArguments {
  width:  number;
  height: number;
  top:    number;
  left:   number;
}

interface RenderProp {
  (a: RenderPropArguments): JSX.Element;
}

interface Props {
  children: RenderProp;
}

function Viewport(props: Props) {
  return props.children({
    top: 100,
    left: 100,
    width: 640,
    height: 400,
  });
}

export default Viewport;
