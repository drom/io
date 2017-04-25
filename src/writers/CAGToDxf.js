import { makeBlob } from '../utils/Blob'
const Blob = makeBlob()

export const mimeType = 'application/dxf'

export default function CAGToDxf (cagObject) {
  var paths = cagObject.getOutlinePaths()
  return PathsToDxf(paths)
}

function PathsToDxf (paths) {
  var str = '999\nDXF generated by OpenJsCad\n'
  str += '  0\nSECTION\n  2\nHEADER\n'
  str += '  0\nENDSEC\n'
  str += '  0\nSECTION\n  2\nTABLES\n'
  str += '  0\nTABLE\n  2\nLTYPE\n  70\n1\n'
  str += '  0\nLTYPE\n  2\nCONTINUOUS\n  3\nSolid Line\n  72\n65\n  73\n0\n  40\n0.0\n'
  str += '  0\nENDTAB\n'
  str += '  0\nTABLE\n  2\nLAYER\n  70\n1\n'
  str += '  0\nLAYER\n  2\nOpenJsCad\n  62\n7\n  6\ncontinuous\n'
  str += '  0\nENDTAB\n'
  str += '  0\nTABLE\n  2\nSTYLE\n  70\n0\n  0\nENDTAB\n'
  str += '  0\nTABLE\n  2\nVIEW\n  70\n0\n  0\nENDTAB\n'
  str += '  0\nENDSEC\n'
  str += '  0\nSECTION\n  2\nBLOCKS\n'
  str += '  0\nENDSEC\n'
  str += '  0\nSECTION\n  2\nENTITIES\n'
  paths.map(function (path) {
    var numpoints_closed = path.points.length + (path.closed ? 1 : 0)
    str += '  0\nLWPOLYLINE\n  8\nOpenJsCad\n  90\n' + numpoints_closed + '\n  70\n' + (path.closed ? 1 : 0) + '\n'
    for (var pointindex = 0; pointindex < numpoints_closed; pointindex++) {
      var pointindexwrapped = pointindex
      if (pointindexwrapped >= path.points.length) pointindexwrapped -= path.points.length
      var point = path.points[pointindexwrapped]
      str += ' 10\n' + point.x + '\n 20\n' + point.y + '\n 30\n0.0\n'
    }
  })
  str += '  0\nENDSEC\n  0\nEOF\n'
  return new Blob([str], {
    type: mimeType
  })
}
