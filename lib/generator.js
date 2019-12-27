/*
 * generator-cover
 * Copyright(c) 2019-present Darkce (2639415619@qq.com)
 * MIT Licensed
 */

import { blobToDataURL, loadedImg, coverImg, drawTextWrap } from './utils/utils';

export default async ({
  el = '#cover',
  width = 470,
  viewWidth = 470,
  bgImage,
  bgColor,
  quality = 1,
  texts,
}) => {
  const height = width * (750 / 470);
  const scale = width / viewWidth;
  const canvas = document.querySelector(el);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // TODO: 渐变背景
  // const grd=cxt.createLinearGradient(0, 0, width, height);
  // grd.addColorStop(0, "#FF0000");

  // 纯色背景
  if (bgColor) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
  }

  ctx.fillRect(0, 0, width, height);

  // 图片背景
  if (bgImage) {
    const image = new Image();

    if (/^(http|data:image)/.test(bgImage)) image.src = bgImage;
    else if (bgImage instanceof File) image.src = await blobToDataURL(bgImage);
    else throw new Error('输入图片格式不正确');

    // ? 等图片加载成功后才可以进行绘制。
    await loadedImg(image);
    const { sx, sy, sWidth, sHeight } = coverImg(width, height, image.width, image.height);
    ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, width, height);
  }

  texts.forEach(
    ({ content, x, y, width, style: { color, fontSize, fontFamily, fontWeight, lineHeight } }) => {
      x = x * scale;
      y = y * scale;
      width = width * scale;
      fontSize = parseFloat(fontSize) * scale + 'px';
      ctx.fillStyle = color;
      ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
      drawTextWrap(ctx, content, x, y, width, lineHeight);
    },
  );

  ctx.save();

  return canvas.toDataURL('image/png', quality); // 图片base64
};
