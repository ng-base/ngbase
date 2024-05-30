import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-color-picker-1',
  template: `
    <div class="color-picker-panel">
      <div class="panel-row">
        <div class="swatches default-swatches"></div>
        <button class="button eyedropper">Get Color</button>
      </div>
      <div class="panel-row">
        <div class="spectrum-map">
          <button id="spectrum-cursor" class="color-cursor"></button>
          <canvas id="spectrum-canvas"></canvas>
        </div>
        <div class="hue-map">
          <button id="hue-cursor" class="color-cursor"></button>
          <canvas id="hue-canvas"></canvas>
        </div>
      </div>
      <div class="panel-row">
        <div id="rgb-fields" class="field-group value-fields rgb-fields active">
          <div class="field-group">
            <label for="" class="field-label">R:</label>
            <input
              type="number"
              max="255"
              min="0"
              id="red"
              class="field-input rgb-input"
            />
          </div>
          <div class="field-group">
            <label for="" class="field-label">G:</label>
            <input
              type="number"
              max="255"
              min="0"
              id="green"
              class="field-input rgb-input"
            />
          </div>
          <div class="field-group">
            <label for="" class="field-label">B:</label>
            <input
              type="number"
              max="255"
              min="0"
              id="blue"
              class="field-input rgb-input"
            />
          </div>
        </div>
        <div id="hex-field" class="field-group value-fields hex-field">
          <label for="" class="field-label">Hex:</label>
          <input type="text" id="hex" class="field-input" />
        </div>
        <button id="mode-toggle" class="button mode-toggle">Mode</button>
      </div>
      <div class="panel-row">
        <h2 class="panel-header">User Colors</h2>
        <div id="user-swatches" class="swatches custom-swatches"></div>
        <button id="add-swatch" class="button add-swatch">
          <span id="color-indicator" class="color-indicator"></span
          ><span>Add to Swatches</span>
        </button>
      </div>
    </div>
  `,
  styles: `
    $color-ui-panel: #1f232a;
    $color-ui-panel-dark: #15191c;
    $color-ui-panel-light: #2a3137;
    $color-ui-border: #364347;
    $color-input-bg: #15191c;
    $color-swatch-border: #fff;
    $color-text: #8b949a;
    $spacer: 10px;
    $map-height: 200px;
    $input-height: 40px;
    $swatch-width: 32px;
    $swatch-space: 4px;
    $swatches-width: (6 * $swatch-width) + (5 * $swatch-space);
    $map-width: $swatches-width;
    $eyedropper-width: $swatch-width * 2 + $swatch-space;
    $window-width: $swatches-width + $eyedropper-width + $spacer * 3;
    $spectrum-cursor-width: 30px;

    body {
      background: $color-ui-panel;
      font-family: 'Proxima Nova', sans-serif;
      color: $color-text;
      letter-spacing: 0.05em;
      transition: background 0.5s ease;
    }

    .color-picker-panel {
      background: $color-ui-panel;
      width: $window-width;
      border-radius: 8px;
      border: 2px solid $color-ui-border;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .panel-row {
      position: relative;
      margin: 0 10px 10px;
      &:first-child {
        margin-top: 10px;
        margin-bottom: $spacer - $swatch-space;
      }
      &:after {
        content: '';
        display: table;
        clear: both;
      }
    }

    .panel-header {
      background: $color-ui-panel-dark;
      padding: 8px;
      margin: 0 -10px $spacer;
      text-align: center;
    }

    .swatch {
      display: inline-block;
      width: $swatch-width;
      height: $swatch-width;
      background: #ccc;
      border-radius: 4px;
      margin-left: 4px;
      margin-bottom: 4px;
      box-sizing: border-box;
      border: 2px solid $color-ui-border;
      cursor: pointer;
    }

    .default-swatches {
      width: $swatches-width;
      .swatch:nth-child(6n + 1) {
        margin-left: 0;
      }
    }

    .color-cursor {
      border-radius: 100%;
      background: #ccc;
      box-sizing: border-box;
      position: absolute;
      pointer-events: none;
      z-index: 2;
      border: 2px solid $color-swatch-border;
      transition: all 0.2s ease;

      &.dragging {
        transition: none;
      }

      &#spectrum-cursor {
        width: $spectrum-cursor-width;
        height: $spectrum-cursor-width;
        margin-left: -$spectrum-cursor-width/2;
        margin-top: -$spectrum-cursor-width/2;
        top: 0;
        left: 0;
      }

      &#hue-cursor {
        top: 0;
        left: 50%;
        height: 20px;
        width: 20px;
        margin-top: -10px;
        margin-left: -10px;
        pointer-events: none;
      }
    }

    .spectrum-map {
      position: relative;
      width: $map-width;
      height: $map-height;
      overflow: hidden;
    }

    #spectrum-canvas {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #ccc;
    }

    .hue-map {
      position: absolute;
      top: $spacer/2;
      bottom: $spacer/2;
      right: $eyedropper-width/2 - $spacer/2;
      width: $spacer;
    }

    #hue-canvas {
      border-radius: 8px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #ccc;
    }

    .button {
      background: $color-ui-panel-light;
      border: 0;
      border-radius: 4px;
      color: $color-text;
      font-size: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      outline: none;
      cursor: pointer;
      padding: 4px;
      &:active {
        background: darken($color-ui-panel-light, 2%);
      }

      &.eyedropper {
        position: absolute;
        right: 0;
        top: 0;
        width: $eyedropper-width;
        height: $eyedropper-width;
        display: block;
      }

      &.add-swatch {
        display: block;
        padding: 6px;
        width: 200px;
        margin: 10px auto 0;
      }

      &.mode-toggle {
        position: absolute;
        top: 0;
        right: 0;
        width: $eyedropper-width;
        height: $input-height;
      }
    }

    .value-fields {
      display: none;
      align-items: center;
      &.active {
        display: flex;
      }

      .field-label {
        margin-right: 6px;
      }

      .field-input {
        background: $color-input-bg;
        border: 1px solid $color-ui-border;
        box-sizing: border-box;
        border-radius: 2px;
        line-height: $input-height - 2px;
        padding: 0 4px;
        text-align: center;
        color: $color-text;
        font-size: 1rem;
        display: block;
      }
    }

    .rgb-fields {
      .field-group {
        display: flex;
        align-items: center;
      }
      .field-input {
        width: 42px;
        margin-right: $spacer;
      }
    }

    .hex-field {
      .field-input {
        width: 170px;
      }
    }

    .color-indicator {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      background: #ccc;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      /* display: none; <- Crashes Chrome on hover */
      -webkit-appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }
  `,
})
export class ColorPicker1 implements OnInit {
  constructor() {
    //https://github.com/bgrins/TinyColor
    // var addSwatch = document.getElementById('add-swatch');
    // var modeToggle = document.getElementById('mode-toggle');
    // var swatches = document.getElementsByClassName('default-swatches')[0];
    // var colorIndicator = document.getElementById('color-indicator');
    // var userSwatches = document.getElementById('user-swatches');
    // var spectrumCanvas = document.getElementById(
    //   'spectrum-canvas',
    // ) as HTMLCanvasElement;
    // var spectrumCtx = spectrumCanvas.getContext('2d')!;
    // var spectrumCursor = document.getElementById('spectrum-cursor');
    // var spectrumRect = spectrumCanvas.getBoundingClientRect();
    // var hueCanvas = document.getElementById('hue-canvas') as HTMLCanvasElement;
    // var hueCtx = hueCanvas.getContext('2d')!;
    // var hueCursor = document.getElementById('hue-cursor');
    // var hueRect = hueCanvas.getBoundingClientRect();
    // var currentColor = '';
    // var hue = 0;
    // var saturation = 1;
    // var lightness = 0.5;
    // var rgbFields = document.getElementById('rgb-fields');
    // var hexField = document.getElementById('hex-field');
    // var red = document.getElementById('red') as HTMLInputElement;
    // var blue = document.getElementById('blue') as HTMLInputElement;
    // var green = document.getElementById('green') as HTMLInputElement;
    // var hex = document.getElementById('hex') as HTMLInputElement;
    // class ColorPicker {
    //   defaultSwatches = [
    //     '#FFFFFF',
    //     '#FFFB0D',
    //     '#0532FF',
    //     '#FF9300',
    //     '#00F91A',
    //     '#FF2700',
    //     '#000000',
    //     '#686868',
    //     '#EE5464',
    //     '#D27AEE',
    //     '#5BA8C4',
    //     '#E64AA9',
    //   ];
    //   constructor() {
    //     this.addDefaultSwatches();
    //     this.createShadeSpectrum();
    //     this.createHueSpectrum();
    //   }
    //   addDefaultSwatches() {
    //     for (var i = 0; i < this.defaultSwatches.length; ++i) {
    //       createSwatch(swatches, this.defaultSwatches[i]);
    //     }
    //   }
    // }
    // function createSwatch(target: any, color: any) {
    //   var swatch = document.createElement('button');
    //   swatch.classList.add('swatch');
    //   swatch.setAttribute('title', color);
    //   swatch.style.backgroundColor = color;
    //   swatch.addEventListener('click', function () {
    //     var color = tinycolor(this.style.backgroundColor);
    //     colorToPos(color);
    //     setColorValues(color);
    //   });
    //   target.appendChild(swatch);
    //   refreshElementRects();
    // }
    // function refreshElementRects() {
    //   spectrumRect = spectrumCanvas.getBoundingClientRect();
    //   hueRect = hueCanvas.getBoundingClientRect();
    // }
    // function createShadeSpectrum(color: any) {
    //   let canvas = spectrumCanvas;
    //   let ctx = spectrumCtx;
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   if (!color) color = '#f00';
    //   ctx.fillStyle = color;
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);
    //   var whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    //   whiteGradient.addColorStop(0, '#fff');
    //   whiteGradient.addColorStop(1, 'transparent');
    //   ctx.fillStyle = whiteGradient;
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);
    //   var blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    //   blackGradient.addColorStop(0, 'transparent');
    //   blackGradient.addColorStop(1, '#000');
    //   ctx.fillStyle = blackGradient;
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);
    //   canvas.addEventListener('mousedown', function (e) {
    //     startGetSpectrumColor(e);
    //   });
    // }
    // function createHueSpectrum() {
    //   var canvas = hueCanvas;
    //   var ctx = hueCtx;
    //   var hueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    //   hueGradient.addColorStop(0.0, 'hsl(0,100%,50%)');
    //   hueGradient.addColorStop(0.17, 'hsl(298.8, 100%, 50%)');
    //   hueGradient.addColorStop(0.33, 'hsl(241.2, 100%, 50%)');
    //   hueGradient.addColorStop(0.5, 'hsl(180, 100%, 50%)');
    //   hueGradient.addColorStop(0.67, 'hsl(118.8, 100%, 50%)');
    //   hueGradient.addColorStop(0.83, 'hsl(61.2,100%,50%)');
    //   hueGradient.addColorStop(1.0, 'hsl(360,100%,50%)');
    //   ctx.fillStyle = hueGradient;
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);
    //   canvas.addEventListener('mousedown', function (e) {
    //     startGetHueColor(e);
    //   });
    // }
    // function colorToHue(color) {
    //   var color = tinycolor(color);
    //   var hueString = tinycolor(
    //     'hsl ' + color.toHsl().h + ' 1 .5',
    //   ).toHslString();
    //   return hueString;
    // }
    // function colorToPos(color) {
    //   var color = tinycolor(color);
    //   var hsl = color.toHsl();
    //   hue = hsl.h;
    //   var hsv = color.toHsv();
    //   var x = spectrumRect.width * hsv.s;
    //   var y = spectrumRect.height * (1 - hsv.v);
    //   var hueY = hueRect.height - (hue / 360) * hueRect.height;
    //   updateSpectrumCursor(x, y);
    //   updateHueCursor(hueY);
    //   setCurrentColor(color);
    //   createShadeSpectrum(colorToHue(color));
    // }
    // function setColorValues(color) {
    //   //convert to tinycolor object
    //   var color = tinycolor(color);
    //   var rgbValues = color.toRgb();
    //   var hexValue = color.toHex();
    //   //set inputs
    //   red.value = rgbValues.r;
    //   green.value = rgbValues.g;
    //   blue.value = rgbValues.b;
    //   hex.value = hexValue;
    // }
    // function setCurrentColor(color) {
    //   color = tinycolor(color);
    //   currentColor = color;
    //   colorIndicator.style.backgroundColor = color;
    //   document.body.style.backgroundColor = color;
    //   spectrumCursor.style.backgroundColor = color;
    //   hueCursor.style.backgroundColor =
    //     'hsl(' + color.toHsl().h + ', 100%, 50%)';
    // }
    // function updateHueCursor(y) {
    //   hueCursor.style.top = y + 'px';
    // }
    // function updateSpectrumCursor(x, y) {
    //   //assign position
    //   spectrumCursor.style.left = x + 'px';
    //   spectrumCursor.style.top = y + 'px';
    // }
    // var startGetSpectrumColor = function (e) {
    //   getSpectrumColor(e);
    //   spectrumCursor.classList.add('dragging');
    //   window.addEventListener('mousemove', getSpectrumColor);
    //   window.addEventListener('mouseup', endGetSpectrumColor);
    // };
    // function getSpectrumColor(e) {
    //   // got some help here - http://stackoverflow.com/questions/23520909/get-hsl-value-given-x-y-and-hue
    //   e.preventDefault();
    //   //get x/y coordinates
    //   var x = e.pageX - spectrumRect.left;
    //   var y = e.pageY - spectrumRect.top;
    //   //constrain x max
    //   if (x > spectrumRect.width) {
    //     x = spectrumRect.width;
    //   }
    //   if (x < 0) {
    //     x = 0;
    //   }
    //   if (y > spectrumRect.height) {
    //     y = spectrumRect.height;
    //   }
    //   if (y < 0) {
    //     y = 0.1;
    //   }
    //   //convert between hsv and hsl
    //   var xRatio = (x / spectrumRect.width) * 100;
    //   var yRatio = (y / spectrumRect.height) * 100;
    //   var hsvValue = 1 - yRatio / 100;
    //   var hsvSaturation = xRatio / 100;
    //   lightness = (hsvValue / 2) * (2 - hsvSaturation);
    //   saturation =
    //     (hsvValue * hsvSaturation) / (1 - Math.abs(2 * lightness - 1));
    //   var color = tinycolor('hsl ' + hue + ' ' + saturation + ' ' + lightness);
    //   setCurrentColor(color);
    //   setColorValues(color);
    //   updateSpectrumCursor(x, y);
    // }
    // function endGetSpectrumColor(e) {
    //   spectrumCursor.classList.remove('dragging');
    //   window.removeEventListener('mousemove', getSpectrumColor);
    // }
    // function startGetHueColor(e) {
    //   getHueColor(e);
    //   hueCursor.classList.add('dragging');
    //   window.addEventListener('mousemove', getHueColor);
    //   window.addEventListener('mouseup', endGetHueColor);
    // }
    // function getHueColor(e) {
    //   e.preventDefault();
    //   var y = e.pageY - hueRect.top;
    //   if (y > hueRect.height) {
    //     y = hueRect.height;
    //   }
    //   if (y < 0) {
    //     y = 0;
    //   }
    //   var percent = y / hueRect.height;
    //   hue = 360 - 360 * percent;
    //   var hueColor = tinycolor('hsl ' + hue + ' 1 .5').toHslString();
    //   var color = tinycolor(
    //     'hsl ' + hue + ' ' + saturation + ' ' + lightness,
    //   ).toHslString();
    //   createShadeSpectrum(hueColor);
    //   updateHueCursor(y, hueColor);
    //   setCurrentColor(color);
    //   setColorValues(color);
    // }
    // function endGetHueColor(e) {
    //   hueCursor.classList.remove('dragging');
    //   window.removeEventListener('mousemove', getHueColor);
    // }
    // // Add event listeners
    // red.addEventListener('change', function () {
    //   var color = tinycolor(
    //     'rgb ' + red.value + ' ' + green.value + ' ' + blue.value,
    //   );
    //   colorToPos(color);
    // });
    // green.addEventListener('change', function () {
    //   var color = tinycolor(
    //     'rgb ' + red.value + ' ' + green.value + ' ' + blue.value,
    //   );
    //   colorToPos(color);
    // });
    // blue.addEventListener('change', function () {
    //   var color = tinycolor(
    //     'rgb ' + red.value + ' ' + green.value + ' ' + blue.value,
    //   );
    //   colorToPos(color);
    // });
    // addSwatch.addEventListener('click', function () {
    //   createSwatch(userSwatches, currentColor);
    // });
    // modeToggle.addEventListener('click', function () {
    //   if (
    //     rgbFields.classList.contains('active')
    //       ? rgbFields.classList.remove('active')
    //       : rgbFields.classList.add('active')
    //   );
    //   if (
    //     hexField.classList.contains('active')
    //       ? hexField.classList.remove('active')
    //       : hexField.classList.add('active')
    //   );
    // });
    // window.addEventListener('resize', function () {
    //   refreshElementRects();
    // });
    // new ColorPicker();
  }

  ngOnInit() {}
}
