"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Message = { role: "bot" | "user"; text: string; source?: string; low?: boolean };

const quick = ["报名条件是什么？", "什么时候领取参赛物资？", "可以退赛或转让名额吗？", "外地选手怎么到起点？"];

const knowledge = [
  { keys: ["报名", "条件", "资格", "年龄"], answer: "全程马拉松参赛者须在比赛当年满 20 周岁，并在规定时间内完成报名与缴费。报名人数超过限额时将采用抽签方式确定资格。具体年龄、健康及成绩要求，请以本届正式竞赛规程为准。", source: "《太原马拉松报名须知（Demo）》第 2 条" },
  { keys: ["物资", "领物", "号码布", "参赛包"], answer: "参赛物资预计在赛前 2—3 天集中发放。请本人携带有效身份证件和领物二维码前往指定地点领取，原则上不接受代领。具体时间与地点将在赛前通知中公布。", source: "《参赛物资领取须知（Demo）》" },
  { keys: ["退赛", "转让", "名额", "退款"], answer: "参赛名额不得私下转让。开放退出申请期间，可在报名平台提交退赛；退款比例和截止时间以本届退赛规则为准。超过截止时间通常不再受理。", source: "《报名及退赛规则（Demo）》第 5 条" },
  { keys: ["交通", "起点", "地铁", "怎么到"], answer: "比赛日建议优先乘坐公共交通。组委会通常会公布地铁提前运营、接驳车及道路管制方案。起点周边不建议自驾，请在赛前交通指南发布后再次确认线路。", source: "《比赛日交通指南（Demo）》" },
  { keys: ["抽签", "中签", "结果"], answer: "若报名人数超过项目限额，将进行抽签。抽签结果会通过报名平台及短信通知，请留意官方发布；未中签人员的报名费将按规则原路退回。", source: "《太原马拉松报名须知（Demo）》第 4 条" },
  { keys: ["健康", "体检", "疾病"], answer: "马拉松是高负荷运动。有心血管疾病、近期身体不适或医生认为不宜参加长距离运动者，不建议参赛。如对自身情况不确定，请先咨询专业医生。", source: "《参赛者健康要求（Demo）》" },
];

function reply(input: string) {
  const normalized = input.toLowerCase();
  const ranked = knowledge.map((item) => ({ item, score: item.keys.filter((key) => normalized.includes(key)).length })).sort((a, b) => b.score - a.score);
  if (ranked[0].score > 0) return { text: ranked[0].item.answer, source: ranked[0].item.source };
  if (/hello|hi|english/.test(normalized)) return { text: "Hello! I can help with registration, bib collection, withdrawal and race-day transport. This demo uses sample information; please refer to the official race rules for final details.", source: "Demo multilingual response" };
  return { text: "这个问题目前没有匹配到可靠的赛事依据。为避免给你错误信息，我已建议转人工客服处理。你也可以换一种说法，或询问报名、抽签、领物、退赛和交通问题。", low: true };
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([{ role: "bot", text: "你好，我是太马报名助手 👋\n可以咨询报名资格、抽签、领物、退赛和比赛日交通。", source: "赛事知识库 · Demo" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const latestReplyRef = useRef<HTMLDivElement>(null);
  const stats = useMemo(() => ({ answered: messages.filter(m => m.role === "bot" && !m.low).length, transferred: messages.filter(m => m.low).length }), [messages]);

  useEffect(() => {
    if (messages.at(-1)?.role !== "bot") return;
    latestReplyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [messages]);

  function ask(text: string) {
    if (!text.trim() || typing) return;
    setMessages((m) => [...m, { role: "user", text: text.trim() }]);
    setInput(""); setTyping(true);
    setTimeout(() => { setMessages((m) => [...m, { role: "bot", ...reply(text) }]); setTyping(false); }, 550);
  }
  function submit(e: FormEvent) { e.preventDefault(); ask(input); }

  return <main className="shell">
    <section className="brand-panel">
      <div><div className="eyebrow">TAIYUAN MARATHON</div><h1>每一次出发<br/>都有答案</h1><p>报名期智能客服 Demo</p></div>
      <div className="rings"><i/><i/><i/></div>
      <div className="features"><span>7×24 小时</span><span>赛事知识库</span><span>中英双语</span></div>
    </section>
    <section className="chat-panel">
      <header><div className="avatar">太</div><div><strong>太马报名助手</strong><small><b/> 在线 · 通常秒级回复</small></div><button aria-label="更多">•••</button></header>
      <div className="notice">演示信息不代表最终赛事规程，请以官方发布为准</div>
      <div className="messages">
        {messages.map((m, i) => <div key={i} ref={i === messages.length - 1 && m.role === "bot" ? latestReplyRef : undefined} className={`message ${m.role}`}><div className="bubble">{m.text.split("\n").map((x,j)=><span key={j}>{x}</span>)}{m.source && <em>{m.low ? "⚠ 建议转人工" : "⌁ " + m.source}</em>}</div></div>)}
        {typing && <div className="message bot"><div className="bubble dots"><i/><i/><i/></div></div>}
      </div>
      <div className="quick">{quick.map(q=><button key={q} onClick={()=>ask(q)}>{q}</button>)}</div>
      <form onSubmit={submit}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="输入你的问题…" aria-label="问题"/><button disabled={!input.trim() || typing}>发送</button></form>
      <footer><span>本次会话：已回答 {stats.answered} · 转人工 {stats.transferred}</span><span>AI 生成内容仅供参考</span></footer>
    </section>
  </main>;
}
