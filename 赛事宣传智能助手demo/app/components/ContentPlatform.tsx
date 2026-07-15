"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { currentCase } from "../../lib/current-case";

const CreativeDemo = dynamic(() => import("./CreativeDemo"), { loading: () => <ModuleLoading label="文创产品设计" /> });
const LazyVideoDemo = dynamic(() => import("./VideoDemo"), { loading: () => <ModuleLoading label="照片生成视频" /> });
const LazyPptDemo = dynamic(() => import("./PptDemo"), { loading: () => <ModuleLoading label="汇报 PPT" /> });

function ModuleLoading({label}:{label:string}) {
  return <section className="module-loading" aria-live="polite"><span>✦</span><p>正在加载{label}…</p></section>;
}

type Scene = "signup" | "route" | "guide";
type Tone = "official" | "passion" | "culture" | "young";
type SideTab = "titles" | "check" | "channels";
type LengthRange = "500-800" | "800-1200" | "1200-1600";
type ProductModule = "copy" | "video" | "creative" | "ppt";
type EventInfo = { title:string; subtitle:string; date:string; scale:string; focus:string };
const lengthRanges: Record<LengthRange,string> = {"500-800":"精简（500—800字）","800-1200":"标准（800—1200字）","1200-1600":"深度（1200—1600字）"};

const caseEventName = currentCase.facts.event.fullName.value ?? "待命名马拉松赛事";
const copywriting = currentCase.modules.copywriting;
const scenes = copywriting.scenes;
const tones = copywriting.tones;
const content = {
  signup: {...copywriting.scenes.signup, title:caseEventName, date:""},
  route: {...copywriting.scenes.route, title:caseEventName, date:""},
  guide: {...copywriting.scenes.guide, title:caseEventName, date:""},
};

function Icon({ children }: { children: React.ReactNode }) { return <span className="icon">{children}</span>; }
function defaultEventInfo(scene:Scene):EventInfo { const x=content[scene]; return {title:x.title,subtitle:x.subtitle,date:x.date,scale:"",focus:x.focus}; }
function hasKnownValue(value:string) { const normalized=value.trim(); return Boolean(normalized) && normalized!=="待补充"; }
function applyConfirmedFacts(draft:string,info:EventInfo) {
 const cleaned=draft.trim();
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

export default function ContentPlatform() {
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

    {productModule === "video" ? <LazyVideoDemo eventInfo={eventInfo} /> : productModule === "ppt" ? <LazyPptDemo /> : productModule === "creative" ? <CreativeDemo /> : <section className="workspace">
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
        <p className="safe-note">日期、规模尚未提供；AI起草内容需在正式发布前审核</p>
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
          <div className="quick-commands">{hasBrief ? <><button onClick={()=>setCommand("更正式一点")}>更正式</button><button onClick={()=>setCommand("精简到500字")}>精简</button><button onClick={()=>setCommand("突出城市文化")}>突出文化</button></> : <><button onClick={()=>setCommand(`为${caseEventName}创建赛事官宣推文`)}>赛事官宣</button><button onClick={()=>setCommand("创建赛道发布宣传稿，突出城市文化")}>赛道发布</button><button onClick={()=>setCommand("创建领物通知，风格正式清晰")}>领物通知</button></>}</div>
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
        {tab === "check" && <div className="tab-content"><div className="score"><strong>{checks.filter(x => x.ok).length}/4</strong><span>关键信息检查通过</span></div>{checks.map((x) => <div className="check-card" key={x.label}><i className={x.ok ? "ok" : "warn"}>{x.ok ? "✓" : "!"}</i><span><b>{x.label}</b><small>{x.text}</small></span></div>)}<div className="source"><b>本稿使用资料</b><span>《{currentCase.sources[0].title}》</span><span>{currentCase.presentation.disclaimer}</span></div></div>}
        {tab === "channels" && <div className="tab-content"><div className="channel-head"><b>朋友圈文案</b><button onClick={() => copy(item.moments.join("\n\n"), "朋友圈已复制")}>复制全部</button></div>{item.moments.map((m,i) => <div className="moment" key={m}><span>版本 {i+1}</span><p>{m}</p><button onClick={() => copy(m, `版本${i+1}已复制`)}>复制</button></div>)}<div className="channel-head video-head"><b>30秒视频口播</b><button onClick={() => copy(item.video, "口播已复制")}>复制</button></div><div className="video-copy">{item.video}</div></div>}
        <div className="assist-footer"><span>✦</span><p><b>正式版可接入赛事知识库</b><small>根据规程、往届文章与宣传口径实时生成</small></p></div>
      </aside>
    </section>}
  </main>;
}
