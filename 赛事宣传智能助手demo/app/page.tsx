"use client";

import { useEffect, useMemo, useState } from "react";

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
 let draft=item.body[tone]; for(const b of blocks){if(draft.length>=minimum+80)break;draft+=`\n\n${b}`;} return draft;
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
    { ok: Boolean(eventInfo.date.trim()), label: "时间信息", text: eventInfo.date || "请填写赛事日期" },
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
        <button className={productModule === "video" ? "active" : ""} onClick={() => setProductModule("video")}><span>影</span>宣传视频方案<em>规划中</em></button>
        <button className={productModule === "ppt" ? "active" : ""} onClick={() => setProductModule("ppt")}><span>报</span>汇报 PPT<em>规划中</em></button>
        <button className={productModule === "creative" ? "active" : ""} onClick={() => setProductModule("creative")}><span>创</span>文创产品设计<em>规划中</em></button>
      </nav>
    </header>

    {productModule === "video" ? <VideoDemo eventInfo={eventInfo} /> : productModule !== "copy" ? <ModulePreview module={productModule} onBack={() => setProductModule("copy")} /> : <section className="workspace">
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

const modulePlans: Record<Exclude<ProductModule,"copy">,{eyebrow:string;title:string;description:string;steps:string[];output:string}> = {
  video:{eyebrow:"宣传视频方案 · 下一阶段",title:"从赛事资料到成片脚本的一站式工作台",description:"先完成脚本、分镜与素材编排，再逐步接入数字人口播和智能成片，最适合成为文案模块之后的第二个演示能力。",steps:["AI 视频脚本与时长控制","镜头分镜、字幕及口播稿","素材清单与成片版本管理"],output:"建议首版：生成 30 秒宣传片脚本 + 6 镜头分镜"},
  creative:{eyebrow:"文创产品设计 · 能力规划",title:"让赛事视觉资产快速形成系列",description:"围绕赛事主视觉延展奖牌、服装、号码布和纪念品概念，重点解决设计方向发散与方案汇报。",steps:["输入赛事主题与文化元素","生成设计方向及视觉关键词","输出文创效果图与设计说明"],output:"建议首版：奖牌与参赛服概念提案"},
  ppt:{eyebrow:"汇报 PPT · 能力规划",title:"把赛事进展自动整理成可汇报材料",description:"读取策划案、传播数据与阶段成果，自动生成结构清晰、口径统一的领导汇报演示。",steps:["上传赛事方案与传播数据","生成汇报大纲和核心结论","套用模板并输出可编辑 PPT"],output:"建议首版：赛前宣传方案汇报（10—12 页）"}
};

function ModulePreview({module,onBack}:{module:Exclude<ProductModule,"copy">;onBack:()=>void}) {
  const plan=modulePlans[module];
  return <section className={`module-preview ${module}`}><div className="module-preview-card"><div className="module-preview-copy"><span className="module-eyebrow">{plan.eyebrow}</span><h1>{plan.title}</h1><p>{plan.description}</p><div className="module-steps">{plan.steps.map((step,index)=><div key={step}><b>0{index+1}</b><span>{step}</span></div>)}</div><button onClick={onBack}>返回宣传文案 Demo</button></div><div className="module-blueprint"><span>首版演示建议</span><strong>{plan.output}</strong><div className="blueprint-lines"><i/><i/><i/></div><small>沿用同一套赛事资料与品牌口径，四个模块之间可共享内容资产</small></div></div></section>;
}

type VideoGoal = "signup" | "brand" | "guide";
type VideoMood = "cinematic" | "energetic" | "humanistic";

const videoGoals: Record<VideoGoal,{label:string;hint:string;opening:string;ending:string}> = {
  signup:{label:"报名招募",hint:"强化赛事吸引力与报名行动",opening:"城市尚未醒来，奔跑的心已经出发",ending:"报名通道现已开启，和我们一起上场"},
  brand:{label:"品牌形象",hint:"呈现赛事气质与城市名片",opening:"一条赛道，连接一座城市的过去与未来",ending:"以奔跑之名，看见城市向新的力量"},
  guide:{label:"赛前指南",hint:"清晰传递领物与参赛信息",opening:"距离鸣枪还有最后一步准备",ending:"收藏指南，从容赴约，赛道见"},
};

const videoMoods: Record<VideoMood,{label:string;music:string;color:string}> = {
  cinematic:{label:"城市大片",music:"管弦氛围渐进 + 鼓点",color:"墨绿 / 金色 / 晨光"},
  energetic:{label:"热血动感",music:"电子节拍 128 BPM",color:"高饱和红 / 黑 / 白"},
  humanistic:{label:"人文纪实",music:"钢琴铺底 + 环境声",color:"暖灰 / 胶片绿 / 米白"},
};

const baseShots = [
  {scene:"航拍城市晨曦，赛道线条由远及近",camera:"航拍缓慢推进",purpose:"建立城市与赛事氛围"},
  {scene:"跑者系紧鞋带、佩戴号码布的特写",camera:"三组快速特写",purpose:"人物进入出发状态"},
  {scene:"起跑拱门前人群集结，倒计时闪现",camera:"稳定器穿行",purpose:"把情绪推向起跑时刻"},
  {scene:"跑者穿过城市地标与汾河沿岸",camera:"跟拍与横移切换",purpose:"展示赛道和城市名片"},
  {scene:"志愿者击掌、观众加油、跑者微笑",camera:"中近景慢动作",purpose:"补充温度与参与感"},
  {scene:"冲线瞬间定格，活动主题字落版",camera:"升格后快速拉远",purpose:"形成记忆点并承接行动"},
  {scene:"奖牌、参赛服与补给物资平铺",camera:"俯拍环绕",purpose:"展示赛事服务细节"},
  {scene:"夜色中的城市灯光与跑者剪影",camera:"延时摄影转剪影",purpose:"延长品牌余韵"},
];

function VideoDemo({eventInfo}:{eventInfo:EventInfo}) {
  const [goal,setGoal]=useState<VideoGoal>("signup");
  const [mood,setMood]=useState<VideoMood>("cinematic");
  const [duration,setDuration]=useState<15|30|60>(30);
  const [generated,setGenerated]=useState(true);
  const [copied,setCopied]=useState(false);
  const [playing,setPlaying]=useState(false);
  const [currentTime,setCurrentTime]=useState(0);
  const [videoFormat,setVideoFormat]=useState<"landscape"|"portrait">("landscape");
  const eventName=eventInfo.title || "2026太原马拉松";
  const shotCount=duration===15?4:duration===30?6:8;
  const shots=baseShots.slice(0,shotCount);
  const beat=duration/shotCount;
  const activeShot=Math.min(shots.length-1,Math.floor(currentTime/beat));
  const voiceover=`${videoGoals[goal].opening}。${eventName}，让每一步都成为城市向前的力量。穿过熟悉的街道，遇见并肩向前的人，也遇见更好的自己。${videoGoals[goal].ending}。`;
  useEffect(()=>{setCurrentTime(0);setPlaying(false);},[duration,goal,mood]);
  useEffect(()=>{if(!playing)return;const timer=window.setInterval(()=>setCurrentTime(t=>{if(t>=duration-.1){setPlaying(false);return 0;}return Math.min(duration,t+.1);}),100);return()=>window.clearInterval(timer);},[playing,duration]);
  function regenerate(){setGenerated(false);setPlaying(false);setCurrentTime(0);window.setTimeout(()=>setGenerated(true),500);}
  async function copyPlan(){await navigator.clipboard.writeText(`${eventName}｜${duration}秒${videoGoals[goal].label}视频方案\n\n口播：${voiceover}\n\n${shots.map((s,i)=>`${i+1}. ${s.scene}｜${s.camera}｜${s.purpose}`).join("\n")}`);setCopied(true);window.setTimeout(()=>setCopied(false),1600);}
  return <section className="video-workspace">
    <aside className="video-brief">
      <div className="panel-heading"><span>01</span><div><b>设置视频需求</b><small>沿用当前活动项目资料</small></div></div>
      <div className="shared-project"><span>当前活动项目</span><b>{eventName}</b><small>{eventInfo.date || "2026年9月20日"} · {eventInfo.scale || "40,000人"}</small></div>
      <label className="field-label">传播目标</label>
      <div className="video-option-list">{(Object.keys(videoGoals) as VideoGoal[]).map(key=><button key={key} className={goal===key?"active":""} onClick={()=>setGoal(key)}><b>{videoGoals[key].label}</b><small>{videoGoals[key].hint}</small></button>)}</div>
      <label className="field-label">视频时长</label>
      <div className="duration-options">{([15,30,60] as const).map(value=><button key={value} className={duration===value?"active":""} onClick={()=>setDuration(value)}>{value}<small>秒</small></button>)}</div>
      <label className="field-label">视觉风格</label>
      <div className="mood-options">{(Object.keys(videoMoods) as VideoMood[]).map(key=><button key={key} className={mood===key?"active":""} onClick={()=>setMood(key)}>{videoMoods[key].label}</button>)}</div>
      <button className="generate video-generate" onClick={regenerate}><span>✦</span>{generated?"AI 生成视频方案":"正在生成方案…"}</button>
      <p className="safe-note">方案可继续交给拍摄团队或智能成片工具</p>
    </aside>

    <section className="video-result">
      <div className="video-result-head"><div><span className="step">02</span><p><b>宣传视频方案</b><small>{duration} 秒 · {shotCount} 个镜头 · AI 已生成</small></p></div><div><span className="save-status"><i/>方案已自动保存</span><button className="ghost" onClick={copyPlan}>{copied?"✓ 已复制":"复制方案"}</button></div></div>
      <div className={generated?"video-plan-card":"video-plan-card loading"}>
        <div className="video-preview-shell">
          <div className="video-preview-toolbar"><div><b>成片效果预览</b><span>画面根据分镜方案动态演示</span></div><div><button className={videoFormat==="landscape"?"active":""} onClick={()=>setVideoFormat("landscape")}>16:9 横版</button><button className={videoFormat==="portrait"?"active":""} onClick={()=>setVideoFormat("portrait")}>9:16 竖版</button></div></div>
          <div className={`demo-player ${videoFormat} mood-${mood}`}>
            <div className={`demo-frame scene-${activeShot%6}`}>
              <div className="city-silhouette"><i/><i/><i/><i/><i/></div>
              <div className="runner-figure"><i/><b/><span/></div>
              <div className="motion-lines"><i/><i/><i/></div>
              <div className="player-brand"><span>AI VIDEO PLAN</span><em>{eventName}</em></div>
              <div className="scene-label"><small>镜头 {String(activeShot+1).padStart(2,"0")} · {shots[activeShot].camera}</small><strong>{shots[activeShot].scene}</strong></div>
              <div className="player-caption">{activeShot===0?videoGoals[goal].opening:activeShot===shots.length-1?videoGoals[goal].ending:"穿过城市的脉络，奔向共同的目标"}</div>
              <button className="play-toggle" aria-label={playing?"暂停预览":"播放预览"} onClick={()=>setPlaying(x=>!x)}>{playing?"Ⅱ":"▶"}</button>
            </div>
            <div className="player-controls"><button onClick={()=>setPlaying(x=>!x)}>{playing?"Ⅱ":"▶"}</button><span>{currentTime.toFixed(1)}s</span><input aria-label="视频进度" type="range" min="0" max={duration} step="0.1" value={currentTime} onChange={e=>{setCurrentTime(Number(e.target.value));setPlaying(false)}}/><span>{duration}s</span><button aria-label="声音">♫</button></div>
          </div>
          <div className="shot-strip">{shots.map((shot,i)=><button key={shot.scene} className={activeShot===i?"active":""} onClick={()=>{setCurrentTime(i*beat);setPlaying(false)}}><span>{String(i+1).padStart(2,"0")}</span><i>{Math.round(i*beat)}—{Math.round((i+1)*beat)}s</i></button>)}</div>
        </div>
        <div className="plan-summary"><div><span>创意主线</span><b>从城市苏醒，到万人共同出发</b></div><div><span>音乐建议</span><b>{videoMoods[mood].music}</b></div><div><span>视觉色调</span><b>{videoMoods[mood].color}</b></div></div>
        <div className="script-block"><div className="section-title"><b>口播与字幕文案</b><span>约 {voiceover.length} 字</span></div><p>{voiceover}</p></div>
        <div className="storyboard"><div className="section-title"><b>分镜脚本</b><span>时间轴自动适配 {duration} 秒</span></div>{shots.map((shot,i)=><div className="shot-row" key={shot.scene}><div className="shot-index"><b>{String(i+1).padStart(2,"0")}</b><span>{Math.round(i*beat)}—{Math.round((i+1)*beat)}s</span></div><div className="shot-thumb"><i/><span>{i%2===0?"CITY":"RUN"}</span></div><div className="shot-content"><b>{shot.scene}</b><span>{shot.camera}</span></div><small>{shot.purpose}</small></div>)}</div>
      </div>
    </section>

    <aside className="video-assets">
      <div className="panel-heading"><span>03</span><div><b>制作辅助</b><small>素材、声音与交付检查</small></div></div>
      <div className="asset-progress"><span><b>方案完整度</b><em>92%</em></span><i><b/></i></div>
      <h3>建议素材清单</h3>
      {["城市航拍与地标空镜","跑者训练及装备特写","起跑、赛道与冲线画面","志愿服务和观众互动","赛事 LOGO 与报名二维码"].map((x,i)=><label className="asset-item" key={x}><input type="checkbox" defaultChecked={i<3}/><span><b>{x}</b><small>{i<3?"素材库已匹配":"建议补充上传"}</small></span></label>)}
      <div className="divider"/>
      <h3>声音设计</h3>
      <div className="sound-card"><span>♫</span><p><b>{videoMoods[mood].music}</b><small>建议在第 {Math.round(duration*.6)} 秒进入情绪高潮</small></p></div>
      <div className="delivery-note"><span>✦</span><p><b>下一步：智能成片</b><small>接入赛事素材库后，可自动匹配画面、配音、字幕并输出横竖版视频。</small></p></div>
    </aside>
  </section>;
}
