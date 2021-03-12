const inputs = document.querySelectorAll('.filters label input');
const outputs = document.querySelectorAll('.filters label output');
const btnNext = document.querySelector('.btn-next');
const btnReset = document.querySelector('.btn-reset');
const fullscreen = document.querySelector('.fullscreen');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
const fileInput = document.querySelector('.btn-load--input');
const imageContainer = document.querySelector('.editor-img');
const download = document.querySelector('.btn-save');
const imageContainerImg = document.querySelector('.editor-img img');
let today = new Date();
let hour = today.getHours();
let base = '';
let i = 0;
const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
canvas.style.display = 'none';

function hundleUpdate(e) {
   const suffix = this.dataset.sizing;
   document.documentElement.style.setProperty(`--${this.name}`, `${this.value}${suffix}`);
   drawImage()

   outputs.forEach(output => {
      if (output.parentNode.childNodes[1].name === this.name) output.value = this.value;
   })
}
inputs.forEach(input => input.addEventListener('input', hundleUpdate));

function resetShanges(e) {
   document.documentElement.style.setProperty(`--blur`, `0px`);
   document.documentElement.style.setProperty(`--invert`, `0%`);
   document.documentElement.style.setProperty(`--sepia`, `0%`);
   document.documentElement.style.setProperty(`--saturate`, `100%`);
   document.documentElement.style.setProperty(`--hue`, `0deg`);
   inputs.forEach(input => {
      if (input.parentNode.childNodes[1].name !== 'saturate') input.value = 0;
      else input.value = 100;
   })
   outputs.forEach(output => {
      if (output.parentNode.childNodes[1].name !== 'saturate') output.value = 0;
      else output.value = 100;
   })
   drawImage()
}
btnReset.addEventListener('click', resetShanges);

hour >= 0 && hour < 6 ? base = 'night/' : hour >= 6 && hour < 12 ? base = 'morning/' : hour >= 12 && hour < 18 ? base = 'day/' : base = 'evening/';

function redrawingImg(img) {
   imageContainer.innerHTML = "";
   imageContainer.append(img);
   imageContainer.append(canvas);
}

function viewBgImage(src) {
   const img = new Image();
   img.src = src;
   img.onload = () => {
      redrawingImg(img);
      imageContainerImg.src = src;
      drawImage();
   };
}

function getImage() {
   const githubSrc = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
   const index = i % images.length;
   const imageSrc = githubSrc + base + images[index];
   viewBgImage(imageSrc);
   i++;
   btnNext.disabled = true;
   btnNext.classList.add('btn-next-load');
   setTimeout(function () {
      btnNext.classList.remove('btn-next-load');
      btnNext.disabled = false;
   }, 1111);
}
btnNext.addEventListener('click', getImage);

fileInput.addEventListener('change', function (e) {
   const file = fileInput.files[0];
   const reader = new FileReader();
   reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      redrawingImg(img);
      imageContainerImg.src = reader.result;
      drawImage();
   }
   reader.readAsDataURL(file);
});

function drawImage() {
   const img = new Image();
   img.setAttribute('crossOrigin', 'anonymous');
   img.src = imageContainerImg.src;
   img.onload = function () {
      let blurOutput, invertOutput, sepiaOutput, saturateOutput, hueOutput;
      blurOutput = document.querySelector("body > main > div.filters > label:nth-child(1) > output").value;
      invertOutput = document.querySelector("body > main > div.filters > label:nth-child(2) > output").value;
      sepiaOutput = document.querySelector("body > main > div.filters > label:nth-child(3) > output").value;
      saturateOutput = document.querySelector("body > main > div.filters > label:nth-child(4) > output").value;
      hueOutput = document.querySelector("body > main > div.filters > label:nth-child(5) > output").value;
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `blur(${blurOutput}px) invert(${invertOutput}%) sepia(${sepiaOutput}%) saturate(${saturateOutput}%) hue-rotate(${hueOutput}deg)`;
      ctx.drawImage(img, 0, 0);
   };
}
drawImage();

const dataURL = canvas.toDataURL("image/jpeg");
download.addEventListener('click', function (e) {
   let link = document.createElement('a');
   link.download = 'download.png';
   link.href = canvas.toDataURL();
   link.click();
   link.delete;
});

function toggleScreen() {
   if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
   } else {
      if (document.fullscreenEnabled) {
         document.exitFullscreen();
      }
   }
}
fullscreen.addEventListener('click', toggleScreen);