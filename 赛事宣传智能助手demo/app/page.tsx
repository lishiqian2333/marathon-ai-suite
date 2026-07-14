"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { creativeDirections, creativeProducts, mockCreativeDesigns, type CreativeBrief, type CreativeDesign, type CreativeProduct } from "../lib/creative-assets";

type Scene = "signup" | "route" | "guide";
type Tone = "official" | "passion" | "culture" | "young";
type SideTab = "titles" | "check" | "channels";
type LengthRange = "500-800" | "800-1200" | "1200-1600";
type ProductModule = "copy" | "video" | "creative" | "ppt";
type EventInfo = { title:string; subtitle:string; date:string; scale:string; focus:string };
const lengthRanges: Record<LengthRange,string> = {"500-800":"精简（500—800字）","800-1200":"标准（800—1200字）","1200-1600":"深度（1200—1600字）"};

const scenes: Record<Scene, { name: string; icon: string; hint: string }> = {
  signup: { name: "报名启动", icon: "旗", hint: "正式官宣与报名转化" },
  route: { name: "赛道发布", icon: "线", hint: "城市地标与赛道亮点" },
  guide: { name: "领物交通", icon: "行", hint: "复杂信息清晰传达" },
};

const tones: Record<Tone, string> = {
  official: "官方权威",
  passion: "热血动感",
  culture: "城市人文",
  young: "年轻活力",
};

const content: Record<Scene, { title: string; subtitle: string; date: string; focus: string; body: Record<Tone, string>; titles: string[]; moments: string[]; video: string }> = {
  signup: {
    title: "2026太原马拉松",
    subtitle: "报名启动",
    date: "2026年9月20日 07:30",
    focus: "城市文化、赛事规模、报名时间",
    titles: [
      "奔跑太原，晋在眼前｜2026太原马拉松报名正式启动",
      "全城开跑！2026太原马拉松报名通道今日开启",
      "一场马拉松，读懂一座城｜相约2026太马",
      "穿越古今，向新而跑：2026太马等你上场",
      "报名开启｜在汾河之畔，跑出你的太原记忆",
    ],
    moments: [
      "太马回来了！穿过城市文脉，奔向崭新终点。2026太原马拉松报名今日开启，期待在汾河之畔与你并肩出发。",
      "一场马拉松，一次与太原的深度相遇。9月20日，等你来跑！报名入口请戳公众号原文。",
      "从双塔晨光到汾河秋色，42.195公里的城市长卷即将展开。你的太马故事，从报名这一刻开始。",
    ],
    video: "太原，不只有厚重的历史，也有向前奔跑的力量。2026年9月20日，让我们迎着汾河晨风，穿越城市文脉，在每一步中遇见新的太原。2026太原马拉松，报名正式开启。",
    body: {
      official: `经赛事组委会筹备，2026太原马拉松将于9月20日鸣枪开跑，赛事报名通道今日正式开启。来自全国各地的跑者将再次相聚锦绣太原，以脚步丈量城市发展，以奔跑感受千年文脉。\n\n本届赛事设置马拉松、半程马拉松两个项目，计划招募参赛选手40,000人。赛道将串联城市代表性景观，让跑者在竞技挑战中领略太原的历史底蕴与现代活力。\n\n【报名安排】\n报名时间：7月15日10:00至7月25日18:00\n比赛时间：2026年9月20日07:30\n报名方式：点击文末“阅读原文”进入官方报名页面\n\n请参赛选手认真阅读竞赛规程及报名须知，如实填写个人信息。报名人数超过项目限额时，将按照赛事规程进行抽签。最终安排以组委会官方公告为准。\n\n相约锦绣太原，共赴奔跑之约。2026太原马拉松，期待你的加入！`,
      passion: `城市的心跳，正在为一次出发加速。\n\n2026年9月20日，当第一束晨光落在汾河之畔，40,000名跑者将用脚步唤醒太原。穿过古老文脉，奔向城市新章，这一次，每个人都是赛道的主角。\n\n马拉松、半程马拉松两大项目，报名通道今日正式开启！无论你要挑战42.195公里，还是在半程终点刷新自己，这条赛道都在等你。\n\n报名时间：7月15日10:00—7月25日18:00\n比赛时间：9月20日07:30\n报名入口：点击文末“阅读原文”\n\n准备好了吗？把训练过的清晨、咬牙坚持的夜晚，都带到太原。鸣枪时刻，我们一起向前！`,
      culture: `一条赛道，是认识一座城市最动人的方式。\n\n从古城文脉到汾河新景，从厚重历史到蓬勃日常，2026太原马拉松将于9月20日展开一幅流动的城市长卷。报名通道，今日正式开启。\n\n本届赛事设置马拉松、半程马拉松两个项目，计划迎接40,000名跑者。你将在奔跑中感受千年晋阳的沉静底色，也会看见一座现代太原舒展、开放的城市姿态。\n\n报名时间：7月15日10:00—7月25日18:00\n比赛时间：9月20日07:30\n报名方式：点击文末“阅读原文”\n\n用一场奔跑，把太原写进你的记忆。这个秋天，我们在汾河之畔等你。`,
      young: `跑友们，集合！2026太马真的要来了！\n\n9月20日，和40,000名跑者一起解锁太原的秋日限定路线。半马冲PB，全马拼到底，沿途还有城市风景和全城加油声为你“充电”。\n\n报名时间：7月15日10:00—7月25日18:00\n比赛项目：马拉松 / 半程马拉松\n报名入口：点击文末“阅读原文”\n\n名额有限，记得先看竞赛规程，再定好闹钟。转发给你的跑搭子，今年一起把太马跑进朋友圈！`,
    },
  },
  route: {
    title: "2026太原马拉松",
    subtitle: "赛道发布",
    date: "2026年9月20日 07:30",
    focus: "汾河景观、城市地标、赛道体验",
    titles: ["赛道发布｜42.195公里，读懂锦绣太原", "从城市晨光跑向汾河秋色，2026太马路线揭晓", "一图看懂2026太原马拉松赛道", "这条赛道，藏着太原的过去与现在", "PB路线已上线！2026太马赛道亮点抢先看"],
    moments: ["42.195公里城市长卷正式展开！2026太马赛道今日发布。", "一路风景，一路加油。收藏这份赛道亮点，提前跑进太原。", "从起点到终点，每一步都有城市故事。"],
    video: "一条赛道，连接城市的过去与未来。从晨光中的起点出发，沿汾河一路向前。42.195公里，不只是距离，更是一场与太原的深度相遇。",
    body: {
      official: `2026太原马拉松赛道正式发布。赛事将于9月20日07:30鸣枪起跑，赛道整体延续平稳、开阔、城市景观丰富的特点。\n\n路线串联汾河沿岸景观与城市代表性区域，兼顾专业竞赛需求和城市展示功能。组委会将在沿途设置计时、补给、医疗及志愿服务点，为参赛选手提供保障。\n\n具体路线及交通管制安排，以后续官方公告为准。请选手合理制定训练与配速计划。`,
      passion: `42.195公里的挑战，已经有了清晰的方向。2026太马赛道今日揭晓！\n\n从城市晨光出发，沿着汾河一路向前。开阔路面适合稳住节奏，沿途呐喊会在疲惫时推你一把。每一公里，都离目标更近。\n\n9月20日，准备在这条赛道上交出你的答案。`,
      culture: `一条马拉松赛道，也是一条城市阅读路线。\n\n2026太马沿汾河铺展，将自然景观、城市肌理与晋阳文脉连成一幅流动长卷。跑者从晨光中出发，在脚步与呼吸之间，看见太原的从容与新生。\n\n9月20日，让我们用42.195公里，慢慢读懂这座城。`,
      young: `路线图已加载，PB计划可以安排了！\n\n2026太马赛道今天正式亮相：路面开阔、景观在线、氛围感拉满。沿途补给和医疗服务点也会按标准配置。\n\n先收藏路线，再转发跑搭子。9月20日，赛道见！`,
    },
  },
  guide: {
    title: "2026太原马拉松",
    subtitle: "领物与交通指南",
    date: "2026年9月17日—19日",
    focus: "领物时间、所需证件、公共交通",
    titles: ["参赛必看｜2026太马领物与比赛日交通指南", "收藏这一篇，太马领物出行不迷路", "号码布怎么领？起点怎么去？一文说清", "太马赛前重要提醒，请每位跑者查收", "领物倒计时｜时间、地点、交通全攻略"],
    moments: ["太马领物即将开始！请本人携带身份证件和领物二维码，错峰前往。", "比赛日建议公共交通出行，详细安排请以官方最新公告为准。", "赛前最后一份攻略：证件、领物、交通一次说清，建议收藏。"],
    video: "太马开跑在即。参赛物资领取时间为9月17日至19日，请本人携带有效身份证件和领物二维码。比赛日建议优先乘坐公共交通，并为安检和检录预留充足时间。",
    body: {
      official: `2026太原马拉松参赛物资领取工作将于9月17日至19日进行。为确保顺利参赛，请选手提前阅读以下安排。\n\n【领取时间】\n9月17日—18日 10:00—19:00\n9月19日 09:00—21:00\n\n【所需材料】\n本人有效身份证件原件、领物二维码。原则上不接受代领。\n\n【比赛日交通】\n起点周边将实施临时交通管制，建议选手优先乘坐公共交通，并至少提前90分钟抵达。具体领取地点、地铁运营及接驳安排以官方最新公告为准。`,
      passion: `离站上太马赛道，只差最后一步准备！\n\n9月17日至19日，参赛物资领取开启。带好本人身份证件和领物二维码，把号码布稳稳拿到手。\n\n比赛日道路将临时管制，建议公共交通出行，提前90分钟到达。把时间留给热身，把状态留给赛道！`,
      culture: `一场期待已久的奔跑即将开始。抵达太原后，请先收好这份赛前指南。\n\n参赛物资将于9月17日至19日发放，请本人携带有效身份证件和领物二维码领取。比赛日建议乘坐公共交通前往起点，并预留充足时间。\n\n愿你从容抵达，也从容感受这座城市。`,
      young: `太马进入开跑倒计时！这几件事请记牢：\n\n① 9月17日—19日领物\n② 带身份证原件和领物二维码\n③ 原则上不能代领\n④ 比赛日别开车挤起点\n⑤ 至少提前90分钟到场\n\n收藏、截图、转给跑搭子，别让准备环节拖了PB的后腿！`,
    },
  },
};

function Icon({ children }: { children: React.ReactNode }) { return <span className="icon">{children}</span>; }
function defaultEventInfo(scene:Scene):EventInfo { const x=content[scene]; return {title:x.title,subtitle:x.subtitle,date:x.date.split(" ")[0],scale:"40,000人",focus:x.focus}; }
function hasKnownValue(value:string) { const normalized=value.trim(); return Boolean(normalized) && normalized!=="待补充"; }
function applyConfirmedFacts(draft:string,info:EventInfo) {
 const cleaned=draft.split("\n").map(line=>{
   if(/(?:报名时间|比赛时间|领取时间)|(?:20\d{2}年)?\d{1,2}月\d{1,2}日|\d{1,2}月\d{1,2}日|\d{1,2}日至\d{1,2}日/.test(line)) return "";
   if(/(?:计划(?:招募|迎接)|和)?[\d,，]+名?(?:参赛选手|跑者|人)/.test(line)) return "";
   return line;
 }).join("\n").replace(/\n{3,}/g,"\n\n").trim();
 const facts=[hasKnownValue(info.date)?`赛事日期：${info.date}`:"",hasKnownValue(info.scale)?`赛事规模：${info.scale}`:""].filter(Boolean);
 return facts.length?`${cleaned}\n\n【赛事信息】\n${facts.join("\n")}`:cleaned;
}
function buildArticle(item:(typeof content)[Scene],tone:Tone,info:EventInfo,range:LengthRange) {
 const minimum=Number(range.split("-")[0]); const blocks=[
 "这不仅是一场关于速度与耐力的较量，也是跑者与城市彼此认识的机会。赛事将体育精神、城市风貌和大众参与连接起来，让每一位选手在脚步向前的过程中感受沿途的景观、文化与热情。",
 "为保障参赛体验，组委会将围绕竞赛组织、医疗救护、补给服务、交通引导和志愿服务等环节细致准备。各项安排将根据赛事进度持续完善，具体信息请关注后续官方公告。",
 "参赛选手可结合自身健康状况和训练基础，科学制定训练计划，合理安排作息与饮食。临近比赛时应减少高强度训练，提前熟悉天气、交通、检录和存包等安排。",
 "赛事当天，请选手预留充足出行时间，按照指定区域完成安检、存包与检录，并服从现场引导。如有身体不适，应及时减速或停止比赛，并向医疗人员求助。",
 "一场高质量赛事离不开每一位参与者的共同守护。倡导选手文明参赛、按区起跑、不随意丢弃垃圾；也欢迎市民在不影响赛事秩序的前提下热情助威。",
 "从起点的期待到终点的欢呼，每一公里都记录着坚持。无论目标是突破个人最好成绩，还是享受奔跑本身，都愿每位跑者在这里收获独特而珍贵的记忆。",
 `围绕${info.focus}，后续还将陆续发布报名须知、路线介绍、领物安排、交通指南和赛事服务等专题内容。建议选手及时收藏关键信息，做好完整的赛前准备。`,
 "赛事也将成为展示城市活力的一扇窗口。来自不同地区的跑者将在同一条赛道相遇，以奔跑感受城市发展，以交流传递体育友谊。",
 "组委会提醒，赛事日期、竞赛项目、参赛规模及现场服务可能根据实际情况调整。重要决定请以正式发布的竞赛规程、补充通知和官方公告为准。",
 `现在，属于${info.title}的脚步已经临近。期待每一位参赛者带着充分准备抵达起点，也期待更多市民关注赛事、参与赛事、分享赛事。`];
 let draft=applyConfirmedFacts(item.body[tone],info); for(const b of blocks){if(draft.length>=minimum+80)break;draft+=`\n\n${b}`;} return draft;
}

export default function Home() {
  const [productModule, setProductModule] = useState<ProductModule>("copy");
  const [scene, setScene] = useState<Scene>("signup");
  const [tone, setTone] = useState<Tone>("culture");
  const [tab, setTab] = useState<SideTab>("titles");
  const [article, setArticle] = useState("");
  const [headline, setHeadline] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [eventInfo, setEventInfo] = useState<EventInfo>({title:"",subtitle:"",date:"",scale:"",focus:""});
  const [lengthRange, setLengthRange] = useState<LengthRange>("800-1200");
  const [command, setCommand] = useState("");
  const [hasBrief, setHasBrief] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Array<{role:"assistant"|"user"; text:string}>>([{role:"assistant",text:"请描述你的宣传需求，我会为你创建任务并生成初稿。"}]);
  const item = content[scene];

  const checks = useMemo(() => [
    { ok: Boolean(eventInfo.title.trim()), label: "赛事名称", text: eventInfo.title || "请填写赛事名称" },
    { ok: hasKnownValue(eventInfo.date), label: "时间信息", text: hasKnownValue(eventInfo.date) ? eventInfo.date : "请填写赛事日期" },
    { ok: article.includes("官方") || article.includes("为准"), label: "免责声明", text: article.includes("官方") || article.includes("为准") ? "已提示以官方公告为准" : "建议补充官方口径提示" },
    { ok: !/第一|唯一|保证|绝对/.test(article), label: "宣传表达", text: "未发现绝对化高风险用语" },
  ], [article, eventInfo]);
  function updateEventInfo(field:keyof EventInfo,value:string){setEventInfo(x=>({...x,[field]:value}));}

  function switchScene(next: Scene) {
    const info=defaultEventInfo(next); setHasBrief(true); setScene(next); setEventInfo(info); setHeadline(content[next].titles[0]); setArticle(buildArticle(content[next],tone,info,lengthRange)); setGenerated(true);
  }
  function generate() {
    setHistory((h) => [...h.slice(-4), article]);
    setArticle(buildArticle(item,tone,eventInfo,lengthRange)); setHeadline(`${eventInfo.title}｜${eventInfo.subtitle}`); setGenerated(false);
    window.setTimeout(() => setGenerated(true), 650);
  }
  function changeTone(next: Tone) {
    setHistory((h) => [...h.slice(-4), article]); setTone(next); setArticle(buildArticle(item,next,eventInfo,lengthRange));
  }
  function copy(text: string, label: string) {
    navigator.clipboard?.writeText(text); setCopied(label); window.setTimeout(() => setCopied(""), 1400);
  }

  function streamArticle(target:string) {
    setArticle(""); setIsStreaming(true); setGenerated(false);
    return new Promise<void>((resolve) => {
      let cursor=0; const timer=window.setInterval(()=>{
        cursor=Math.min(cursor+Math.max(3,Math.floor(Math.random()*8)),target.length);
        setArticle(target.slice(0,cursor));
        if(cursor>=target.length){window.clearInterval(timer);setIsStreaming(false);setGenerated(true);resolve();}
      },32);
    });
  }
  async function runCommand(e: React.FormEvent) {
    e.preventDefault(); const value=command.trim(); if(!value||isThinking||isStreaming)return;
    setMessages(m=>[...m,{role:"user",text:value}]); setCommand(""); setIsThinking(true);
    await new Promise(resolve=>window.setTimeout(resolve,900+Math.random()*700));
    setIsThinking(false); let reply="已根据你的要求重新整理稿件。"; let target="";
    if(!hasBrief){
      const nextScene:Scene=/赛道|路线/.test(value)?"route":/领物|物资|参赛指南/.test(value)?"guide":"signup";
      const nextTone:Tone=/正式|官方|严谨/.test(value)?"official":/热血|激情/.test(value)?"passion":/年轻|活力/.test(value)?"young":"culture";
      const title=value.match(/((?:20\d{2})?[\u4e00-\u9fa5]{2,10}马拉松)/)?.[1] || "待命名马拉松赛事";
      const focusMatch=value.match(/(?:突出|重点(?:是|为)?|侧重|强调)([^，。；,;]+?)(?=，|。|；|,|;|控制|字数|$)/);
      const focus=focusMatch?.[1]?.trim() || (nextScene==="signup" ? "报名信息与赛事亮点" : nextScene==="route" ? "赛道特色与城市地标" : "领物流程与参赛提醒");
      const info:EventInfo={title,subtitle:scenes[nextScene].name,date:value.match(/20\d{2}年\d{1,2}月\d{1,2}日/)?.[0]||"待补充",scale:value.match(/[\d,，]+人/)?.[0]||"待补充",focus};
      const range:LengthRange=/500|精简|短/.test(value)?"500-800":/1200|深度|长文/.test(value)?"1200-1600":"800-1200";
      setScene(nextScene);setTone(nextTone);setEventInfo(info);setLengthRange(range);setHeadline(`${title}｜${scenes[nextScene].name}`);setHasBrief(true);
      target=buildArticle(content[nextScene],nextTone,info,range); reply="需求已创建，初稿已生成。你可以继续告诉我如何调整。";
    } else if(/正式|官方|严谨/.test(value)){setTone("official");target=buildArticle(item,"official",eventInfo,lengthRange);reply="已切换为官方、严谨的表达风格。";}
    else if(/热血|感染力|激情/.test(value)){setTone("passion");target=buildArticle(item,"passion",eventInfo,lengthRange);reply="已增强节奏和感染力。";}
    else if(/文化|人文|城市/.test(value)){setTone("culture");target=buildArticle(item,"culture",eventInfo,lengthRange);reply="已突出城市文化与赛道特色。";}
    else if(/年轻|活力|轻松/.test(value)){setTone("young");target=buildArticle(item,"young",eventInfo,lengthRange);reply="已切换为更年轻、有活力的表达。";}
    else if(/精简|缩短|500/.test(value)){target=article.length>500?article.slice(0,500)+"……":article;reply="已将正文精简到约500字以内。";}
    else if(/标题/.test(value)){setTab("titles");reply="已为你打开标题推荐。";}
    else if(/检查|核查|风险/.test(value)){setTab("check");reply="已完成信息核查，请查看右侧结果。";}
    else target=buildArticle(item,tone,eventInfo,lengthRange);
    if(target){setHistory(h=>[...h.slice(-4),article]);await streamArticle(target);}
    setMessages(m=>[...m,{role:"assistant",text:reply}]);
  }
  return <main className="app-shell">
    <header className="topbar">
      <div className="brand-mark">晋</div>
      <div className="brand-copy"><strong>AI 智能宣传内容创作平台</strong><span>AI CONTENT CREATION PLATFORM</span></div>
      <nav className="module-nav" aria-label="产品模块">
        <button className={productModule === "copy" ? "active" : ""} onClick={() => setProductModule("copy")}><span>文</span>公众号宣传文案</button>
        <button className={productModule === "video" ? "active" : ""} onClick={() => setProductModule("video")}><span>影</span>照片生成视频<em>Demo</em></button>
        <button className={productModule === "ppt" ? "active" : ""} onClick={() => setProductModule("ppt")}><span>报</span>汇报 PPT<em>Demo</em></button>
        <button className={productModule === "creative" ? "active" : ""} onClick={() => setProductModule("creative")}><span>创</span>文创产品设计<em>Demo</em></button>
      </nav>
    </header>

    {productModule === "video" ? <VideoDemo eventInfo={eventInfo} /> : productModule === "ppt" ? <PptDemo /> : productModule === "creative" ? <CreativeDemo /> : <section className="workspace">
      <aside className="setup-panel">
        <div className="panel-heading"><span>01</span><div><b>创建宣传任务</b><small>选择场景，补充赛事信息</small></div></div>
        <label className="field-label">宣传场景</label>
        <div className="scene-grid">
          {(Object.keys(scenes) as Scene[]).map((key) => <button key={key} onClick={() => switchScene(key)} className={hasBrief && scene === key ? "scene active" : "scene"}><Icon>{scenes[key].icon}</Icon><span><b>{scenes[key].name}</b><small>{scenes[key].hint}</small></span></button>)}
        </div>
        <div className="divider" />
        <label className="field-label">赛事基本信息 <em>可手动编辑</em></label>
        <label className="input-wrap"><span>赛事名称</span><input value={eventInfo.title} onChange={e=>updateEventInfo("title",e.target.value)} /></label>
        <label className="input-wrap"><span>宣传主题</span><input value={eventInfo.subtitle} onChange={e=>updateEventInfo("subtitle",e.target.value)} /></label>
        <div className="input-row"><label className="input-wrap"><span>赛事日期</span><input value={eventInfo.date} onChange={e=>updateEventInfo("date",e.target.value)} /></label><label className="input-wrap"><span>赛事规模</span><input value={eventInfo.scale} onChange={e=>updateEventInfo("scale",e.target.value)} /></label></div>
        <label className="input-wrap"><span>本次宣传重点</span><textarea value={eventInfo.focus} onChange={e=>updateEventInfo("focus",e.target.value)} /></label>
        <label className="field-label tone-label">内容风格</label>
        <div className="tone-list">{(Object.keys(tones) as Tone[]).map((key) => <button className={hasBrief && tone === key ? "active" : ""} key={key} onClick={() => changeTone(key)}>{tones[key]}</button>)}</div>
        <label className="field-label tone-label">文章字数范围</label>
        <div className="length-list">{(Object.keys(lengthRanges) as LengthRange[]).map(key=><button className={hasBrief && lengthRange===key?"active":""} key={key} onClick={()=>setLengthRange(key)}>{lengthRanges[key]}</button>)}</div>
        <button className="generate" onClick={generate} disabled={!hasBrief}><span>✦</span>{!hasBrief ? "请先描述需求" : generated ? "生成公众号文章" : "正在组织内容…"}</button>
        <p className="safe-note">AI负责起草，正式发布前需由宣传人员审核</p>
      </aside>

      <section className="editor-panel">
        <div className="editor-toolbar">
          <div><span className="step">02</span><b>公众号文章初稿</b><small>{hasBrief ? `${article.length} 字 · 刚刚更新` : "等待创建"}</small></div>
          <div className="editor-actions">
            {hasBrief && <div className="tools"><button onClick={() => changeTone("official")}>更正式</button><button onClick={() => changeTone("passion")}>更有感染力</button><button onClick={() => changeTone("culture")}>突出城市文化</button><button onClick={() => setArticle(article.length > 430 ? article.slice(0, 430) + "……" : article)}>精简内容</button></div>}
            <div className="document-actions">
              <span className="save-status"><i />{hasBrief ? "内容已自动保存" : "等待创建内容"}</span>
              <button className="ghost" onClick={() => { setHasBrief(false); setEventInfo({title:"",subtitle:"",date:"",scale:"",focus:""}); setArticle(""); setHeadline(""); setHistory([]); setMessages([{role:"assistant",text:"请描述你的宣传需求，我会为你创建任务并生成初稿。"}]); }}>新建需求</button>
              <button className="export" disabled={!hasBrief} onClick={() => copy(`${headline}\n\n${article}`, "文章已复制")}>{copied || "复制全文"}</button>
            </div>
          </div>
        </div>
        <section className="chat-control" aria-label="对话控制台">
          <div className="chat-title"><span>✦</span><div><b>对话控制</b><small>用自然语言调整当前稿件</small></div><i>在线</i></div>
          <div className="chat-messages" aria-live="polite">{messages.slice(-3).map((m,i)=><div key={`${m.role}-${i}`} className={`chat-message ${m.role}`}>{m.text}</div>)}{isThinking && <div className="chat-message assistant thinking"><i/><i/><i/><span>正在理解需求</span></div>}</div>
          <div className="quick-commands">{hasBrief ? <><button onClick={()=>setCommand("更正式一点")}>更正式</button><button onClick={()=>setCommand("精简到500字")}>精简</button><button onClick={()=>setCommand("突出城市文化")}>突出文化</button></> : <><button onClick={()=>setCommand("为太原马拉松创建报名启动推文")}>报名启动</button><button onClick={()=>setCommand("创建赛道发布宣传稿，突出城市文化")}>赛道发布</button><button onClick={()=>setCommand("创建领物通知，风格正式清晰")}>领物通知</button></>}</div>
          <form className="chat-input" onSubmit={runCommand}><input value={command} onChange={e=>setCommand(e.target.value)} placeholder={hasBrief ? "继续输入调整要求…" : "请描述要创建的赛事宣传需求…"}/><button aria-label="发送指令" disabled={isThinking||isStreaming}>{isThinking ? "…" : isStreaming ? "■" : "↑"}</button></form>
        </section>
        {hasBrief ? <div className={generated ? "paper" : "paper loading"}>
          <div className="article-type">{scenes[scene].name} · {tones[tone]}</div>
          <input className="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} aria-label="文章标题" />
          <div className="article-meta"><span>{eventInfo.title}</span>{eventInfo.date && eventInfo.date !== "待补充" && <span>{eventInfo.date}</span>}{eventInfo.scale && eventInfo.scale !== "待补充" && <span>{eventInfo.scale}</span>}</div>
          <div className="cover"><div className="track-lines"><i/><i/><i/><i/></div><div className="cover-word">RUN<br/><b>TAIYUAN</b></div><span>2026 · 向新而跑</span></div>
          <textarea className="article-body" value={article} onChange={(e) => setArticle(e.target.value)} aria-label="公众号文章正文" />
          <div className="article-footer"><span>{isStreaming ? "AI 正在生成…" : "内容由AI辅助生成"}</span><button onClick={() => copy(`${headline}\n\n${article}`, "已复制")}>{copied === "已复制" ? "✓ 已复制" : "复制正文"}</button></div>
        </div> : <div className="empty-canvas"><span>✦</span><b>从一个宣传需求开始</b><p>在下方输入赛事名称、宣传场景、文章风格和字数要求</p></div>}
        {history.length > 0 && <button className="undo" onClick={() => { const old = history.at(-1); if(old) setArticle(old); setHistory(h => h.slice(0,-1)); }}>↶ 恢复上一版本</button>}
      </section>

      <aside className={hasBrief ? "assist-panel" : "assist-panel empty-assist"}>
        <div className="panel-heading"><span>03</span><div><b>智能辅助</b><small>标题、核查与渠道改写</small></div></div>{!hasBrief && <div className="assist-empty"><span>✦</span><b>等待生成内容</b><small>创建需求后，这里将提供标题推荐、信息核查和渠道改写</small></div>}
        <div className="tabs"><button className={tab === "titles" ? "active" : ""} onClick={() => setTab("titles")}>标题推荐</button><button className={tab === "check" ? "active" : ""} onClick={() => setTab("check")}>信息核查</button><button className={tab === "channels" ? "active" : ""} onClick={() => setTab("channels")}>一稿多用</button></div>
        {tab === "titles" && <div className="tab-content"><div className="tip"><b>标题建议</b><span>兼顾官方表达与传播吸引力</span></div>{item.titles.map((t, i) => <button className={headline === t ? "title-card selected" : "title-card"} key={t} onClick={() => setHeadline(t)}><em>0{i+1}</em><span>{t}</span><i>使用</i></button>)}</div>}
        {tab === "check" && <div className="tab-content"><div className="score"><strong>{checks.filter(x => x.ok).length}/4</strong><span>关键信息检查通过</span></div>{checks.map((x) => <div className="check-card" key={x.label}><i className={x.ok ? "ok" : "warn"}>{x.ok ? "✓" : "!"}</i><span><b>{x.label}</b><small>{x.text}</small></span></div>)}<div className="source"><b>本稿使用资料</b><span>《2026太原马拉松竞赛规程（演示）》</span><span>《赛事宣传基础信息表（演示）》</span></div></div>}
        {tab === "channels" && <div className="tab-content"><div className="channel-head"><b>朋友圈文案</b><button onClick={() => copy(item.moments.join("\n\n"), "朋友圈已复制")}>复制全部</button></div>{item.moments.map((m,i) => <div className="moment" key={m}><span>版本 {i+1}</span><p>{m}</p><button onClick={() => copy(m, `版本${i+1}已复制`)}>复制</button></div>)}<div className="channel-head video-head"><b>30秒视频口播</b><button onClick={() => copy(item.video, "口播已复制")}>复制</button></div><div className="video-copy">{item.video}</div></div>}
        <div className="assist-footer"><span>✦</span><p><b>正式版可接入赛事知识库</b><small>根据规程、往届文章与宣传口径实时生成</small></p></div>
      </aside>
    </section>}
  </main>;
}

type CreativeStage = "brief" | "analyzing" | "directions" | "done";

function CreativeDemo(){
  const [brief,setBrief]=useState<CreativeBrief>({name:"鹏飞集团杯·氢筑新程马拉松",theme:"氢筑新程，为爱奔跑",values:"绿色低碳 / 公益感恩 / 全民健身 / 城市传播",culture:"太原古县城 / 晋阳文化 / 古建筑 / 非遗元素",brand:"鹏飞集团 / 氢能源 / 绿色发展",charity:"为带给你阳光的人奔跑"});
  const [product,setProduct]=useState<CreativeProduct>("medal");
  const [direction,setDirection]=useState(creativeDirections[0].id);
  const [stage,setStage]=useState<CreativeStage>("brief");
  const [progress,setProgress]=useState(0);
  const [design,setDesign]=useState<CreativeDesign|null>(null);
  const [preview,setPreview]=useState(false);
  const update=(key:keyof CreativeBrief,value:string)=>setBrief(x=>({...x,[key]:value}));
  const designs=mockCreativeDesigns(brief);
  useEffect(()=>{if(stage!=="analyzing"&&stage!=="directions")return;const timer=window.setInterval(()=>setProgress(p=>{const next=Math.min(100,p+2);if(next>=58&&stage==="analyzing")setStage("directions");if(next===100){setDesign(mockCreativeDesigns(brief).find(x=>x.product===product)!);setStage("done")}return next}),45);return()=>window.clearInterval(timer)},[stage,brief,product]);
  function generate(){setProgress(2);setDesign(null);setStage("analyzing")}
  function chooseProduct(next:CreativeProduct){setProduct(next);setDesign(designs.find(x=>x.product===next)!)}
  const status=stage==="brief"?"等待生成":stage==="analyzing"?"AI 文化解析中":stage==="directions"?"正在生成设计方向":"文创体系已生成";
  return <section className="creative-workspace">
    <aside className="creative-brief">
      <div className="panel-heading"><span>01</span><div><b>赛事信息输入</b><small>构建 AI 文创设计 Brief</small></div></div>
      <div className="brief-scroll">
        {([ ["name","赛事名称"],["theme","赛事主题"],["values","赛事理念"],["culture","城市文化"],["brand","企业元素"],["charity","公益主题"] ] as [keyof CreativeBrief,string][]).map(([key,label])=><label className="creative-field" key={key}><span>{label}<i>已识别</i></span>{key==="name"||key==="theme"||key==="charity"?<input value={brief[key]} onChange={e=>update(key,e.target.value)}/>:<textarea value={brief[key]} onChange={e=>update(key,e.target.value)}/>}</label>)}
        <div className="brief-insight"><span>✦</span><p><b>AI 已识别 12 个核心元素</b><small>绿色氢能、晋阳古城与公益阳光，可形成科技、文化、情感三条差异化设计路线。</small></p></div>
      </div>
      <button className="creative-generate" onClick={generate} disabled={stage==="analyzing"||stage==="directions"}><span>✦</span>{stage==="done"?"重新生成设计方案":"生成设计方案"}</button>
    </aside>
    <main className="creative-main">
      <div className="creative-head"><div><span className="step">02</span><p><b>AI 赛事文创设计方案中心</b><small>{brief.name} · 全品类设计体系</small></p></div><span className={`stage-pill ${stage}`}><i/>{status}</span></div>
      {stage==="brief"?<div className="creative-empty"><div className="creative-orbit"><span>AI</span><i/><i/><i/></div><h2>让赛事文化变成一套文创体系</h2><p>AI 将先解析城市、品牌与公益文化，再生成多条设计方向和四类文创产品方案。</p><div><i>1</i>AI文化解析<b>→</b><i>2</i>设计方向<b>→</b><i>3</i>文创体系</div></div>:stage!=="done"?<div className="creative-process-board"><div className="process-title"><span>✦</span><div><small>STEP 01 / AI CULTURE ANALYSIS</small><h2>{stage==="analyzing"?"AI 文化解析":"设计方向生成"}</h2><p>{stage==="analyzing"?"正在理解赛事背后的城市文脉、企业基因与公益价值":"文化基因已完成聚类，正在形成三条差异化视觉路线"}</p></div><b>{progress}%</b></div><div className="creative-progress"><i><b style={{width:`${progress}%`}}/></i></div><div className="culture-analysis">{["正在分析赛事文化...","已识别城市文化元素","已提取视觉符号","已匹配企业品牌元素","已融合公益主题"].map((x,i)=><div className={progress>i*11+5?"done":""} key={x}><i>{progress>i*11+5?"✓":"·"}</i><span>{x}</span><small>{["太原古县城 · 晋阳文化","古建筑纹样 · 城墙轮廓","奔跑轨迹 · 东方纹样","鹏飞集团 · 氢能源绿色科技","阳光 · 爱心 · 公益奔跑"][i]}</small></div>)}</div>{stage==="directions"&&<div className="direction-preview">{creativeDirections.map(item=><article key={item.id}><em>方案 {item.code}</em><b>{item.name}</b><span>{item.keywords.join(" · ")}</span></article>)}</div>}</div>:design&&<>
        <div className="creative-summary"><span>✦ AI 文化理解</span><p>已识别 <b>太原古县城、晋阳文化、古建筑纹样、氢能源绿色科技、公益奔跑</b> 五组核心文化基因，并自动形成完整产品体系。</p><em>4 类方案已生成</em></div>
        <section className="direction-section"><div className="creative-section-head"><div><small>STEP 02</small><b>设计方向生成</b></div><span>选择方向可统一整套文创的视觉语言</span></div><div className="direction-grid">{creativeDirections.map(item=><button className={direction===item.id?"active":""} onClick={()=>setDirection(item.id)} key={item.id}><em>方案 {item.code}</em><b>{item.name}</b><p>{item.summary}</p><span>{item.keywords.map(x=><i key={x}>{x}</i>)}</span></button>)}</div></section>
        <section className="product-section"><div className="creative-section-head"><div><small>STEP 03</small><b>文创产品体系</b></div><span>已按「{creativeDirections.find(x=>x.id===direction)?.name}」完成视觉适配</span></div><div className="product-category-grid">{designs.map(item=><button className={product===item.product?"active":""} onClick={()=>chooseProduct(item.product)} key={item.product}><span>{({medal:"奖",shirt:"衣",mascot:"IP",poster:"画"} as Record<CreativeProduct,string>)[item.product]}</span><b>{creativeProducts[item.product]}</b><small>{item.design_name}</small><i>查看方案 →</i></button>)}</div></section>
        <article className="concept-card creative-result-card">
          <div className="product-mock local-product"><img src={design.image} alt={`${design.design_name}${creativeProducts[product]}效果图`}/><span className="render-tag">本地 AI 设计素材</span></div>
          <div className="concept-copy"><header><span>STEP 04 / PRODUCT DESIGN</span><h3>{design.design_name}</h3><small>{design.label}</small></header><section><b>设计理念</b><p>{design.description}</p></section><section><b>设计关键词</b><div className="keyword-row">{design.keywords.map(x=><i key={x}>{x}</i>)}</div></section><section><b>体系关联</b><p>沿用「{creativeDirections.find(x=>x.id===direction)?.name}」的色彩、纹样与叙事语言，与其余三类文创保持统一。</p></section><footer><span>✓ AI 方案与本地效果图已匹配</span><button onClick={()=>setPreview(true)}>查看大图 ↗</button></footer></div>
        </article>
        {preview&&<div className="creative-lightbox" role="dialog" aria-modal="true" aria-label="设计效果图预览" onClick={()=>setPreview(false)}><button aria-label="关闭预览">×</button><img src={design.image} alt={`${design.design_name}大图预览`}/><p><b>{design.design_name}</b><span>{creativeProducts[product]} · 本地素材</span></p></div>}
      </>}
    </main>
  </section>
}

type VideoStage = "empty" | "ready" | "analyzing" | "editing" | "done";
type VideoAsset = { src:string; name:string; label:string; note:string; orientation:"横图"|"竖图" };

const demoAssets:VideoAsset[] = [
  {src:"/demo-media/01-start.jpg",name:"赛事起跑.jpg",label:"起跑 / 群像",note:"适合作为开场，快速建立赛事规模",orientation:"横图"},
  {src:"/demo-media/02-city.jpg",name:"城市赛道.jpg",label:"城市 / 赛道",note:"高机位画面，承接城市叙事",orientation:"竖图"},
  {src:"/demo-media/03-pack.jpg",name:"跑者方阵.jpg",label:"奔跑 / 节奏",note:"人群动势强，适合节拍加速",orientation:"竖图"},
  {src:"/demo-media/04-pacer.jpg",name:"配速跑者.jpg",label:"奔跑 / 氛围",note:"色彩鲜明，强化现场参与感",orientation:"竖图"},
  {src:"/demo-media/05-runner.jpg",name:"领先跑者.jpg",label:"人物 / 速度",note:"主体清晰，适合动态推近",orientation:"横图"},
  {src:"/demo-media/06-smile.jpg",name:"跑者笑脸.jpg",label:"人物 / 情绪",note:"情绪感染力高，作为情感转折",orientation:"竖图"},
  {src:"/demo-media/07-finish.jpg",name:"冲线时刻.jpg",label:"冲线 / 高潮",note:"动作明确，适合作为高潮镜头",orientation:"横图"},
  {src:"/demo-media/08-celebrate.jpg",name:"完赛庆祝.jpg",label:"完赛 / 欢呼",note:"正向情绪，承接品牌收束",orientation:"竖图"},
];

function VideoDemo({eventInfo}:{eventInfo:EventInfo}) {
  const [stage,setStage]=useState<VideoStage>("empty");
  const [progress,setProgress]=useState(0);
  const [selected,setSelected]=useState(0);
  const [assets,setAssets]=useState<VideoAsset[]>([]);
  const [format,setFormat]=useState<"landscape"|"portrait">("landscape");
  const [prompt,setPrompt]=useState("");
  const [messages,setMessages]=useState<Array<{role:"ai"|"user";text:string}>>([{role:"ai",text:"你好，我是视频创作助手。请先导入赛事照片，再告诉我想做一条什么样的宣传视频。"}]);
  const eventName=eventInfo.title || "2026太原马拉松";
  const statusText=stage==="empty"?"等待导入照片":stage==="ready"?"等待生成指令":stage==="analyzing"?"AI 正在理解照片内容":stage==="editing"?"正在编排节奏、转场与字幕":"视频生成完成";
  useEffect(()=>{if(stage!=="analyzing"&&stage!=="editing")return;const timer=window.setInterval(()=>setProgress(value=>{const next=Math.min(value+2,100);if(next===48)setStage("editing");if(next===100)setStage("done");return next;}),55);return()=>window.clearInterval(timer);},[stage]);
  function loadAssets(next:VideoAsset[]){setAssets(next);setSelected(0);setStage("ready");setProgress(0);setMessages(m=>[...m,{role:"ai",text:`已收到 ${next.length} 张照片。我识别到起跑、城市赛道、跑者特写和冲线场景。你可以继续描述视频风格，或直接让我生成。`}]);}
  function generate(){if(!assets.length)return;setMessages(m=>[...m,{role:"ai",text:"好的，开始生成。故事线采用“出发—坚持—抵达”，并加入动态运镜、节拍转场和热血音乐。"}]);setProgress(4);setStage("analyzing");}
  function importFiles(e:React.ChangeEvent<HTMLInputElement>){const files=Array.from(e.target.files||[]);if(!files.length)return;loadAssets(files.slice(0,12).map((file,index)=>({src:URL.createObjectURL(file),name:file.name,label:"待智能识别",note:`已导入第 ${index+1} 张照片`,orientation:"横图"})));}
  function sendPrompt(e:React.FormEvent){e.preventDefault();const value=prompt.trim();if(!value)return;setMessages(m=>[...m,{role:"user",text:value}]);setPrompt("");if(!assets.length){setMessages(m=>[...m,{role:"ai",text:"还没有可用照片。请先导入照片，导入后我再为你生成。"}]);return;}if(/生成|开始|成片|制作/.test(value)){generate();return;}setMessages(m=>[...m,{role:"ai",text:"已记录：15 秒、16:9 横版，并按你的要求调整画面节奏。确认后回复“开始生成”即可。"}]);}
  return <section className="photo-video-workspace">
    <aside className="photo-rail video-chat-rail">
      <div className="panel-heading"><span>01</span><div><b>AI 视频创作助手</b><small>通过对话完成照片成片</small></div></div>
      <div className="video-chat-messages">{messages.slice(-5).map((message,index)=><div className={`video-bubble ${message.role}`} key={`${message.text}-${index}`}>{message.role==="ai"&&<span>AI</span>}<p>{message.text}</p></div>)}</div>
      {assets.length>0&&<div className="asset-count"><span><i/>已导入 {assets.length} 张</span><em>质量检查通过</em></div>}
      <div className="photo-list">{assets.map((asset,index)=><button key={`${asset.name}-${index}`} className={selected===index?"active":""} onClick={()=>setSelected(index)}><img src={asset.src} alt={asset.label}/><span><b>{String(index+1).padStart(2,"0")} · {asset.label}</b><small>{asset.name}</small></span><em>✓</em></button>)}</div>
      <div className="video-chat-composer">
        <div className="chat-import-actions"><label><input type="file" accept="image/*" multiple onChange={importFiles}/><span>＋</span>导入照片</label><button onClick={()=>loadAssets(demoAssets)}>导入演示照片</button></div>
        <form className="video-chat-input" onSubmit={sendPrompt}><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={assets.length?"例如：做成15秒热血宣传片……":"请先导入照片……"}/><div><span>{assets.length?`已导入 ${assets.length} 张照片`:"尚未导入素材"}</span><button type="submit" disabled={!prompt.trim()}>↑</button></div></form>
        <button className="chat-generate" disabled={!assets.length||stage==="analyzing"||stage==="editing"} onClick={generate}><span>✦</span>{stage==="analyzing"||stage==="editing"?"正在生成视频…":"确认并生成视频"}</button>
      </div>
    </aside>
    <section className="creation-stage">
      <div className="creation-head"><div><span className="step">02</span><p><b>AI 照片成片</b><small>{stage==="empty"?"新建视频任务":`${eventName} · 15 秒横版宣传片`}</small></p></div><span className={`stage-pill ${stage}`}><i/>{statusText}</span></div>
      {stage==="empty"?<div className="video-empty-state"><span>＋</span><h2>从照片开始创作视频</h2><p>在左侧对话框导入赛事照片，AI 会理解画面内容并与你确认成片要求。</p><div><i>1</i>导入照片<b>→</b><i>2</i>对话描述<b>→</b><i>3</i>生成视频</div></div>:stage!=="done"?<div className="photo-analysis-card">
        <div className="analysis-visual"><img src={assets[selected].src} alt="当前分析素材"/><div className="scan-line"/><div className="detect-tag top">人物主体 · 96%</div><div className="detect-tag bottom">赛事场景 · 98%</div><div className="analysis-caption"><small>AI VISION / {String(selected+1).padStart(2,"0")}</small><strong>{assets[selected].label}</strong><span>{assets[selected].note}</span></div></div>
        <div className="analysis-panel"><span className="ai-kicker">✦ AI 素材理解</span><h2>{stage==="ready"?"照片已导入，等待你的创作指令":"正在把静态照片变成有节奏的故事"}</h2><p>{stage==="ready"?"继续在左侧对话中描述时长、风格、字幕等要求。AI 会根据对话控制视频生成。":"已识别起跑、城市赛道、跑者特写与冲线等关键场景，正在按“出发—坚持—抵达”的叙事结构完成剪辑。"}</p>
          <div className="analysis-facts"><div><b>{assets.length}</b><span>张有效照片</span></div><div><b>15s</b><span>目标时长</span></div><div><b>16:9</b><span>输出画幅</span></div></div>
          {stage==="ready"?<div className="waiting-command"><span>←</span><p><b>等待你的生成指令</b><small>请在左侧对话框继续描述，或点击“确认并生成视频”</small></p></div>:<div className="generation-progress"><div><span>{statusText}</span><b>{progress}%</b></div><i><b style={{width:`${progress}%`}}/></i></div>}
        </div>
      </div>:<div className="final-video-card">
        <div className="video-topline"><div><span className="success-check">✓</span><p><b>《每一步，都算数》</b><small>15 秒 · 高清 · 已完成智能运镜与节奏剪辑</small></p></div><div className="format-switch"><button className={format==="landscape"?"active":""} onClick={()=>setFormat("landscape")}>16:9 横版</button><button className={format==="portrait"?"active":""} onClick={()=>setFormat("portrait")}>9:16 竖版</button></div></div>
        <div className={`real-video ${format}`}><video controls playsInline preload="metadata" poster="/demo-media/01-start.jpg"><source src="/demo-media/final.mp4" type="video/mp4"/>你的浏览器暂不支持视频播放。</video></div>
        <div className="result-meta"><div><span>智能选片</span><b>{assets.length} / {assets.length} 张已使用</b></div><div><span>故事结构</span><b>出发 · 坚持 · 抵达</b></div><div><span>视觉处理</span><b>动态推拉 · 节拍转场</b></div><div><span>声音</span><b>热血音乐 · 字幕卡点</b></div></div>
        <div className="result-actions"><button className="ghost" onClick={()=>{setStage("ready");setProgress(0)}}>继续对话调整</button><a className="download-video" href="/demo-media/final.mp4" download>↓ 导出视频</a></div>
      </div>}
      {assets.length>0&&<div className="storyline-strip"><div className="strip-title"><b>AI 推荐叙事顺序</b><span>根据画面内容与情绪曲线自动编排 · 总时长 15s</span></div><div className="story-thumbs">{assets.map((asset,index)=><button key={`story-${index}`} className={selected===index?"active":""} onClick={()=>setSelected(index)}><img src={asset.src} alt=""/><span>{index<1?"出发":index<5?"奔跑":index<7?"冲刺":"抵达"}</span><i>{Math.round(index*15/assets.length)}s</i></button>)}</div></div>}
    </section>
    <aside className="video-settings">
      <div className="panel-heading"><span>03</span><div><b>成片设置</b><small>由对话自动提取</small></div></div>
      {assets.length===0?<div className="settings-empty"><span>✦</span><b>等待创作需求</b><small>导入照片并在对话中描述视频后，这里会自动形成参数。</small></div>:<><label className="field-label">视频主题</label><div className="setting-card"><b>每一步，都算数</b><small>马拉松品牌形象宣传</small></div><label className="field-label">节奏风格</label><div className="setting-options"><button className="active">热血动感</button><button>城市大片</button><button>人文纪实</button></div><label className="field-label">智能处理</label>{["照片动态运镜","主体智能构图","节拍转场","标题与字幕","背景音乐匹配"].map(x=><div className="auto-setting" key={x}><span>{x}</span><i>✓</i></div>)}<div className="ai-insight"><span>✦</span><p><b>AI 素材洞察</b><small>这组照片人物情绪充足，建议以群像开场、人物特写推进，最后用冲线与欢呼完成情绪高潮。</small></p></div></>}
    </aside>
  </section>;
}

type PptStage="brief"|"outlining"|"outline"|"building"|"preview";
type PptMessage={role:"ai"|"user";text:string;card?:string};
const pptSlides=[
  ["封面","鹏飞集团杯·氢筑新程马拉松"],
  ["赛事价值","品牌影响力与社会价值同向增长"],
  ["鹏飞合作价值","一次冠名，带动五个品牌目标"],
  ["鹏飞合作价值","赛事流量驱动产业联动"],
  ["赛事体验","四条体验线，让理念被看见"],
  ["冠名权益","六大权益覆盖赛事全链路"],
  ["冠名权益","品牌覆盖跑者关键触点"],
  ["冠名权益","鹏飞成为核心发起者"],
  ["AI 文创展示","视觉资产覆盖传播全场景"],
  ["传播合作","赛前、赛中、赛后持续累积"],
  ["合作建议","三种合作方式灵活组合"],
  ["结语","以氢筑新程，以爱抵达远方"],
];

function PptDemo(){
  const [stage,setStage]=useState<PptStage>("brief");
  const [progress,setProgress]=useState(0);
  const [current,setCurrent]=useState(0);
  const [prompt,setPrompt]=useState("");
  const [compact,setCompact]=useState(false);
  const [presenting,setPresenting]=useState(false);
  const [messages,setMessages]=useState<PptMessage[]>([{role:"ai",text:"你好，我是汇报 PPT 助手。我已关联当前赛事方案，可以直接为鹏飞集团生成独家总冠名合作提案。"}]);
  const iframeRef=useRef<HTMLIFrameElement>(null);
  const deckRef=useRef<HTMLDivElement>(null);
  const visibleIndexes=compact?[0,1,2,4,5,8,10,11]:pptSlides.map((_,i)=>i);
  const busy=stage==="outlining"||stage==="building";
  useEffect(()=>{if(!presenting)return;const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape"){setPresenting(false);return}if(event.key==="ArrowRight"||event.key===" "||event.key==="PageDown"){event.preventDefault();scrollSlide(Math.min(11,current+1))}if(event.key==="ArrowLeft"||event.key==="PageUp"){event.preventDefault();scrollSlide(Math.max(0,current-1))}};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[presenting,current]);
  useEffect(()=>{const onFullscreen=()=>{if(!document.fullscreenElement)setPresenting(false)};document.addEventListener("fullscreenchange",onFullscreen);return()=>document.removeEventListener("fullscreenchange",onFullscreen)},[]);
  useEffect(()=>{if(!busy)return;const timer=window.setInterval(()=>setProgress(p=>Math.min(100,p+4)),90);return()=>window.clearInterval(timer)},[busy]);
  useEffect(()=>{if(progress<100)return;if(stage==="outlining"){setStage("outline");setMessages(m=>[...m,{role:"ai",text:"提纲已完成，共规划 12 页，重点覆盖赛事价值、鹏飞合作价值、冠名权益、AI 文创与合作建议。",card:"已生成 12 页大屏汇报提纲"}])}else if(stage==="building"){setStage("preview");setMessages(m=>[...m,{role:"ai",text:"PPT 已生成并完成大屏版式检查。你可以继续让我定位页面、精简结构或生成讲解建议。",card:"PPT 已生成 · 12 页"}]);}},[progress,stage]);
  function scrollSlide(index:number){setCurrent(index);window.setTimeout(()=>{const doc=iframeRef.current?.contentDocument;doc?.querySelectorAll<HTMLElement>(".slide")[index]?.scrollIntoView({behavior:"smooth",block:"start"})},30)}
  function beginOutline(){if(busy)return;setProgress(0);setStage("outlining");setMessages(m=>[...m,{role:"user",text:"根据当前赛事方案，生成面向鹏飞集团的独家总冠名合作提案。"},{role:"ai",text:"收到。我正在提取赛事立意、氢能品牌契合点、冠名权益和传播价值，并组织领导汇报逻辑。"}])}
  function buildDeck(){setProgress(0);setStage("building");setMessages(m=>[...m,{role:"user",text:"提纲没问题，开始生成 PPT。"},{role:"ai",text:"正在套用“氢筑新程”赛事官方模板，并逐页检查标题层级、内容密度和视觉一致性。"}])}
  function send(e:React.FormEvent){e.preventDefault();const value=prompt.trim();if(!value||busy)return;setPrompt("");setMessages(m=>[...m,{role:"user",text:value}]);if(stage==="brief"){beginOutline();return}if(stage==="outline"&&/生成|开始|确认|可以/.test(value)){buildDeck();return}if(/8页|精简|领导版|压缩/.test(value)){setCompact(true);setMessages(m=>[...m,{role:"ai",text:"已压缩为 8 页领导速览版，保留赛事价值、鹏飞合作价值、核心权益、AI 文创与合作建议。",card:"已切换 · 8 页领导版"}]);return}let target=-1;if(/品牌|鹏飞|氢能|契合/.test(value))target=2;else if(/传播|曝光|媒体/.test(value))target=9;else if(/文创|AI|海报|奖牌|参赛服/.test(value))target=8;else if(/权益|冠名/.test(value))target=5;else if(/公益|捐赠|价值/.test(value))target=1;else if(/下一页/.test(value))target=Math.min(current+1,11);else if(/上一页/.test(value))target=Math.max(current-1,0);else {const match=value.match(/第\s*(\d+)\s*页/);if(match)target=Math.max(0,Math.min(11,Number(match[1])-1))}if(target>=0){scrollSlide(target);setMessages(m=>[...m,{role:"ai",text:`已定位到第 ${target+1} 页「${pptSlides[target][1]}」。`,card:`当前页面 · ${String(target+1).padStart(2,"0")}` }]);return}if(/备注|演讲|怎么讲|讲解/.test(value)){setMessages(m=>[...m,{role:"ai",text:`这一页建议先讲结论：“${pptSlides[current][1]}”。随后用 30 秒说明它与鹏飞绿色使命及赛事公众价值的连接，最后落到可执行的合作动作。`,card:"当前页演讲建议 · 约 45 秒"}]);return}setMessages(m=>[...m,{role:"ai",text:"我已理解你的调整方向。演示版支持精简页数、定位品牌/传播/权益页面，以及生成当前页演讲备注。"}])}
  return <section className="ppt-workspace">
    <aside className="ppt-ai-rail"><div className="panel-heading"><span>01</span><div><b>AI 汇报助手</b><small>通过对话规划、生成与修改</small></div></div>
      <div className="ppt-source"><i>✓</i><div><b>赛事方案已关联</b><span>鹏飞集团杯·氢筑新程马拉松</span></div><em>已解析</em></div>
      <div className="ppt-chat">{messages.slice(-7).map((m,i)=><div className={`ppt-bubble ${m.role}`} key={`${m.text}-${i}`}>{m.role==="ai"&&<span>AI</span>}<div><p>{m.text}</p>{m.card&&<button onClick={()=>stage==="preview"&&scrollSlide(current)}><i>✦</i>{m.card}<b>→</b></button>}</div></div>)}{busy&&<div className="ppt-bubble ai"><span>AI</span><div><p className="ppt-thinking"><i/><i/><i/>正在生成，已完成 {progress}%</p></div></div>}</div>
      <div className="ppt-quick">{stage==="brief"?<button onClick={beginOutline}>生成总冠名合作提案</button>:stage==="outline"?<button onClick={buildDeck}>确认提纲并生成 PPT</button>:<><button onClick={()=>{setCompact(true);setMessages(m=>[...m,{role:"user",text:"压缩成 8 页领导版"},{role:"ai",text:"已压缩为 8 页领导速览版，保留赛事价值、鹏飞合作价值、核心权益、AI 文创与合作建议。",card:"已切换 · 8 页领导版"}])}}>8页领导版</button><button onClick={()=>{scrollSlide(2);setMessages(m=>[...m,{role:"user",text:"重点讲鹏飞合作价值"},{role:"ai",text:"已定位鹏飞合作价值章节，建议重点说明氢能主业、文旅酒店和企业责任的联动回报。",card:"已定位 · 鹏飞合作价值"}])}}>合作价值</button><button onClick={()=>setMessages(m=>[...m,{role:"user",text:"生成当前页演讲备注"},{role:"ai",text:`已为第 ${current+1} 页生成演讲备注：先讲核心结论，再说明品牌关联，最后落到执行动作。`,card:"当前页演讲建议 · 约 45 秒"}])}>演讲备注</button></>}</div>
      <form className="ppt-chat-input" onSubmit={send}><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={stage==="brief"?"例如：生成面向鹏飞集团的冠名提案……":"继续输入调整要求……"}/><div><span>AI 会控制当前汇报</span><button disabled={!prompt.trim()||busy}>↑</button></div></form>
    </aside>
    <main className="ppt-main"><div className="ppt-main-head"><div><span className="step">02</span><p><b>{stage==="preview"?"PPT 预览":"汇报结构规划"}</b><small>独家总冠名合作提案 · 正式简洁 · 绿色科技</small></p></div><span className={`stage-pill ${busy?"analyzing":stage}`}><i/>{stage==="brief"?"等待生成需求":stage==="outlining"?"AI 正在梳理汇报逻辑":stage==="outline"?"提纲已生成":stage==="building"?"AI 正在生成页面":"PPT 已生成"}</span></div>
      {stage==="brief"?<div className="ppt-empty"><span>✦</span><h2>从赛事方案到一套完整汇报</h2><p>在左侧直接告诉 AI 汇报对象与用途，AI 将先规划提纲，再生成视觉统一的演示文稿。</p><div><i>1</i>理解方案<b>→</b><i>2</i>生成提纲<b>→</b><i>3</i>输出 PPT</div></div>:busy?<div className="ppt-generating"><div className="ppt-orbit"><span>AI</span><i/><i/><i/></div><h2>{stage==="outlining"?"正在搭建有说服力的汇报结构":"正在逐页生成并检查演示文稿"}</h2><p>{stage==="outlining"?"赛事价值 → 鹏飞合作价值 → 冠名权益 → AI 文创 → 合作建议":"应用大屏模板 · 匹配内容层级 · 检查页面完整性"}</p><div><i><b style={{width:`${progress}%`}}/></i><span>{progress}%</span></div></div>:stage==="outline"?<div className="ppt-outline"><div className="outline-summary"><span>✦ AI 已完成结构规划</span><b>12 页 · 7 个章节 · 一页一个核心观点</b><button onClick={buildDeck}>确认提纲，生成 PPT →</button></div><div className="outline-list">{pptSlides.map((s,i)=><div key={i}><em>{String(i+1).padStart(2,"0")}</em><span><b>{s[1]}</b><small>{s[0]} · 已匹配大屏版式</small></span><i>⋮⋮</i></div>)}</div></div>:<div className={`ppt-deck ${presenting?"presenting":""}`} ref={deckRef}><aside className="ppt-thumbs"><div><b>{compact?"领导版":"完整版"}</b><span>{visibleIndexes.length} 页</span></div>{visibleIndexes.map(i=><button key={i} className={current===i?"active":""} onClick={()=>scrollSlide(i)}><em>{String(i+1).padStart(2,"0")}</em><span><b>{pptSlides[i][0]}</b><small>{pptSlides[i][1]}</small></span></button>)}</aside><section className="ppt-canvas"><div className="ppt-toolbar"><span><i/>大屏汇报 · 一页一个核心观点</span><div><button onClick={()=>scrollSlide(Math.max(0,current-1))}>←</button><b>{current+1} / 12</b><button onClick={()=>scrollSlide(Math.min(11,current+1))}>→</button><button onClick={async()=>{setPresenting(x=>!x);if(!presenting)await deckRef.current?.requestFullscreen?.()}}>{presenting?"退出演示":"汇报演示"}</button></div></div><div className="ppt-frame"><iframe ref={iframeRef} src="/ppt-slides/Preview.html" title="PPT 页面预览" onLoad={()=>scrollSlide(current)}/></div><div className="ppt-caption"><div><b>{pptSlides[current][1]}</b><span>{pptSlides[current][0]} · 当前页面</span></div><div><button onClick={()=>setMessages(m=>[...m,{role:"ai",text:`已为第 ${current+1} 页生成演讲备注：先讲核心结论，再说明品牌关联，最后落到执行动作。`,card:"演讲备注已生成"}])}>✦ 生成本页讲稿</button><a href="/downloads/鹏飞集团杯·氢筑新程马拉松·独家总冠名合作提案.pptx" download>↓ 导出大屏版 PPT</a></div></div></section></div>}
    </main>
    <aside className="ppt-info"><div className="panel-heading"><span>03</span><div><b>汇报设置</b><small>由对话自动提取</small></div></div>{[["汇报类型","独家总冠名合作提案"],["汇报对象","鹏飞集团决策层"],["内容页数",compact?"8 页领导版":"12 页大屏版"],["视觉风格","正式 · 简洁 · 绿色科技"],["展示适配","16:9 · 1920×1080"]].map(x=><div className="ppt-setting" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></div>)}<div className="ppt-insight"><span>✦</span><div><b>AI 汇报策略</b><p>先建立赛事公共价值，再证明鹏飞品牌与绿色赛事的天然契合，最终用权益和传播方案推动合作决策。</p></div></div><div className="ppt-files"><b>本次使用资料</b><span>✓ 赛事策划方案</span><span>✓ 品牌合作要点</span><span>✓ AI 文创视觉资产</span></div></aside>
  </section>
}
