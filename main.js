
const prizeNum = consts.prizeList.length
const perAngle = 360 / prizeNum
const offsetAngle = perAngle / 2
const circleCount = 3 //旋转圈数
const rotateDuration = 0.3  // 持续时间
const panel = document.querySelector('.luckpanel')

let isRotating = false

// 画出盘面
function drawPanel() {
  const canvas = document.querySelector('#canvas')
  const ctx = canvas.getContext('2d')
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  const dpr = window.devicePixelRatio
  // 处理设备分辨率
  canvas.width = w * dpr
  canvas.height = h * dpr
  ctx.scale(dpr, dpr)

  // 将画布逆时针旋转90°
  ctx.translate(0, h)
  ctx.rotate(-90 * Math.PI / 180)

  ctx.strokeStyle = consts.borderColor

  const perRadian = (Math.PI * 2) / prizeNum
  for (let i = 0; i < prizeNum; i++) {
    const radian = perRadian * i
    ctx.beginPath()
    //console.log(i)
    if (i % 2 === 0) {
      ctx.fillStyle = consts.prizeBgColors[0]
    } else {
      ctx.fillStyle = consts.prizeBgColors[1]
    }
    //console.log(ctx.fillStyle)
    ctx.moveTo(w / 2, h / 2)
    ctx.arc(w / 2, h / 2, w / 2, radian, radian + perRadian, false) // 顺时针
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  }
}
// 画出每一块，其具体内容
function getPrizeItem({ name, src }) {
  const el = document.createElement('div')
  const tpl = `
      <div class="prize-item">
        <div class="prize-item__name">${name}</div>
        <div class="prize-item__img">
          <img src="${src}" alt="">
        </div>
      </div>
    `
  el.innerHTML = tpl

  return el.firstElementChild
}
// 填充进去
function fillPrize() {
  const container = document.querySelector('.prize');
  consts.prizeList.forEach((item, i) => {
    const el = getPrizeItem({
      name: item.prizeName,
      src: item.prizeImg
    })

    // 旋转
    const currentAngle = perAngle * i + offsetAngle
    el.style.transform = `rotate(${currentAngle}deg)`

    container.appendChild(el)
  })
}

let startRotateAngle = 0

function rotate(index) {
  const rotateAngle = (
    startRotateAngle +
    circleCount * 360 +
    360 - (perAngle * index + offsetAngle) -
    startRotateAngle % 360
  );

  startRotateAngle = rotateAngle
  panel.style.transform = `rotate(${rotateAngle}deg)`
  panel.style.transitionDuration = `${rotateDuration}s`

  setTimeout(() => {
    rotateEnd(index)
  }, rotateDuration * 1000);
}


function rotateEnd(index) {
  isRotating = false
  $.alert({
    theme: 'modern',
    animation: 'top',
    closeAnimation: 'bottom',
    title: '抽奖结果',
    content: "<h2 style='color: #FF6633'>恭喜！！！获得"+ consts.prizeList[index].display+"</h2>",
    animationSpeed: 200
  })

}

function bindEvent() {
  document.querySelector('.pointer').addEventListener('click', function () {
    if (isRotating) {
      return
    } else {
      isRotating = true
    }

    // const index = Math.floor(Math.random() * prizeNum)
    const index = computedPrize()

    if (index == -1) {
      alert("所有奖品已经抽完！！！");
      return;
    }
    rotate(index)
  })
}



//定义一个奖池
var prizeArr = []
//将所有的奖品放入奖池
consts.prizeList.forEach(item => {
  let percent = item.percent
  while (percent > 0) {
    prizeArr.push(item)
    percent--
  }
})


function computedPrize() {
  // 检查是否还有物品可抽取
  if (prizeArr.length === 0) {
    console.log('所有物品已经抽完！');
    return -1;
  }

  // 生成一个随机索引
  const randomIndex = Math.floor(Math.random() * prizeArr.length);

  // 从数组中选择一个物品
  const selectedItem = prizeArr[randomIndex];

  // 从数组中删除选中的物品
  prizeArr.splice(randomIndex, 1);

  return selectedItem.id;
}
function init() {
  drawPanel()
  fillPrize()
  bindEvent()
}
document.addEventListener('DOMContentLoaded', init)

