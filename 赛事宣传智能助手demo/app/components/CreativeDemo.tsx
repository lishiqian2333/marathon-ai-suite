"use client";

import { useEffect, useState } from "react";
import { creativeDirections, creativeProducts, mockCreativeDesigns, type CreativeBrief, type CreativeDesign, type CreativeProduct } from "../../lib/creative-assets";

type CreativeStage = "brief" | "analyzing" | "directions" | "done";

export default function CreativeDemo(){
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
