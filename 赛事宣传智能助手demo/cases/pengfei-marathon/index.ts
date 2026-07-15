import { confirmed, unconfirmed, unknown } from "../../lib/case-fact-helpers";
import type { DemoCase } from "../../lib/case-types";
import { pengfeiMarathonSources } from "./sources";
import { pengfeiCopywriting } from "./copywriting";
import { pengfeiCreative } from "./creative";
import { pengfeiPpt } from "./ppt";
import { pengfeiVideo } from "./video";

const proposal = ["cooperation-proposal"];

export const pengfeiMarathonCase = {
  id: "pengfei-marathon",
  version: "1.0.0",
  updatedAt: "2026-07-14",
  sources: pengfeiMarathonSources,
  facts: {
    event: {
      fullName: confirmed("鹏飞集团杯·氢筑新程马拉松", proposal),
      shortName: unconfirmed("氢筑新程马拉松", proposal, "方案未单独确认对外简称。"),
      slogan: confirmed("氢筑新程，为爱奔跑", proposal),
      publicTheme: confirmed("为带给你阳光的人奔跑", proposal),
      date: unknown("当前材料未提供比赛日期。"),
      registrationPeriod: unknown("当前材料未提供报名时间。"),
      collectionPeriod: unknown("当前材料未提供领物安排。"),
      scale: unknown("当前材料未提供赛事规模。"),
      categories: unknown<string[]>("当前材料未提供比赛项目。"),
      city: unknown("合作方案未明确举办城市。"),
      venue: unknown("合作方案未明确举办地点。"),
      route: unknown("当前材料未提供赛道路线。"),
    },
    sponsor: {
      name: confirmed("鹏飞集团", proposal),
      cooperationType: confirmed("独家总冠名", proposal),
      industryKeywords: confirmed(["氢能", "清洁能源", "绿色低碳", "文旅", "酒店"], proposal),
    },
    charity: {
      positioning: confirmed(["感恩公益", "爱心帮扶", "全民健身", "绿色低碳"], proposal),
      beneficiary: unconfirmed("点爱基金及相关困难群体帮扶项目", proposal, "正式发布前需确认受赠主体。"),
      donationCommitment: unconfirmed("本次赛事全部报名费统一捐赠至点爱基金", proposal, "涉及资金捐赠，需确认捐赠主体、比例与执行方式。"),
    },
  },
  demoDefaults: {
    city: "太原",
    venue: "太原古县城",
    culture: ["晋阳文化", "古建筑", "非遗元素"],
    notice: "城市与文化信息为演示预设，不代表正式赛事安排。",
  },
  presentation: {
    pptClosing: "以氢筑新程，以爱抵达远方",
    disclaimer: "赛事具体安排以组委会正式公告为准。",
    prohibitedClaims: ["全国第一", "行业唯一", "绝对领先", "保证效果"],
  },
  modules: {
    copywriting: pengfeiCopywriting,
    video: pengfeiVideo,
    ppt: pengfeiPpt,
    creative: pengfeiCreative,
  },
} satisfies DemoCase;
