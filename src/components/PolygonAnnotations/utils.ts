// @ts-ignore
export const getAvaragePoint = (points) => {
  let totalX = 0;
  let totalY = 0;
  for (let i = 0; i < points.length; i += 2) {
    totalX += points[i];
    totalY += points[i + 1];
  }
  return {
    x: totalX / (points.length / 2),
    y: totalY / (points.length / 2),
  };
};

// @ts-ignore
export const getDistance = (node1, node2) => {
  let diffX = Math.abs(node1[0] - node2[0]);
  let diffY = Math.abs(node1[1] - node2[1]);
  const distaneInPixel = Math.sqrt(diffX * diffX + diffY * diffY);
  // @ts-ignore
  return Number.parseFloat(distaneInPixel).toFixed(2);
};

// @ts-ignore
export const dragBoundFunc = (stageWidth, stageHeight, vertexRadius, pos) => {
  let x = pos.x;
  let y = pos.y;
  if (pos.x + vertexRadius > stageWidth) x = stageWidth;
  if (pos.x - vertexRadius < 0) x = 0;
  if (pos.y + vertexRadius > stageHeight) y = stageHeight;
  if (pos.y - vertexRadius < 0) y = 0;
  return { x, y };
};

// @ts-ignore
export const minMax = (points) => {
  // @ts-ignore
  return points.reduce((acc, val) => {
    acc[0] = acc[0] === undefined || val < acc[0] ? val : acc[0];
    acc[1] = acc[1] === undefined || val > acc[1] ? val : acc[1];
    return acc;
  }, []);
};
