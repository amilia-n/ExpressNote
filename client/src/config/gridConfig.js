export const GRID_CONFIG = {
    containerWidth: 595.28,
    containerHeight: 841.89,
    columns: 42,
    rowHeight: 20,
    margin: [0, 0],
    padding: [0, 0],
    
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 42, md: 42, sm: 42, xs: 42, xxs: 42 },
    isDraggable: true,
    isResizable: true,
    useCSSTransforms: true,
    preventCollision: true,
    compactType: null,
    autoSize: false,
    verticalCompact: false,
    isBounded: true,
    allowOverlap: true,
    transformScale: 1,
    droppingItem: {
      i: "__dropping-elem__",
      h: 10,
      w: 10,
    }
  };