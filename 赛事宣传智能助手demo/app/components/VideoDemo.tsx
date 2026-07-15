"use client";

import { useEffect, useState } from "react";
import { currentCase } from "../../lib/current-case";

export type EventInfo = { title:string; subtitle:string; date:string; scale:string; focus:string };
type VideoStage = "empty" | "ready" | "analyzing" | "editing" | "done";
type VideoAsset = { src:string; name:string; label:string; note:string; orientation:"横图"|"竖图" };

const videoCase=currentCase.modules.video;
const demoAssets:VideoAsset[]=videoCase.assets;

export default function VideoDemo({eventInfo}:{eventInfo:EventInfo}) {
  const [stage,setStage]=useState<VideoStage>("empty");
  const [progress,setProgress]=useState(0);
  const [selected,setSelected]=useState(0);
  const [assets,setAssets]=useState<VideoAsset[]>([]);
  const [format,setFormat]=useState<"landscape"|"portrait">("landscape");
  const [prompt,setPrompt]=useState("");
  const [messages,setMessages]=useState<Array<{role:"ai"|"user";text:string}>>([{role:"ai",text:"你好，我是视频创作助手。请先导入赛事照片，再告诉我想做一条什么样的宣传视频。"}]);
  const eventName=eventInfo.title || currentCase.facts.event.fullName.value || "待命名马拉松赛事";
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
      <div className="creation-head"><div><span className="step">02</span><p><b>AI 照片成片</b><small>{stage==="empty"?"新建视频任务":`${eventName} · ${videoCase.duration} 秒横版宣传片`}</small></p></div><span className={`stage-pill ${stage}`}><i/>{statusText}</span></div>
      {stage==="empty"?<div className="video-empty-state"><span>＋</span><h2>从照片开始创作视频</h2><p>在左侧对话框导入赛事照片，AI 会理解画面内容并与你确认成片要求。</p><div><i>1</i>导入照片<b>→</b><i>2</i>对话描述<b>→</b><i>3</i>生成视频</div></div>:stage!=="done"?<div className="photo-analysis-card">
        <div className="analysis-visual"><img src={assets[selected].src} alt="当前分析素材"/><div className="scan-line"/><div className="detect-tag top">人物主体 · 96%</div><div className="detect-tag bottom">赛事场景 · 98%</div><div className="analysis-caption"><small>AI VISION / {String(selected+1).padStart(2,"0")}</small><strong>{assets[selected].label}</strong><span>{assets[selected].note}</span></div></div>
        <div className="analysis-panel"><span className="ai-kicker">✦ AI 素材理解</span><h2>{stage==="ready"?"照片已导入，等待你的创作指令":"正在把静态照片变成有节奏的故事"}</h2><p>{stage==="ready"?"继续在左侧对话中描述时长、风格、字幕等要求。AI 会根据对话控制视频生成。":"已识别起跑、城市赛道、跑者特写与冲线等关键场景，正在按“出发—坚持—抵达”的叙事结构完成剪辑。"}</p>
          <div className="analysis-facts"><div><b>{assets.length}</b><span>张有效照片</span></div><div><b>{videoCase.duration}s</b><span>目标时长</span></div><div><b>{videoCase.landscapeRatio}</b><span>输出画幅</span></div></div>
          {stage==="ready"?<div className="waiting-command"><span>←</span><p><b>等待你的生成指令</b><small>请在左侧对话框继续描述，或点击“确认并生成视频”</small></p></div>:<div className="generation-progress"><div><span>{statusText}</span><b>{progress}%</b></div><i><b style={{width:`${progress}%`}}/></i></div>}
        </div>
      </div>:<div className="final-video-card">
        <div className="video-topline"><div><span className="success-check">✓</span><p><b>《{videoCase.title}》</b><small>{videoCase.duration} 秒 · 高清 · 已完成智能运镜与节奏剪辑</small></p></div><div className="format-switch"><button className={format==="landscape"?"active":""} onClick={()=>setFormat("landscape")}>{videoCase.landscapeRatio} 横版</button><button className={format==="portrait"?"active":""} onClick={()=>setFormat("portrait")}>{videoCase.portraitRatio} 竖版</button></div></div>
        <div className={`real-video ${format}`}><video controls playsInline preload="metadata" poster={videoCase.poster}><source src={videoCase.finalVideo} type="video/mp4"/>你的浏览器暂不支持视频播放。</video></div>
        <div className="result-meta"><div><span>智能选片</span><b>{assets.length} / {assets.length} 张已使用</b></div><div><span>故事结构</span><b>出发 · 坚持 · 抵达</b></div><div><span>视觉处理</span><b>动态推拉 · 节拍转场</b></div><div><span>声音</span><b>热血音乐 · 字幕卡点</b></div></div>
        <div className="result-actions"><button className="ghost" onClick={()=>{setStage("ready");setProgress(0)}}>继续对话调整</button><a className="download-video" href={videoCase.finalVideo} download>↓ 导出视频</a></div>
      </div>}
      {assets.length>0&&<div className="storyline-strip"><div className="strip-title"><b>AI 推荐叙事顺序</b><span>根据画面内容与情绪曲线自动编排 · 总时长 15s</span></div><div className="story-thumbs">{assets.map((asset,index)=><button key={`story-${index}`} className={selected===index?"active":""} onClick={()=>setSelected(index)}><img src={asset.src} alt=""/><span>{index<1?"出发":index<5?"奔跑":index<7?"冲刺":"抵达"}</span><i>{Math.round(index*15/assets.length)}s</i></button>)}</div></div>}
    </section>
    <aside className="video-settings">
      <div className="panel-heading"><span>03</span><div><b>成片设置</b><small>由对话自动提取</small></div></div>
      {assets.length===0?<div className="settings-empty"><span>✦</span><b>等待创作需求</b><small>导入照片并在对话中描述视频后，这里会自动形成参数。</small></div>:<><label className="field-label">视频主题</label><div className="setting-card"><b>{videoCase.title}</b><small>马拉松品牌形象宣传</small></div><label className="field-label">节奏风格</label><div className="setting-options"><button className="active">热血动感</button><button>城市大片</button><button>人文纪实</button></div><label className="field-label">智能处理</label>{["照片动态运镜","主体智能构图","节拍转场","标题与字幕","背景音乐匹配"].map(x=><div className="auto-setting" key={x}><span>{x}</span><i>✓</i></div>)}<div className="ai-insight"><span>✦</span><p><b>AI 素材洞察</b><small>{videoCase.insight}</small></p></div></>}
    </aside>
  </section>;
}
