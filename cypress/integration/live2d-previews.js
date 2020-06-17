const fs = require('fs'),
      path = require('path'),
      imageDataURI = require('image-data-uri'),
      characters = require('../../tmp/missing-previws.json')

function dataURItoBlob(dataURI) {
  var byteStr;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteStr = atob(dataURI.split(',')[1]);
  else
      byteStr = unescape(dataURI.split(',')[1]);

  var mimeStr = dataURI.split(',')[0].split(':')[1].split(';')[0];

  var arr= new Uint8Array(byteStr.length);
  for (var i = 0; i < byteStr.length; i++) {
      arr[i] = byteStr.charCodeAt(i);
  }

  return new Blob([arr], {type:mimeStr});
}

Object.keys(characters).sort().forEach(model => {
  Object.keys(characters[model].variants).sort().forEach(variantId => {
    describe(model + '_' + variantId, () => {
      characters[model].variants[variantId].mods.forEach(modHash => {
        it(modHash, () => {
          cy.visit(`/live2d-viewer.html?model=${model}_${variantId}&modHash=${modHash}`)
          const saveImage = () => {
            cy.window().then(w => w.document.getElementById('canvas').toDataURL())
            .then(d => {
              if(d.length > 385074 + 1000) {
                console.log(`retrying ${model}_${variantId} ...`)
                cy.task('writeFile', {
                  filename: `public/characters/${model}_${variantId}/${modHash}/preview.png`,
                  data: d.replace(/^data:image\/png;base64,/, ""),
                  encoding: 'base64'
                }, {timeout: 20000})
                // cy.writeFile(`public/characters/${model}_${variantId}/${modHash}/preview.png`, d.replace(/^data:image\/png;base64,/, ""), 'base64')
              }
              else cy.wait(1000).then(saveImage)
            })
          }
          // cy.wait(3000)
          saveImage()
        })
      })
    })
  })
})