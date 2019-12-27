/* eslint-disable no-alert */
/* eslint-disable no-undef */
/*
 * @Author: Darkce (2639415619@qq.com)
 * @Date: 2019-12-17 19:35:09
 */

import generator from '../lib/generator';
import '../lib/paigusu.min';
import './styles/custom.css';
import './styles/global.css';
import './styles/cropper.css';

const texts = [];

const params = {
  el: '#canvas',
  width: 470,
  viewWidth: 320,
  bgImage: null,
  quality: 0.9,
  bgColor: '#18dbd4',
  texts,
};

let id = 0;
let isMousedown = false;
let previewText = null;

// 默认样式
const defaultTextStyle = {
  color: '#FFFFFF',
  fontFamily: 'Arial',
  fontSize: 50,
  fontWeight: 400,
  lineHeight: 1.2,
};

// 输出
function handleOutput() {
  document.querySelectorAll('.preview__text').forEach((e, i) => {
    const { color, fontSize, fontWeight, fontFamily, lineHeight, width } = window.getComputedStyle(e);
    const [x, y] = e.style.transform.replace(/translate3d\(|\)|px|\s/g, '').split(',');
    texts[i] = {
      ...texts[i],
      x,
      y,
      width: parseFloat(width),
      content: e.textContent.trim(),
      style: {
        color,
        fontSize,
        fontWeight,
        fontFamily,
        lineHeight: parseFloat(lineHeight) / parseFloat(fontSize),
      },
    };
  });

  return generator(params);
}
// 下载图片
$('.download').click(async () => {
  const downloadElement = document.createElement('a');
  downloadElement.href = await handleOutput();
  downloadElement.download = `${params.texts[0].content}-${Date.now()}.png`; // 下载后文件名
  downloadElement.click();
});

// 选择背景图片
function handleSelectImg(e) {
  const pattern = /(\.*.jpg$)|(\.*.png$)|(\.*.jpeg$)|(\.*.gif$)|(\.*.bmp$)/;
  const file = e.currentTarget.files[0] || {};
  if (!file.name) return;
  else if (!pattern.test(file.name)) {
    alert('仅支持jpg/jpeg/png/gif/bmp格式的照片！');
  } else if (file.size > 4194304) {
    alert('图片需小于4M');
  } else {
    Model_Cropper({
      imgUrl: URL.createObjectURL(file),
      proportion: [320, 510],
      confirm: ({ data: { base64 }, close }) => {
        params.bgImage = base64;
        $('.view__preview').css({ backgroundImage: `url(${base64})` });
        close();
      },
    });
  }
  $('.upload').val('');
}

// 添加文本
function handleAddText() {
  $('.view__preview').append(`
<div class="preview__text" style="transform: translate3d(62px, 100px, 0)" title="点击选中" data-id=${id++}>
  <div class="text__content" contenteditable>文本</div>
  <div class="text__right" title="调整宽度" ></div>
</div>`);

  texts.push({ style: {}, content: '文本' });

  $('.text__right').mouseenter(e => {
    e.target.style.backgroundColor = '#f00';
  });

  $('.text__right').mousedown(e => {
    e.currentTarget.style.backgroundColor = '#f00';
    isMousedown = true;
    previewText = e.target.offsetParent;
  });

  document.querySelectorAll('.text__content').forEach(item => {
    item.onclick = e => {
      document.querySelectorAll('.text__content').forEach(_item => {
        _item.offsetParent.classList.remove('preview__text-hover');
      });
      e.target.offsetParent.classList.add('preview__text-hover');
      previewText = e.target.offsetParent;

      // 同步字体样式信息
      const { fontSize, color, fontFamily } = window.getComputedStyle(previewText);
      $('#formGroupFontSizeInput').val(parseFloat(fontSize));
      $('.font-colorPicker').css({ backgroundColor: color });
      console.log(fontFamily);
      $('.select-font-family').val(fontFamily);
    };
  });

  // 文本宽度
  $('.view__preview').mousemove(e => {
    if (isMousedown) {
      const width = e.pageX - previewText.getBoundingClientRect().left;
      previewText.style.width = `${width}px`;
      const id = Number(previewText.dataset.id);
      texts[id].width = width;
    }
  });

  $('.view__preview, .text__right').mouseup(e => {
    isMousedown = false;
  });

  $('.text__right').mouseleave(e => {
    e.currentTarget.style.backgroundColor = '#fff';
  });

  // 拖到文本
  $('.text__content').mousedown(e => {
    const { clientX, clientY } = e;
    const shiftX = clientX - e.currentTarget.getBoundingClientRect().left;
    const shiftY = clientY - e.currentTarget.getBoundingClientRect().top;
    const { top: boxTop, left: boxLeft } = document.querySelector('.view__preview').getBoundingClientRect();

    // 球中心在 (pageX, pageY) 坐标上
    function moveAt(_pageX, _pageY) {
      e.target.offsetParent.style.transform = `translate3d(${_pageX - shiftX - boxLeft}px, ${_pageY - shiftY - boxTop}px, 0)`;
    }
    moveAt(e.pageX, e.pageY);

    function onMouseMove({ pageX: x, pageY: y }) {
      moveAt(x, y);
    }

    function removeMouseEvent() {
      $('.view__preview').off('mousemove', onMouseMove);
      $('.view__preview').mouseup = null;
    }

    // (3) 用 mousemove 移动球
    $('.view__preview').on('mousemove', onMouseMove);

    $('.view__preview').mouseup(removeMouseEvent);
  });

  $('.preview__text').on('dragstart', () => false);
}

// 初始化
function init() {
  $('.view__preview').css({
    backgroundColor: params.bgColor,
  });
  handleAddText();
  $('.preview__text').css({
    width: 50,
    transform: `translate3d(40px, 60px, 0)`,
    ...defaultTextStyle,
  });
  $('.text__content').text('醒世姻缘传');
  $('.bg-colorPicker').css({ 'background-color': params.bgColor });
  previewText = document.querySelector('.preview__text');
}

init();

$('.upload').change(handleSelectImg);

$('.btn-add-text').click(handleAddText);

// 选择背景颜色
$('.bg-colorPicker').paigusu(
  {
    color: '#1926dc',
  },
  (event, obj) => {
    params.bgColor = `rgba(${obj.rgba})`;
    $(event).css('background-color', `rgba(${obj.rgba})`);
    $('.view__preview').css({ backgroundColor: params.bgColor });
  },
);

// 选择字体颜色
$('.font-colorPicker').paigusu(
  {
    color: '#1926dc',
  },
  (event, obj) => {
    $(event).css('background-color', `rgba(${obj.rgba})`);
    previewText.style.color = `rgba(${obj.rgba})`;
  },
);

$('.colorPicker').click(() => false);

// 输出宽度与输出质量
$('.custom-range').mousemove(e => {
  const value = e.currentTarget.value;

  if (e.currentTarget.dataset.type === 'width') params.width = value;
  else params.quality = value;

  e.target.nextElementSibling.textContent = value;
});

// 字体大小
formGroupFontSizeInput.oninput = e => {
  const value = e.currentTarget.value;
  if (value && !Number(value)) alert('请输入数字');
  else previewText.style.fontSize = (value || 16) + 'px';
};

// 选择字体
$('.select-font-family').change(e => (previewText.style.fontFamily = e.currentTarget.value));

function handleSelectFont(e) {
  const pattern = /(\.*.ttf$)/;
  const file = e.currentTarget.files[0] || {};
  if (!file.name) return;
  else if (!pattern.test(file.name)) alert('仅支持ttf格式的字体文件！');
  else if (file.size > 4194304 * 10) alert('字体文件需小于40M');
  else {
    const newStyle = document.createElement('style');
    const fontFamily = file.name.split('.')[0];

    newStyle.appendChild(
      document.createTextNode(`
      @font-face {
          font-family: "${fontFamily}";
          src: url("${URL.createObjectURL(file)}") format("truetype");
      }`),
    );
    document.head.appendChild(newStyle);
    $('#localFont').append(`
    <option value="${fontFamily}">${fontFamily}</option>
    `);

    previewText.style.fontFamily = fontFamily;
    $('.select-font-family').val(fontFamily);
    $('.upload-font').val('');
  }
}

$('.upload-font').change(handleSelectFont);
