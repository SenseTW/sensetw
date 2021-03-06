import * as Konva from 'konva';

// XXX: 1?
// see: https://github.com/konvajs/konva/blob/f8bd25cbfe073e7093120503d530459f22d2292a/src/Util.js#L476
export enum NodeType {
  GROUP = 'Group',
  LAYER = 'Layer',
  SHAPE = 'Shape',
  STAGE = 'Stage',
  ONE = 1,
}

// The Konva event from https://github.com/konvajs/konva/issues/209
export namespace Event {
  export interface Mouse {
      type: 'mousedown' | 'mouseup'     | 'mouseover'   |
            'mouseout'  | 'mouseenter'  | 'mouseleave'  |
            'mousemove';
      target: Konva.Node & { nodeType: NodeType };
      currentTarget: Konva.Node;
      evt: MouseEvent;
      cancelBubble: boolean;
  }

  export interface Touch {
    type: 'touchstart' | 'touchmove' | 'touchend';
    target: Konva.Node & { nodeType: NodeType };
    currentTarget: Konva.Node;
    evt: TouchEvent;
    cancelBubble: boolean;
  }

  export interface MouseWheel {
      type: 'mousewheel';
      target: Konva.Node;
      currentTarget: Konva.Node;
      evt: MouseWheelEvent;
  }

}