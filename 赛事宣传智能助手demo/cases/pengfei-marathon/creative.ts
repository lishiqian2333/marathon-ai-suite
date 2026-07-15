import type { CreativeModule } from "../../lib/case-types";

export const pengfeiCreative = {
  brief:{
    values:["绿色低碳","公益感恩","全民健身","城市传播"],
    culture:["太原古县城","晋阳文化","古建筑","非遗元素"],
    brand:["鹏飞集团","氢能源","绿色发展"],
    charity:["为带给你阳光的人奔跑"],
  },
  genes:["太原古县城","晋阳文化","古建筑纹样","氢能源绿色科技","公益奔跑"],
  directions:[
    {id:"heritage",code:"A",name:"古城文化系列",keywords:["古建","城墙","东方纹样","历史感"],summary:"以太原古县城和晋阳文脉建立赛事独有的城市文化辨识度。"},
    {id:"future",code:"B",name:"氢能未来系列",keywords:["科技","绿色能源","未来感"],summary:"把鹏飞氢能产业语言转译为轻盈、低碳、向前的视觉系统。"},
    {id:"charity",code:"C",name:"公益温暖系列",keywords:["爱心","阳光","奔跑","公益"],summary:"用阳光、陪伴和奔跑轨迹放大赛事的公益情感价值。"},
  ],
  products:[
    {product:"medal",design_name:"古城文化完赛奖牌",label:"FINISHER MEDAL",keywords:["古城","氢能","公益","奔跑"],description:"融合太原古县城城墙轮廓、晋阳文化纹样以及马拉松奔跑元素，中心以绿色能量环连接企业氢能基因。",image:"/creative-assets/award/hydrogen_future.png"},
    {product:"shirt",design_name:"氢路同行赛事T恤",label:"EVENT T-SHIRT",keywords:["氢分子","古城赛道","绿色科技","同行"],description:"正面以氢分子和速度轨迹建立科技感，背面将太原古县城融入连绵赛道。",image:"/creative-assets/tshirt/tshirt01.png"},
    {product:"mascot",design_name:"氢小跑吉祥物IP",label:"MASCOT IP",keywords:["氢能精灵","公益温暖","奔跑活力"],description:"以氢能源与未来科技为灵感塑造亲和的机器人跑者，承载绿色低碳、公益陪伴与马拉松精神。",image:"/creative-assets/mascot/qing_runner.png"},
    {product:"poster",design_name:"氢筑新程赛事海报",label:"EVENT POSTER",keywords:["赛事全景","古城文化","品牌统一"],description:"以绿色能量轨迹串联古城、跑者、奖牌与企业品牌，将城市文化、氢能未来和公益行动浓缩为主视觉。",image:"/creative-assets/poster/campaign_overview.png"},
  ],
} satisfies CreativeModule;
