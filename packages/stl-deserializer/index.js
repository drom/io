// import { CSG } from '@jscad/csg'
// import { vt2jscad } from './vt2jscad'
const { CSG } = require('@jscad/csg')
const { vt2jscad } = require('./vt2jscad')
const BinaryReader = require('./BinaryReader')

// STL function from http://jsfiddle.net/Riham/yzvGD/35/
// CC BY-SA by Riham
// changes by Rene K. Mueller <spiritdude@gmail.com>
//
// 2013/03/28: lot of rework and debugging included, and error handling
// 2013/03/18: renamed functions, creating .jscad source direct via polyhedron()
const echo = console.info

function deserialize (stl, filename, options) {
  const defaults = {version: '0.0.0', addMetaData: true, output: 'jscad'}
  options = Object.assign({}, defaults, options)
  const {version, output, addMetaData} = options

  const isBinary = isDataBinaryRobust(stl)

  if (output === 'jscad') {
    let code = addMetaData ? `//
    // producer: OpenJSCAD.org Compatibility${version} STL Binary Importer
    // date: ${new Date()}
    // source: ${filename}
    //
    ` : ''

    return isBinary ? code + deserializeBinarySTL(stl, filename, version) : code + deserializeAsciiSTL(stl, filename, version)
  } else if (output === 'csg') {
    return isBinary ? deserializeBinarySTL(stl, filename, version) : deserializeAsciiSTLToCSG(stl, filename, version)
  }
}

function ensureString (buf) {
  if (typeof buf !== 'string') {
    let arrayBuffer = new Uint8Array(buf)
    let str = ''
    for (var i = 0; i < buf.byteLength; i++) {
      str += String.fromCharCode(arrayBuffer[i]) // implicitly assumes little-endian
    }
    return str
  } else {
    return buf
  }
}

function isDataBinaryRobust (data) {
  // console.log('data is binary ?')
  const patternVertex = /vertex[\s]+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+/g
  const text = ensureString(data)
  const isBinary = patternVertex.exec(text) === null
  return isBinary
}

function deserializeBinarySTL (stl, filename, version) {
    // -- This makes more sense if you read http://en.wikipedia.org/wiki/STL_(file_format)#Binary_STL
  var vertices = []
  var triangles = []
  var normals = []
  var colors = []
  let converted = 0
  var vertexIndex = 0
  var err = 0
  var mcolor = null
  var umask = parseInt('01000000000000000', 2)
  var rmask = parseInt('00000000000011111', 2)
  var gmask = parseInt('00000001111100000', 2)
  var bmask = parseInt('00111110000000000', 2)
  var br = new BinaryReader(stl)

  var m = 0, c = 0, r = 0, g = 0, b = 0, a = 0
  for (var i = 0; i < 80; i++) {
    switch (m) {
      case 6:
        r = br.readUInt8()
        m += 1
        continue
      case 7:
        g = br.readUInt8()
        m += 1
        continue
      case 8:
        b = br.readUInt8()
        m += 1
        continue
      case 9:
        a = br.readUInt8()
        m += 1
        continue
      default:
        c = br.readChar()
        switch (c) {
          case 'C':
          case 'O':
          case 'L':
          case 'R':
          case '=':
            m += 1
          default:
            break
        }
        break
    }
  }
  if (m === 10) { // create the default color
    mcolor = [r / 255, g / 255, b / 255, a / 255]
  }

  var totalTriangles = br.readUInt32() // Read # triangles

  for (var tr = 0; tr < totalTriangles; tr++) {
        // if(tr%100==0) status('stl importer: converted '+converted+' out of '+totalTriangles+' triangles');
        /*
             REAL32[3] . Normal vector
             REAL32[3] . Vertex 1
             REAL32[3] . Vertex 2
             REAL32[3] . Vertex 3
                UINT16 . Attribute byte count */
        // -- Parse normal
    var no = []; no.push(br.readFloat()); no.push(br.readFloat()); no.push(br.readFloat())

        // -- Parse every 3 subsequent floats as a vertex
    var v1 = []; v1.push(br.readFloat()); v1.push(br.readFloat()); v1.push(br.readFloat())
    var v2 = []; v2.push(br.readFloat()); v2.push(br.readFloat()); v2.push(br.readFloat())
    var v3 = []; v3.push(br.readFloat()); v3.push(br.readFloat()); v3.push(br.readFloat())

    var skip = 0
    if (1) {
      for (let i = 0; i < 3; i++) {
        if (isNaN(v1[i])) skip++
        if (isNaN(v2[i])) skip++
        if (isNaN(v3[i])) skip++
        if (isNaN(no[i])) skip++
      }
      if (skip > 0) {
        echo('bad triangle vertice coords/normal: ', skip)
      }
    }
    err += skip
        // -- every 3 vertices create a triangle.
    var triangle = []; triangle.push(vertexIndex++); triangle.push(vertexIndex++); triangle.push(vertexIndex++)

    var abc = br.readUInt16()
    var color = null
    if (m === 10) {
      var u = (abc & umask) // 0 if color is unique for this triangle
      let r = (abc & rmask) / 31
      let g = ((abc & gmask) >>> 5) / 31
      let b = ((abc & bmask) >>> 10) / 31
      let a = 255
      if (u === 0) {
        color = [r, g, b, a]
      } else {
        color = mcolor
      }
      colors.push(color)
    }

        // -- Add 3 vertices for every triangle
        // -- TODO: OPTIMIZE: Check if the vertex is already in the array, if it is just reuse the index
    if (skip === 0) {  // checking cw vs ccw, given all normal/vertice are valid
           // E1 = B - A
           // E2 = C - A
           // test = dot( Normal, cross( E1, E2 ) )
           // test > 0: cw, test < 0 : ccw
      var w1 = new CSG.Vector3D(v1)
      var w2 = new CSG.Vector3D(v2)
      var w3 = new CSG.Vector3D(v3)
      var e1 = w2.minus(w1)
      var e2 = w3.minus(w1)
      var t = new CSG.Vector3D(no).dot(e1.cross(e2))
      if (t > 0) {    // 1,2,3 -> 3,2,1
        var tmp = v3
        v3 = v1
        v1 = tmp
      }
    }
    vertices.push(v1)
    vertices.push(v2)
    vertices.push(v3)
    triangles.push(triangle)
    normals.push(no)
    converted++
  }
  var src = ''

  if (err) src += '// WARNING: import errors: ' + err + ' (some triangles might be misaligned or missing)\n'
  src += '// objects: 1\n// object #1: triangles: ' + totalTriangles + '\n\n'
  src += 'function main() { return '
  src += vt2jscad(vertices, triangles, normals, colors)
  src += '; }'
  return src
}

function deserializeAsciiSTL (stl, filename, version) {
  var src = ''
  var n = 0
  var converted = 0
  var o

  src += 'function main() { return union(\n'
    // -- Find all models
  var objects = stl.split('endsolid')
  src += '// objects: ' + (objects.length - 1) + '\n'

  for (o = 1; o < objects.length; o++) {
        // -- Translation: a non-greedy regex for facet {...} endloop pattern
    var patt = /\bfacet[\s\S]*?endloop/mgi
    var vertices = []
    var triangles = []
    var normals = []
    var vertexIndex = 0
    var err = 0

    var match = stl.match(patt)
    if (match == null) continue
    for (var i = 0; i < match.length; i++) {
            // if(converted%100==0) status('stl to jscad: converted '+converted+' out of '+match.length+ ' facets');
            // -- 1 normal with 3 numbers, 3 different vertex objects each with 3 numbers:
            // var vpatt = /\bfacet\s+normal\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*outer\s+loop\s+vertex\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*vertex\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*vertex\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/mgi;
                                         // (-?\d+\.?\d*) -1.21223
                                         // (-?\d+\.?\d*[Ee]?[-+]?\d*)
      var vpatt = /\bfacet\s+normal\s+(\S+)\s+(\S+)\s+(\S+)\s+outer\s+loop\s+vertex\s+(\S+)\s+(\S+)\s+(\S+)\s+vertex\s+(\S+)\s+(\S+)\s+(\S+)\s+vertex\s+(\S+)\s+(\S+)\s+(\S+)\s*/mgi
      var v = vpatt.exec(match[i])
      if (v == null) continue
      if (v.length !== 13) {
        echo('Failed to parse ' + match[i])
        break
      }
      var skip = 0
      for (var k = 0; k < v.length; k++) {
        if (v[k] === 'NaN') {
          echo('bad normal or triangle vertice #' + converted + ' ' + k + ": '" + v[k] + "', skipped")
          skip++
        }
      }
      err += skip
      if (skip) {
        continue
      }
      if (0 && skip) {
        let j = 1 + 3
        let v1 = []; v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++]))
        let v2 = []; v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++]))
        let v3 = []; v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++]))
        echo('recalculate norm', v1, v2, v3)
        var w1 = new CSG.Vector3D(v1)
        var w2 = new CSG.Vector3D(v2)
        var w3 = new CSG.Vector3D(v3)
        var _u = w1.minus(w3)
        var _v = w1.minus(w2)
        var norm = _u.cross(_v).unit()
        j = 1
        v[j++] = norm._x
        v[j++] = norm._y
        v[j++] = norm._z
        skip = false
      }
      let j = 1
      let no = []; no.push(parseFloat(v[j++])); no.push(parseFloat(v[j++])); no.push(parseFloat(v[j++]))
      let v1 = []; v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++]))
      var v2 = []; v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++]))
      var v3 = []; v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++]))
      var triangle = []; triangle.push(vertexIndex++); triangle.push(vertexIndex++); triangle.push(vertexIndex++)

            // -- Add 3 vertices for every triangle
            //    TODO: OPTIMIZE: Check if the vertex is already in the array, if it is just reuse the index
      if (skip === 0) {  // checking cw vs ccw
               // E1 = B - A
               // E2 = C - A
               // test = dot( Normal, cross( E1, E2 ) )
               // test > 0: cw, test < 0: ccw
        var w1 = new CSG.Vector3D(v1)
        var w2 = new CSG.Vector3D(v2)
        var w3 = new CSG.Vector3D(v3)
        var e1 = w2.minus(w1)
        var e2 = w3.minus(w1)
        var t = new CSG.Vector3D(no).dot(e1.cross(e2))
        if (t > 0) {      // 1,2,3 -> 3,2,1
          var tmp = v3
          v3 = v1
          v1 = tmp
        }
      }
      vertices.push(v1)
      vertices.push(v2)
      vertices.push(v3)
      normals.push(no)
      triangles.push(triangle)
      converted++
    }
    if (n++) src += ','
    if (err) src += '// WARNING: import errors: ' + err + ' (some triangles might be misaligned or missing)\n'
    src += '// object #' + (o) + ': triangles: ' + match.length + '\n'
    src += vt2jscad(vertices, triangles, normals)
  }
  src += '); }\n'
  return src
}

function deserializeAsciiSTLToCSG (stl, filename, version) {
  var n = 0
  var converted = 0
  var o

  // src += 'function main() { return union(\n'
    // -- Find all models
  const objects = stl.split('endsolid')
  // src += '// objects: ' + (objects.length - 1) + '\n'
  let csgObjects = []
  for (o = 1; o < objects.length; o++) {
        // -- Translation: a non-greedy regex for facet {...} endloop pattern
    var patt = /\bfacet[\s\S]*?endloop/mgi
    var vertices = []
    var triangles = []
    var normals = []
    var vertexIndex = 0
    var err = 0

    var match = stl.match(patt)
    if (match == null) continue
    for (var i = 0; i < match.length; i++) {
            // if(converted%100==0) status('stl to jscad: converted '+converted+' out of '+match.length+ ' facets');
            // -- 1 normal with 3 numbers, 3 different vertex objects each with 3 numbers:
            // var vpatt = /\bfacet\s+normal\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*outer\s+loop\s+vertex\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*vertex\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*vertex\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/mgi;
                                         // (-?\d+\.?\d*) -1.21223
                                         // (-?\d+\.?\d*[Ee]?[-+]?\d*)
      var vpatt = /\bfacet\s+normal\s+(\S+)\s+(\S+)\s+(\S+)\s+outer\s+loop\s+vertex\s+(\S+)\s+(\S+)\s+(\S+)\s+vertex\s+(\S+)\s+(\S+)\s+(\S+)\s+vertex\s+(\S+)\s+(\S+)\s+(\S+)\s*/mgi
      var v = vpatt.exec(match[i])
      if (v == null) continue
      if (v.length !== 13) {
        echo('Failed to parse ' + match[i])
        break
      }
      var skip = 0
      for (var k = 0; k < v.length; k++) {
        if (v[k] === 'NaN') {
          echo('bad normal or triangle vertice #' + converted + ' ' + k + ": '" + v[k] + "', skipped")
          skip++
        }
      }
      err += skip
      if (skip) {
        continue
      }
      if (0 && skip) {
        let j = 1 + 3
        let v1 = []; v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++]))
        let v2 = []; v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++]))
        let v3 = []; v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++]))
        echo('recalculate norm', v1, v2, v3)
        var w1 = new CSG.Vector3D(v1)
        var w2 = new CSG.Vector3D(v2)
        var w3 = new CSG.Vector3D(v3)
        var _u = w1.minus(w3)
        var _v = w1.minus(w2)
        var norm = _u.cross(_v).unit()
        j = 1
        v[j++] = norm._x
        v[j++] = norm._y
        v[j++] = norm._z
        skip = false
      }
      let j = 1
      let no = []; no.push(parseFloat(v[j++])); no.push(parseFloat(v[j++])); no.push(parseFloat(v[j++]))
      let v1 = []; v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++])); v1.push(parseFloat(v[j++]))
      var v2 = []; v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++])); v2.push(parseFloat(v[j++]))
      var v3 = []; v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++])); v3.push(parseFloat(v[j++]))
      var triangle = []; triangle.push(vertexIndex++); triangle.push(vertexIndex++); triangle.push(vertexIndex++)

            // -- Add 3 vertices for every triangle
            //    TODO: OPTIMIZE: Check if the vertex is already in the array, if it is just reuse the index
      if (skip === 0) {  // checking cw vs ccw
               // E1 = B - A
               // E2 = C - A
               // test = dot( Normal, cross( E1, E2 ) )
               // test > 0: cw, test < 0: ccw
        var w1 = new CSG.Vector3D(v1)
        var w2 = new CSG.Vector3D(v2)
        var w3 = new CSG.Vector3D(v3)
        var e1 = w2.minus(w1)
        var e2 = w3.minus(w1)
        var t = new CSG.Vector3D(no).dot(e1.cross(e2))
        if (t > 0) {      // 1,2,3 -> 3,2,1
          var tmp = v3
          v3 = v1
          v1 = tmp
        }
      }
      vertices.push(v1)
      vertices.push(v2)
      vertices.push(v3)
      normals.push(no)
      triangles.push(triangle)
      converted++
    }
    /* if (n++) src += ','
    if (err) src += '// WARNING: import errors: ' + err + ' (some triangles might be misaligned or missing)\n'
    src += '// object #' + (o) + ': triangles: ' + match.length + '\n'
    src += vt2jscad(vertices, triangles, normals) */
    csgObjects.push(
      polyhedron({ points: vertices, polygons: triangles})
    )
  }

  // src += '); }\n'
  return new CSG().union(csgObjects)
}

// FIXME : just a stand in for now from scad-api, not sure if we should rely on scad-api from here ?
function polyhedron (p) {
  var pgs = []
  var ref = p.triangles || p.polygons
  var colors = p.colors || null

  for (var i = 0; i < ref.length; i++) {
    var pp = []
    for (var j = 0; j < ref[i].length; j++) {
      pp[j] = p.points[ref[i][j]]
    }

    var v = []
    for (j = ref[i].length - 1; j >= 0; j--) { // --- we reverse order for examples of OpenSCAD work
      v.push(new CSG.Vertex(new CSG.Vector3D(pp[j][0], pp[j][1], pp[j][2])))
    }
    var s = CSG.Polygon.defaultShared
    if (colors && colors[i]) {
      s = CSG.Polygon.Shared.fromColor(colors[i])
    }
    pgs.push(new CSG.Polygon(v, s))
  }
  var r = CSG.fromPolygons(pgs)
  return r
}

module.exports = {
  deserialize
}
