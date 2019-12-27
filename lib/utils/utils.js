export function blobToDataURL(file) {
  const a = new FileReader();
  a.readAsDataURL(file);
  return new Promise(resolve => {
    a.onload = e => {
      resolve(e.target.result);
    };
  });
}

export function loadedImg(img) {
  return new Promise(resolve => {
    // eslint-disable-next-line no-param-reassign
    img.onload = e => {
      resolve(e);
    };
  });
}

/**
 * @param {Number} boxW 固定盒子的宽, boxH 固定盒子的高
 * @param {Number} sourceW 原图片的宽, sourceH 原图片的高
 * @return {Object} {截取的图片信息}
 */
export function coverImg(boxW, boxH, sourceW, sourceH) {
  let sx = 0;
  let sy = 0;
  let sWidth = sourceW;
  let sHeight = sourceH;
  if (sourceW > sourceH || (sourceW === sourceH && boxW < boxH)) {
    sWidth = (boxW * sHeight) / boxH;
    sx = (sourceW - sWidth) / 2;
  } else if (sourceW < sourceH || (sourceW === sourceH && boxW > boxH)) {
    sHeight = (boxH * sWidth) / boxW;
    sy = (sourceH - sHeight) / 2;
  }
  return {
    sx,
    sy,
    sWidth,
    sHeight,
  };
}

export function drawTextWrap(ctx, text, x, y, width, lineHeight = 1.2) {
  const fontWidth = ctx.measureText('国').width;
  let textArr = text.split('');
  let temp = '';
  let row = [];

  textArr.forEach(item => {
    if (ctx.measureText(temp).width < width && ctx.measureText(temp + item).width <= width)
      temp += item;
    else {
      row.push(temp);
      temp = item;
    }
  });

  row.push(temp);

  row.forEach((e, i) => {
    ctx.fillText(e, x, y + (row.length === 1 ? fontWidth : (i + 1) * fontWidth * lineHeight));
  });

  // 只显示2行，加...
  /*for(var b = 0; b < 2; b++){
      var str = row[b];
      if(b == 1){
          str = str.substring(0,str.length-1) + '...';
      }
      ctx.fillText(str,x,y+(b+1)*24);
  }*/
}
