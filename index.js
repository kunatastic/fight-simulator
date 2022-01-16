function init() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  startSim();
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const loadImage = (src) =>
  new Promise((result) => {
    const img = new Image();
    img.onload = () => result(img);
    img.src = src;
  });

const numberOfFrames = {
  backward: 6,
  block: 9,
  forward: 6,
  idle: 8,
  kick: 7,
  punch: 7,
};

const animate = (images, bg) => {
  return new Promise((result) => {
    const height = canvas.clientHeight;
    const width = canvas.clientWidth;
    const size = Math.min(height, width);

    images.forEach((image, index) => {
      setTimeout(() => {
        ctx.drawImage(bg, 0, 0, width, height);
        ctx.drawImage(image, 0, 0, size, size);
      }, index * 100);
    });

    setTimeout(() => {
      result();
    }, images.length * 100);
  });
};

const loadScene = async (scene) => {
  const imagePromises = [];
  for (let index = 1; index <= numberOfFrames[scene]; index++)
    imagePromises.push(loadImage(`images/${scene}/${index}.png`));
  return Promise.all(imagePromises);
};

const startScene = async (scene) => {
  const images = await loadScene(scene);
  const background = await loadImage(`images/background.jpg`);
  await animate(images, background);
};

const startSim = () => {
  const sceneQueue = [];

  const startNextScene = async () => {
    if (!sceneQueue.length) sceneQueue.push("idle");
    const scene = sceneQueue.pop();
    await startScene(scene);
    startNextScene();
  };

  document.onkeydown = (event) => {
    console.log(event.key);
    switch (event.key) {
      case "ArrowUp":
        sceneQueue.push("forward");
        break;
      case "ArrowDown":
        sceneQueue.push("backward");
        break;
      case "Shift":
        sceneQueue.push("block");
        break;
      case "k":
        sceneQueue.push("kick");
        break;
      case "p":
        sceneQueue.push("punch");
        break;
      default:
        break;
    }
  };

  startNextScene();
};
