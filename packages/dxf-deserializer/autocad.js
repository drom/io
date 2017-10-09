/*
 * AutoCAD Constants
 */

/*
 * AutoCAD Color Index (0-255) as RGB + ALPHA colors
 */

const colorIndex = [
  [255,0,0,1],
  [255,255,0,1],
  [0,255,0,1],
  [0,255,255,1],
  [0,0,255,1],
  [255,0,255,1],
  [255,255,255,1],
  [128,128,128,1],
  [192,192,192,1],
// 10
  [255,0,0,1],
  [255,127,127,1],
  [165,0,0,1],
  [165,82,82,1],
  [127,0,0,1],
  [127,63,63,1],
  [76,0,0,1],
  [76,38,38,1],
  [38,0,0,1],
  [38,19,19,1],
// 20
  [255,63,0,1],
  [255,159,127,1],
  [165,41,0,1],
  [165,103,82,1],
  [127,31,0,1],
  [127,79,63,1],
  [76,19,0,1],
  [76,47,38,1],
  [38,9,0,1],
  [38,23,19,1],
// 30
  [255,127,0,1],
  [255,191,127,1],
  [165,82,0,1],
  [165,124,82,1],
  [127,63,0,1],
  [127,95,63,1],
  [76,38,0,1],
  [76,57,38,1],
  [38,19,0,1],
  [38,28,19,1],
// 40
  [255,191,0,1],
  [255,223,127,1],
  [165,124,0,1],
  [165,145,82,1],
  [127,95,0,1],
  [127,111,63,1],
  [76,57,0,1],
  [76,66,38,1],
  [38,28,0,1],
  [38,33,19,1],
// 50
  [255,255,0,1],
  [255,255,127,1],
  [165,165,0,1],
  [165,165,82,1],
  [127,127,0,1],
  [127,127,63,1],
  [76,76,0,1],
  [76,76,38,1],
  [38,38,0,1],
  [38,38,19,1],
// 60
  [191,255,0,1],
  [223,255,127,1],
  [124,165,0,1],
  [145,165,82,1],
  [95,127,0,1],
  [111,127,63,1],
  [57,76,0,1],
  [66,76,38,1],
  [28,38,0,1],
  [33,38,19,1],
// 70
  [127,255,0,1],
  [191,255,127,1],
  [82,165,0,1],
  [124,165,82,1],
  [63,127,0,1],
  [95,127,63,1],
  [38,76,0,1],
  [57,76,38,1],
  [19,38,0,1],
  [28,38,19,1],
// 80
  [63,255,0,1],
  [159,255,127,1],
  [41,165,0,1],
  [103,165,82,1],
  [31,127,0,1],
  [127,63,1],
  [19,76,0,1],
  [47,76,38,1],
  [9,38,0,1],
  [23,38,19,1],
// 90
  [0,255,0,1],
  [127,255,127,1],
  [0,165,0,1],
  [82,165,82,1],
  [0,127,0,1],
  [63,127,63,1],
  [0,76,0,1],
  [38,76,38,1],
  [0,38,0,1],
  [19,38,19,1],
// 100
  [0,255,63,1],
  [127,255,159,1],
  [0,165,41,1],
  [82,165,103,1],
  [0,127,31,1],
  [63,127,79,1],
  [0,76,19,1],
  [38,76,47,1],
  [0,38,9,1],
  [19,38,23,1],
// 110
  [0,255,127,1],
  [127,255,191,1],
  [0,165,82,1],
  [82,165,124,1],
  [0,127,63,1],
  [63,127,95,1],
  [0,76,38,1],
  [38,76,57,1],
  [0,38,19,1],
  [19,38,28,1],
// 120
  [0,255,191,1],
  [127,255,223,1],
  [0,165,124,1],
  [82,165,145,1],
  [0,127,95,1],
  [63,127,111,1],
  [0,76,57,1],
  [38,76,66,1],
  [0,38,28,1],
  [19,38,33,1],
// 130
  [0,255,255,1],
  [127,255,255,1],
  [0,165,165,1],
  [82,165,165,1],
  [0,127,127,1],
  [63,127,127,1],
  [0,76,76,1],
  [38,76,76,1],
  [0,38,38,1],
  [19,38,38,1],
// 140
  [0,191,255,1],
  [127,223,255,1],
  [0,124,165,1],
  [82,145,165,1],
  [0,95,127,1],
  [63,111,127,1],
  [0,57,76,1],
  [38,66,76,1],
  [0,28,38,1],
  [19,33,38,1],
// 150
  [0,127,255,1],
  [127,191,255,1],
  [0,82,165,1],
  [82,124,165,1],
  [0,63,127,1],
  [63,95,127,1],
  [0,38,76,1],
  [38,57,76,1],
  [0,19,38,1],
  [19,28,38,1],
// 160
  [0,63,255,1],
  [127,159,255,1],
  [0,41,165,1],
  [82,103,165,1],
  [0,31,127,1],
  [63,79,127,1],
  [0,19,76,1],
  [38,47,76,1],
  [0,9,38,1],
  [19,23,38,1],
// 170
  [0,0,255,1],
  [127,127,255,1],
  [0,0,165,1],
  [82,82,165,1],
  [0,0,127,1],
  [63,63,127,1],
  [0,0,76,1],
  [38,38,76,1],
  [0,0,38,1],
  [19,19,38,1],
// 180
  [63,0,255,1],
  [159,127,255,1],
  [41,0,165,1],
  [103,82,165,1],
  [31,0,127,1],
  [79,63,127,1],
  [19,0,76,1],
  [47,38,76,1],
  [9,0,38,1],
  [23,19,38,1],
// 190
  [127,0,255,1],
  [191,127,255,1],
  [82,0,165,1],
  [124,82,165,1],
  [63,0,127,1],
  [95,63,127,1],
  [38,0,76,1],
  [57,38,76,1],
  [19,0,38,1],
  [28,19,38,1],
// 200
  [191,0,255,1],
  [223,127,255,1],
  [124,0,165,1],
  [145,82,165,1],
  [95,0,127,1],
  [111,63,127,1],
  [57,0,76,1],
  [66,38,76,1],
  [28,0,38,1],
  [33,19,38,1],
// 210
  [255,0,255,1],
  [255,127,255,1],
  [165,0,165,1],
  [165,82,165,1],
  [127,0,127,1],
  [127,63,127,1],
  [76,0,76,1],
  [76,38,76,1],
  [38,0,38,1],
  [38,19,38,1],
// 220
  [255,0,191,1],
  [255,127,223,1],
  [165,0,124,1],
  [165,82,145,1],
  [127,0,95,1],
  [127,63,111,1],
  [76,0,57,1],
  [76,38,66,1],
  [38,0,28,1],
  [38,19,33,1],
// 230
  [255,0,127,1],
  [255,127,191,1],
  [165,0,82,1],
  [165,82,124,1],
  [127,0,63,1],
  [127,63,95,1],
  [76,0,38,1],
  [76,38,57,1],
  [38,0,19,1],
  [38,19,28,1],
// 240
  [255,0,63,1],
  [255,127,159,1],
  [165,0,41,1],
  [165,82,103,1],
  [127,0,31,1],
  [127,63,79,1],
  [76,0,19,1],
  [76,38,47,1],
  [38,0,9,1],
  [38,19,23,1],
// 250
  [84,84,84,1],
  [118,118,118,1],
  [160,160,160,1],
  [192,192,192,1],
  [224,224,224,1],
  [0,0,0,1]
]

const BYBLOCK = 0
const BYLAYER = 256

module.exports = {
  colorIndex,
  BYBLOCK,
  BYLAYER
}