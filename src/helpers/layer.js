function getLineByIdFrom(aLayer, id) {
  return aLayer.getChildren((node) => {
    return node._id === id
  })[0]
}

function addPointTo(aLine, point) {
  const newPoints = aLine.points().concat(point)
  aLine.points(newPoints)
}

export default {
  getLineByIdFrom,
  addPointTo
}