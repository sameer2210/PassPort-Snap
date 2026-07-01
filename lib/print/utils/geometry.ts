export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export const GeometryUtils = {
  intersects: (a: Rect, b: Rect): boolean => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  },

  contains: (container: Rect, child: Rect): boolean => {
    return (
      child.x >= container.x &&
      child.x + child.width <= container.x + container.width &&
      child.y >= container.y &&
      child.y + child.height <= container.y + container.height
    );
  }
} as const;
