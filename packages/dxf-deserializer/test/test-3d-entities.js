const fs = require('fs')
const path = require('path')
const test = require('ava')
const { CSG, CAG } = require('@jscad/csg')

import {nearlyEqual} from '../../../test/helpers/nearlyEqual'

const { deserialize } = require( '../index' )

//
// Test suite for DXF deserialization (import)
//
test('ASCII DXF from Bourke 3D Entities to Object Conversion', t => {
  const dxfPath = path.resolve(__dirname, '../../../../sample-files/dxf/bourke/3d-entities.dxf')
  t.deepEqual(true, fs.existsSync(dxfPath))

  let dxf = fs.readFileSync(dxfPath, 'UTF8')
  let objs = deserialize(dxf,'aaa',{output: 'csg'})

// expect one layer, containing 2 objects (CSG, and Line3D)
  t.true(Array.isArray(objs))
  t.is(objs.length,2)
  t.true(objs[0] instanceof CSG.Line3D)
  t.true(objs[1] instanceof CSG)
})

test('ASCII DXF from JSCAD 3D Shapes to Object Conversion',  t => {
// instantiate from a simple shape
  let dxfPath = path.resolve(__dirname, '../../../../sample-files/dxf/jscad/pyramid.dxf')
  t.deepEqual(true, fs.existsSync(dxfPath))

  let dxf  = fs.readFileSync(dxfPath, 'UTF8')
  let objs = deserialize(dxf,'pyramid',{output: 'csg'})

// expect one layer, containing one solid (CSG)
  t.true(Array.isArray(objs))
  t.is(objs.length,1)
  let csg = objs[0]
  t.true(csg instanceof CSG)
  let features = csg.getFeatures(['volume', 'area'])
  //nearlyEqual(t, features[0], 5462.38756989, 1e-8)
  //nearlyEqual(t, features[1], 3000.18768622, 1e-8)

// instantiate from a simple shape
  dxfPath = path.resolve(__dirname, '../../../../sample-files/dxf/jscad/cube.dxf')
  t.deepEqual(true, fs.existsSync(dxfPath))

  dxf  = fs.readFileSync(dxfPath, 'UTF8')
  objs = deserialize(dxf,'cube',{output: 'csg'})

// expect one layer, containing one solid (CSG)
  t.true(Array.isArray(objs))
  t.is(objs.length,1)
  csg = objs[0]
  t.true(csg instanceof CSG)
  features = csg.getFeatures(['volume', 'area'])
  //nearlyEqual(t, features[0], 8000, 1e-8)
  //nearlyEqual(t, features[1], 2400, 1e-8)

// instantiate from a simple shape
  dxfPath = path.resolve(__dirname, '../../../../sample-files/dxf/jscad/sphere.dxf')
  t.deepEqual(true, fs.existsSync(dxfPath))

  dxf  = fs.readFileSync(dxfPath, 'UTF8')
  objs = deserialize(dxf,'sphere',{output: 'csg'})

// expect one layer, containing one solid (CSG)
  t.true(Array.isArray(objs))
  t.is(objs.length,1)
  csg = objs[0]
  t.true(csg instanceof CSG)
  features = csg.getFeatures(['volume', 'area'])
  //nearlyEqual(t, features[0], 3732.05078230, 1e-8)
  //nearlyEqual(t, features[1], 1186.12882818, 1e-8)

// instantiate from a simple shape
  dxfPath = path.resolve(__dirname, '../../../../sample-files/dxf/jscad/cylinder.dxf')
  t.deepEqual(true, fs.existsSync(dxfPath))

  dxf  = fs.readFileSync(dxfPath, 'UTF8')
  objs = deserialize(dxf,'cylinder',{output: 'csg'})

// expect one layer, containing one solid (CSG)
  t.true(Array.isArray(objs))
  t.is(objs.length,1)
  csg = objs[0]
  t.true(csg instanceof CSG)
  features = csg.getFeatures(['volume', 'area'])
  //nearlyEqual(t, features[0], 6242.89017101, 1e-8)
  //nearlyEqual(t, features[1], 1878.90839990, 1e-8)
})


test('ASCII DXF from Autocad2017 3D Lines to Object Conversion',  t => {
  let dxfPath = path.resolve(__dirname, '../../../../sample-files/dxf/autocad2017/3Dlines.dxf')
  t.deepEqual(true, fs.existsSync(dxfPath))

  let dxf  = fs.readFileSync(dxfPath, 'UTF8')
  let objs = deserialize(dxf,'3Dlines',{output: 'csg'})

// expect one layer, containing three objects (Path2D,Path2D,Line3D)
  t.true(Array.isArray(objs))
  t.is(objs.length,3)

  let obj = objs[0]
  t.true(obj instanceof CSG.Path2D)
  obj = objs[1]
  t.true(obj instanceof CSG.Path2D)
  obj = objs[2]
  t.true(obj instanceof CSG.Line3D)
})


test.skip('ASCII DXF from Autocad2017 3D Boxes to Object Conversion',  t => {
  let dxfPath = path.resolve(__dirname, '../../../../sample-files/dxf/autocad2017/3Dboxes.dxf')
  t.deepEqual(true, fs.existsSync(dxfPath))

  let dxf  = fs.readFileSync(dxfPath, 'UTF8')
  let objs = deserialize(dxf,'3Dboxes',{output: 'csg'})

// expect nothing as 3DSOLID entities cannot be converted
  t.true(Array.isArray(objs))
  t.is(objs.length,0)
})


test.skip('ASCII DXF from Autocad2017 3D Drawing Shapes to Object Conversion',  t => {
  let dxfPath = path.resolve(__dirname, '../../../../sample-files/dxf/autocad2017/3Ddraw.dxf')
  t.deepEqual(true, fs.existsSync(dxfPath))

  let dxf  = fs.readFileSync(dxfPath, 'UTF8')
  let objs = deserialize(dxf,'3Ddraw',{output: 'csg'})

// expect nothing as 3DSOLID entities cannot be converted
  t.true(Array.isArray(objs))
  t.is(objs.length,0)
})


test.skip('ASCII DXF from Autocad2017 3D Mesh to Object Conversion',  t => {
  let dxfPath = path.resolve(__dirname, '../../../../sample-files/dxf/autocad2017/3Dmesh01.dxf')
  t.deepEqual(true, fs.existsSync(dxfPath))

  let dxf  = fs.readFileSync(dxfPath, 'UTF8')
  let objs = deserialize(dxf,'3Dmesh01',{output: 'csg'})

// expect nothing as 3DSOLID entities cannot be converted
  t.true(Array.isArray(objs))
  t.is(objs.length,0)
})
