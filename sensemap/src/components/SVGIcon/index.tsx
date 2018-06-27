import * as React from 'react';
import * as cx from 'classnames';
/// <reference path="../../types/semantic-ui-react-lib.ts"/>
import { useKeyOnly, useValueAndKey } from 'semantic-ui-react/dist/commonjs/lib';
import './index.css';

export interface Props {
  id?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  fill?: string;
  bordered?: boolean;
  circular?: boolean;
  color?: string;
  corner?: boolean;
  disabled?: boolean;
  flipped?: 'horizontally' | 'vertically';
  inverted?: boolean;
  link?: boolean;
  loading?: boolean;
  rotated?: 'clockwise' | 'counterclockwise';
  size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';
  'aria-hidden'?: string;
  'aria-label'?: string;
}

class SVGIcon extends React.PureComponent<Props> {
  static defaultProps: Props = {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
  };

  render() {
    const {
      // React props
      id,
      className,
      children,
      // SVG props
      width,
      height,
      viewBox,
      // Icon props
      bordered,
      circular,
      color,
      corner,
      disabled,
      flipped,
      inverted,
      link,
      loading,
      rotated,
      size,
    } = this.props;
    const classes = cx(
      color,
      size,
      useKeyOnly(bordered, 'bordered'),
      useKeyOnly(circular, 'circular'),
      useKeyOnly(corner, 'corner'),
      useKeyOnly(disabled, 'disabled'),
      useKeyOnly(inverted, 'inverted'),
      useKeyOnly(link, 'link'),
      useKeyOnly(loading, 'loading'),
      useValueAndKey(flipped, 'flipped'),
      useValueAndKey(rotated, 'rotated'),
      'sense-svg-icon',
      className,
    );

    return (
      <svg
        id={id}
        className={classes}
        width={width}
        height={height}
        viewBox={viewBox}
      >
        {children}
      </svg>
    );
  }
}

export default SVGIcon;