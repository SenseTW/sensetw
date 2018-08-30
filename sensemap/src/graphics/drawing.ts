export interface Position {
  x: number;
  y: number;
}

export interface Dimension {
  width: number;
  height: number;
}

export enum AnchorType {
  CENTER        = 'CENTER',
  TOP_LEFT      = 'TOP_LEFT',
  TOP_RIGHT     = 'TOP_RIGHT',
  BOTTOM_RIGHT  = 'BOTTOM_RIGHT',
  BOTTOM_LEFT   = 'BOTTOM_LEFT',
  RIGHT_CENTER  = 'RIGHT_CENTER',
  LEFT_CENTER   = 'LEFT_CENTER',
  TOP_CENTER    = 'TOP_CENTER',
  BOTTOM_CENTER = 'BOTTOM_CENTER',
}

/**
 * The center of the drawing object. It defaults to `AnchorType.CENTER`.
 */
export interface Anchor {
  anchor: AnchorType;
}

// TODO: give it another alias
export type BoundingBox = Position & Dimension & Anchor;

export const emptyBoundingBox = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  anchor: AnchorType.CENTER,
};

/**
 * An alternative representation of the `BoundingBox` to eazy the computation.
 *
 * @see {BoundingBox}
 */
export interface BoundingRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const emptyBoundingRect = {
  top: Infinity,
  right: -Infinity,
  bottom: -Infinity,
  left: Infinity,
};

export const rectFromBox = (box: BoundingBox): BoundingRect => {
  if (box.width < Number.EPSILON || box.height < Number.EPSILON) {
    return emptyBoundingRect;
  }

  switch (box.anchor) {
    case AnchorType.TOP_LEFT:
      return {
        top: box.y,
        right: box.x + box.width,
        bottom: box.y + box.height,
        left: box.x,
      };
    case AnchorType.TOP_RIGHT:
      return {
        top: box.y,
        right: box.x,
        bottom: box.y + box.height,
        left: box.x - box.width,
      };
    case AnchorType.BOTTOM_LEFT:
      return {
        top: box.y - box.height,
        right: box.x + box.width,
        bottom: box.y,
        left: box.x,
      };
    case AnchorType.BOTTOM_RIGHT:
      return {
        top: box.y - box.height,
        right: box.x,
        bottom: box.y,
        left: box.x - box.width,
      };
    case AnchorType.RIGHT_CENTER:
      return {
        top: box.y - box.height / 2,
        right: box.x,
        bottom: box.y + box.height / 2,
        left: box.x - box.width,
      };
    case AnchorType.LEFT_CENTER:
      return {
        top: box.y - box.height / 2,
        right: box.x + box.width,
        bottom: box.y + box.height / 2,
        left: box.x,
      };
    case AnchorType.TOP_CENTER:
      return {
        top: box.y,
        right: box.x + box.width / 2,
        bottom: box.y + box.height,
        left: box.x + box.width / 2,
      };
    case AnchorType.BOTTOM_CENTER:
      return {
        top: box.y - box.height,
        right: box.x + box.width / 2,
        bottom: box.y,
        left: box.x - box.width / 2,
      };
    case AnchorType.CENTER:
    default:
      return {
        top: box.y - box.height / 2,
        right: box.x + box.width / 2,
        bottom: box.y + box.height / 2,
        left: box.x - box.width / 2,
      };
  }
};

export const boxFromRect = (rect: BoundingRect, anchor: AnchorType): BoundingBox => {
  if (
    rect.top === emptyBoundingRect.top &&
    rect.right === emptyBoundingRect.right &&
    rect.bottom === emptyBoundingRect.bottom &&
    rect.left === emptyBoundingRect.left
  ) {
    return emptyBoundingBox;
  }

  const width = rect.right - rect.left;
  const height = rect.bottom - rect.top;

  switch (anchor) {
    case AnchorType.TOP_LEFT:
      return {
        anchor,
        width,
        height,
        x: rect.left,
        y: rect.top,
      };
    case AnchorType.TOP_RIGHT:
      return {
        anchor,
        width,
        height,
        x: rect.right,
        y: rect.top,
      };
    case AnchorType.BOTTOM_RIGHT:
      return {
        anchor,
        width,
        height,
        x: rect.right,
        y: rect.bottom,
      };
    case AnchorType.BOTTOM_LEFT:
      return {
        anchor,
        width,
        height,
        x: rect.left,
        y: rect.bottom,
      };
    case AnchorType.RIGHT_CENTER:
      return {
        anchor,
        width,
        height,
        x: rect.right,
        y: (rect.top + rect.bottom) / 2,
      };
    case AnchorType.LEFT_CENTER:
      return {
        anchor,
        width,
        height,
        x: rect.left,
        y: (rect.top + rect.bottom) / 2,
      };
    case AnchorType.TOP_CENTER:
      return {
        anchor,
        width,
        height,
        x: (rect.left + rect.right) / 2,
        y: rect.top,
      };
    case AnchorType.BOTTOM_CENTER:
      return {
        anchor,
        width,
        height,
        x: (rect.left + rect.right) / 2,
        y: rect.bottom,
      };
    case AnchorType.CENTER:
    default:
      return {
        anchor,
        width,
        height,
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2,
      };
  }
};

export const flatten = (objects: BoundingBox[], anchor: AnchorType = AnchorType.CENTER): BoundingBox =>
  boxFromRect(
    objects.reduce(
      (result, box) => {
        const rect = rectFromBox(box);
        return {
          top: rect.top < result.top ? rect.top : result.top,
          right: rect.right > result.right ? rect.right : result.right,
          bottom: rect.bottom > result.bottom ? rect.bottom : result.bottom,
          left: rect.left < result.left ? rect.left : result.left,
        };
      },
      emptyBoundingRect
    ),
    anchor
  );
