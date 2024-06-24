const avatar = [
  'https://w.wallhaven.cc/full/o5/wallhaven-o5363p.jpg',
  'https://w.wallhaven.cc/full/kx/wallhaven-kxwgvd.png',
  'https://w.wallhaven.cc/full/p9/wallhaven-p98xkp.jpg',
  'https://w.wallhaven.cc/full/5g/wallhaven-5gwq17.png',
  'https://w.wallhaven.cc/full/yx/wallhaven-yxmrkd.jpg',
  'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/88/h/88',
  'https://w.wallhaven.cc/full/l8/wallhaven-l8mx1l.jpg',
  'https://w.wallhaven.cc/full/yx/wallhaven-yxmo5k.png',
  'https://w.wallhaven.cc/full/6d/wallhaven-6dogj7.png',
  'https://w.wallhaven.cc/full/d6/wallhaven-d6g33m.jpg',
  'https://w.wallhaven.cc/full/x6/wallhaven-x68kjl.jpg',
  'https://w.wallhaven.cc/full/yx/wallhaven-yxm3zx.png',
  'https://w.wallhaven.cc/full/gp/wallhaven-gpjj9q.jpg',
  'https://w.wallhaven.cc/full/we/wallhaven-weyz9r.png',
  'https://w.wallhaven.cc/full/l8/wallhaven-l839zy.jpg',
  'https://img1.baidu.com/it/u=2029513305,2137933177&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=472',
];

const getAvatar = () => avatar[Math.round(Math.random() * (avatar.length - 1))];

export default getAvatar;
