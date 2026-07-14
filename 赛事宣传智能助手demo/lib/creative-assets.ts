export type CreativeProduct = "medal" | "shirt" | "mascot" | "poster";

export type CreativeBrief = {
  name: string;
  theme: string;
  values: string;
  culture: string;
  brand: string;
  charity: string;
};

export type CreativeDirection = {
  id: "heritage" | "future" | "charity";
  code: string;
  name: string;
  keywords: string[];
  summary: string;
};

export type CreativeDesign = {
  product: CreativeProduct;
  design_name: string;
  keywords: string[];
  description: string;
  image: string;
  label: string;
};

export const creativeDirections: CreativeDirection[] = [
  { id:"heritage", code:"A", name:"古城文化系列", keywords:["古建","城墙","东方纹样","历史感"], summary:"以太原古县城和晋阳文脉建立赛事独有的城市文化辨识度。" },
  { id:"future", code:"B", name:"氢能未来系列", keywords:["科技","绿色能源","未来感"], summary:"把鹏飞氢能产业语言转译为轻盈、低碳、向前的视觉系统。" },
  { id:"charity", code:"C", name:"公益温暖系列", keywords:["爱心","阳光","奔跑","公益"], summary:"用阳光、陪伴和奔跑轨迹放大赛事的公益情感价值。" },
];

export const creativeProducts: Record<CreativeProduct, string> = {
  medal:"完赛奖牌", shirt:"赛事T恤", mascot:"吉祥物IP", poster:"赛事海报",
};

const productDesigns: Record<CreativeProduct, Omit<CreativeDesign,"product">> = {
  medal:{design_name:"古城文化完赛奖牌",label:"FINISHER MEDAL",keywords:["古城","氢能","公益","奔跑"],description:"融合太原古县城城墙轮廓、晋阳文化纹样以及马拉松奔跑元素，中心以绿色能量环连接企业氢能基因，体现城市历史底蕴与体育精神。",image:"/creative-assets/award/hydrogen_future.png"},
  shirt:{design_name:"氢路同行赛事T恤",label:"EVENT T-SHIRT",keywords:["氢分子","古城赛道","绿色科技","同行"],description:"正面以氢分子和速度轨迹建立科技感，背面将太原古县城融入连绵赛道。白色轻量基底兼顾运动功能与传播识别。",image:"/creative-assets/tshirt/tshirt01.png"},
  mascot:{design_name:"氢小跑吉祥物IP",label:"MASCOT IP",keywords:["氢能精灵","公益温暖","奔跑活力"],description:"以氢能源与未来科技为灵感塑造亲和的机器人跑者。能量叶、爱心和奔跑姿态分别承载绿色低碳、公益陪伴与马拉松精神。",image:"/creative-assets/mascot/qing_runner.png"},
  poster:{design_name:"氢筑新程赛事海报",label:"EVENT POSTER",keywords:["赛事全景","古城文化","品牌统一"],description:"以绿色能量轨迹串联古城、跑者、奖牌与企业品牌，将城市文化、氢能未来和公益行动浓缩为主视觉传播画面。",image:"/creative-assets/poster/campaign_overview.png"},
};

export function mockCreativeDesigns(brief: CreativeBrief): CreativeDesign[] {
  void brief;
  return (Object.keys(creativeProducts) as CreativeProduct[]).map(product=>({product,...productDesigns[product]}));
}

export function mockCreativeDesign(brief: CreativeBrief, product: CreativeProduct): CreativeDesign {
  return mockCreativeDesigns(brief).find(item=>item.product===product)!;
}
