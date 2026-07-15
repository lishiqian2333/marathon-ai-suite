import type { VideoModule } from "../../lib/case-types";

export const pengfeiVideo = {
  title:"每一步，都算数", duration:15, landscapeRatio:"16:9", portraitRatio:"9:16",
  story:["出发","坚持","抵达"], insight:"这组照片人物情绪充足，建议以群像开场、人物特写推进，最后用冲线与欢呼完成情绪高潮。",
  assets:[
    {src:"/demo-media/01-start.jpg",name:"赛事起跑.jpg",label:"起跑 / 群像",note:"适合作为开场，快速建立赛事氛围",orientation:"横图"},
    {src:"/demo-media/02-city.jpg",name:"城市赛道.jpg",label:"城市 / 赛道",note:"高机位画面，承接城市叙事",orientation:"竖图"},
    {src:"/demo-media/03-pack.jpg",name:"跑者方阵.jpg",label:"奔跑 / 节奏",note:"人群动势强，适合节拍加速",orientation:"竖图"},
    {src:"/demo-media/04-pacer.jpg",name:"配速跑者.jpg",label:"奔跑 / 氛围",note:"色彩鲜明，强化现场参与感",orientation:"竖图"},
    {src:"/demo-media/05-runner.jpg",name:"领先跑者.jpg",label:"人物 / 速度",note:"主体清晰，适合动态推近",orientation:"横图"},
    {src:"/demo-media/06-smile.jpg",name:"跑者笑脸.jpg",label:"人物 / 情绪",note:"情绪感染力高，作为情感转折",orientation:"竖图"},
    {src:"/demo-media/07-finish.jpg",name:"冲线时刻.jpg",label:"冲线 / 高潮",note:"动作明确，适合作为高潮镜头",orientation:"横图"},
    {src:"/demo-media/08-celebrate.jpg",name:"完赛庆祝.jpg",label:"完赛 / 欢呼",note:"正向情绪，承接品牌收束",orientation:"竖图"},
  ],
  finalVideo:"/demo-media/final.mp4", poster:"/demo-media/01-start.jpg",
} satisfies VideoModule;
