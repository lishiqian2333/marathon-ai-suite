import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/lxn/Public/code/marathon-ai-suite";
const OUT = path.join(ROOT, "outputs");
const PPTX = path.join(OUT, "鹏飞集团杯·氢筑新程马拉松·独家总冠名合作提案·大屏优化版.pptx");
const PREVIEW = process.env.PREVIEW_DIR || path.join(OUT, "pengfei-bigscreen-preview");

const W = 1280;
const H = 720;
const SAFE = 72;
const C = {
  ink: "#10231F",
  green: "#0B7358",
  mint: "#9DDEC9",
  lime: "#D9F35A",
  cream: "#F3F0E7",
  white: "#FFFFFF",
  gray: "#5E6D68",
  light: "#DCE5E1",
  orange: "#FF9B54",
};
const FONT = "Microsoft YaHei";

const assets = {
  start: path.join(ROOT, "赛事宣传智能助手demo/public/demo-media/01-start.jpg"),
  city: path.join(ROOT, "赛事宣传智能助手demo/public/demo-media/02-city.jpg"),
  pack: path.join(ROOT, "赛事宣传智能助手demo/public/demo-media/03-pack.jpg"),
  pacer: path.join(ROOT, "赛事宣传智能助手demo/public/demo-media/04-pacer.jpg"),
  runner: path.join(ROOT, "赛事宣传智能助手demo/public/demo-media/05-runner.jpg"),
  smile: path.join(ROOT, "赛事宣传智能助手demo/public/demo-media/06-smile.jpg"),
  finish: path.join(ROOT, "赛事宣传智能助手demo/public/demo-media/07-finish.jpg"),
  celebrate: path.join(ROOT, "赛事宣传智能助手demo/public/demo-media/08-celebrate.jpg"),
  poster: path.join(ROOT, "赛事宣传智能助手demo/public/creative-assets/poster/campaign_overview.png"),
  mascot: path.join(ROOT, "赛事宣传智能助手demo/public/creative-assets/mascot/qing_runner.png"),
  medal: path.join(ROOT, "赛事宣传智能助手demo/public/creative-assets/award/hydrogen_future.png"),
  shirt: path.join(ROOT, "赛事宣传智能助手demo/public/creative-assets/tshirt/tshirt01.png"),
};

async function imgBytes(file) {
  const b = await fs.readFile(file);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

function rect(slide, x, y, w, h, fill, radius = false, line = "none") {
  return slide.shapes.add({
    geometry: radius ? "roundRect" : "rect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: line, width: line === "none" ? 0 : 1 },
    ...(radius ? { borderRadius: "rounded-xl" } : {}),
  });
}

function text(slide, value, x, y, w, h, size, color = C.ink, bold = false, opts = {}) {
  if (size < 20) throw new Error(`Big-screen text must be >=20px: ${value} (${size}px)`);
  const box = slide.shapes.add({
    geometry: "textbox",
    name: opts.name,
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  box.text = value;
  box.text.style = {
    fontFamily: FONT,
    fontSize: size,
    color,
    bold,
    alignment: opts.align || "left",
    verticalAlignment: opts.valign || "middle",
  };
  return box;
}

async function image(slide, file, x, y, w, h, fit = "cover", radius = false) {
  return slide.images.add({
    blob: await imgBytes(file),
    contentType: file.endsWith(".png") ? "image/png" : "image/jpeg",
    alt: path.basename(file),
    fit,
    position: { left: x, top: y, width: w, height: h },
    geometry: radius ? "roundRect" : "rect",
    ...(radius ? { borderRadius: "rounded-xl" } : {}),
  });
}

function header(slide, section, title, page, dark = false) {
  const main = dark ? C.white : C.ink;
  const muted = dark ? C.mint : C.green;
  text(slide, section, SAFE, 28, 520, 30, 22, muted, true);
  text(slide, title, SAFE, 66, 1120, 82, 50, main, true);
  text(slide, String(page).padStart(2, "0"), 1150, 28, 58, 30, 22, muted, true, { align: "right" });
}

function footer(slide, dark = false) {
  text(slide, "鹏飞集团杯 · 氢筑新程马拉松", SAFE, 678, 660, 24, 20, dark ? C.mint : C.gray, true);
}

function bullet(slide, label, body, x, y, w, dark = false) {
  rect(slide, x, y + 15, 12, 12, C.lime, true);
  text(slide, label, x + 30, y, w - 30, 42, 30, dark ? C.white : C.ink, true);
  if (body) text(slide, body, x + 30, y + 46, w - 30, 42, 28, dark ? C.mint : C.gray);
}

function bigCard(slide, kicker, title, x, y, w, h, dark = false) {
  rect(slide, x, y, w, h, dark ? "#16483D" : C.white, true, dark ? C.green : C.light);
  text(slide, kicker, x + 26, y + 20, w - 52, 38, 24, dark ? C.lime : C.green, true);
  text(slide, title, x + 26, y + 68, w - 52, h - 88, 32, dark ? C.white : C.ink, true);
}

const deck = Presentation.create({ slideSize: { width: W, height: H } });

// 01 封面：一句主题 + 一张赛事大图。
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  await image(s, assets.start, 700, 0, 580, 720, "cover");
  rect(s, 0, 0, 20, 720, C.lime);
  text(s, "鹏飞集团杯", 76, 74, 540, 48, 30, C.lime, true);
  text(s, "氢筑新程\n马拉松", 72, 146, 570, 190, 72, C.white, true);
  text(s, "绿色产业 × 公益奔跑", 76, 382, 560, 52, 36, C.mint, true);
  rect(s, 76, 472, 410, 3, C.green);
  text(s, "独家总冠名合作提案", 76, 494, 520, 50, 30, C.white, true);
  text(s, "让每一步都有力量", 76, 586, 520, 44, 28, C.mint, true);
}

// 02 赛事理念：大图主导，三词说明赛事为何值得做。
{
  const s = deck.slides.add();
  s.background.fill = C.cream;
  header(s, "01 / 赛事理念", "一场奔跑，连接绿色、公益与城市", 2);
  await image(s, assets.runner, 72, 184, 650, 430, "cover", true);
  bigCard(s, "GREEN", "绿色\n让产业理念被看见", 760, 184, 448, 126);
  bigCard(s, "LOVE", "公益\n让品牌温度被感知", 760, 330, 448, 126);
  bigCard(s, "CITY", "城市\n让赛事流量被激活", 760, 476, 448, 138);
  footer(s);
}

// 03 鹏飞合作价值：只保留三项最关键的品牌回报。
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  header(s, "02 / 鹏飞合作价值", "一次冠名，激活三类长期价值", 3, true);
  const items = [
    ["01", "产业认知", "氢能实力进入公众视野"],
    ["02", "消费转化", "文旅酒店承接赛事流量"],
    ["03", "品牌声誉", "公益行动沉淀社会信任"],
  ];
  items.forEach(([n, a, b], i) => {
    const x = 72 + i * 378;
    rect(s, x, 196, 340, 344, i === 1 ? C.green : "#17372F", true, C.green);
    text(s, n, x + 28, 222, 88, 58, 42, C.lime, true);
    text(s, a, x + 28, 310, 284, 56, 36, C.white, true);
    text(s, b, x + 28, 398, 284, 92, 28, C.mint, true);
  });
  text(s, "被看见  ·  被理解  ·  被选择", 72, 582, 1136, 54, 38, C.white, true, { align: "center" });
  footer(s, true);
}

// 04 赛事经济价值：以一张城市图和三条转化路径表达。
{
  const s = deck.slides.add();
  s.background.fill = C.white;
  header(s, "03 / 赛事经济价值", "赛事流量，为文旅消费创造真实入口", 4);
  await image(s, assets.city, 690, 184, 518, 430, "cover", true);
  bigCard(s, "跑者抵达", "住宿\n酒店客源", 72, 184, 280, 184);
  bigCard(s, "城市停留", "游览\n景区联动", 376, 184, 280, 184);
  bigCard(s, "赛后延展", "消费\n权益核销", 72, 392, 584, 222, true);
  footer(s);
}

// 05 公益价值：报名、捐赠、传播形成清晰闭环。
{
  const s = deck.slides.add();
  s.background.fill = C.cream;
  header(s, "04 / 公益价值", "每一次报名，都转化为一份真实善意", 5);
  await image(s, assets.smile, 72, 184, 550, 430, "cover", true);
  text(s, "100%", 682, 190, 470, 106, 72, C.green, true);
  text(s, "报名费捐赠点爱基金", 686, 290, 490, 52, 36, C.ink, true);
  bullet(s, "报名即公益", "参与门槛更低", 686, 382, 470);
  bullet(s, "结果可公示", "行动真实可信", 686, 490, 470);
  text(s, "让公益不是口号，而是可见行动", 72, 626, 1136, 42, 32, C.green, true, { align: "center" });
  footer(s);
}

// 06 冠名权益：从六项压缩为三类核心资产。
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  header(s, "05 / 独家冠名权益", "三类核心权益，贯穿赛事全程", 6, true);
  const items = [
    ["身份", "赛事全称绑定\n核心发起者"],
    ["场景", "主视觉与现场\n全链路露出"],
    ["传播", "全媒体内容\n持续扩散"],
  ];
  items.forEach(([tag, body], i) => {
    const x = 72 + i * 378;
    rect(s, x, 194, 340, 360, i === 0 ? C.green : "#17372F", true, C.green);
    text(s, tag, x + 30, 226, 280, 48, 30, C.lime, true);
    text(s, body, x + 30, 308, 280, 128, 36, C.white, true);
    text(s, ["唯一名称权", "高频视觉触点", "长周期品牌声量"][i], x + 30, 476, 280, 48, 28, C.mint, true);
  });
  text(s, "名称绑定 → 现场体验 → 内容传播", 72, 590, 1136, 50, 34, C.white, true, { align: "center" });
  footer(s, true);
}

// 07 品牌触点：四个时刻、一条跑者旅程。
{
  const s = deck.slides.add();
  s.background.fill = C.white;
  header(s, "05 / 品牌触点", "鹏飞，陪伴跑者完成整段赛事旅程", 7);
  const data = [
    ["赛前", "官宣报名"],
    ["到场", "主视觉"],
    ["参赛", "服装号码布"],
    ["完赛", "奖牌与故事"],
  ];
  rect(s, 132, 350, 920, 6, C.green, true);
  data.forEach(([a, b], i) => {
    const x = 90 + i * 286;
    rect(s, x + 28, 326, 54, 54, i === 3 ? C.lime : C.green, true);
    text(s, a, x, 220, 180, 54, 34, C.ink, true, { align: "center" });
    text(s, b, x - 12, 410, 220, 62, 30, C.gray, true, { align: "center" });
  });
  text(s, "从第一次看见，到完赛后二次传播", 72, 560, 1136, 60, 40, C.green, true, { align: "center" });
  footer(s);
}

// 08 AI 视频：画面占主体，只展示三步成片逻辑。
{
  const s = deck.slides.add();
  s.background.fill = C.cream;
  header(s, "06 / AI 视频展示", "赛事照片，快速生成传播短片", 8);
  await image(s, assets.start, 72, 184, 690, 430, "cover", true);
  rect(s, 94, 526, 646, 66, "#10231FCC", true);
  text(s, "15 秒横版宣传片", 116, 536, 602, 46, 32, C.white, true);
  bigCard(s, "01", "识别\n人物与场景", 798, 184, 410, 126);
  bigCard(s, "02", "编排\n节奏与字幕", 798, 330, 410, 126);
  bigCard(s, "03", "输出\n多渠道成片", 798, 476, 410, 138, true);
  footer(s);
}

// 09 AI 文创：视觉基准页，图片占主要区域。
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  header(s, "07 / AI 文创展示", "一套视觉资产，覆盖赛事传播全场景", 9, true);
  const cards = [
    [assets.poster, "主视觉海报"],
    [assets.mascot, "赛事 IP"],
    [assets.medal, "完赛奖牌"],
    [assets.shirt, "参赛服"],
  ];
  for (let i = 0; i < cards.length; i++) {
    const x = 72 + i * 286;
    rect(s, x, 184, 258, 382, C.white, true);
    await image(s, cards[i][0], x + 12, 196, 234, 292, "contain", true);
    text(s, cards[i][1], x + 14, 502, 230, 48, 28, C.ink, true, { align: "center" });
  }
  text(s, "统一主题  ·  快速迭代  ·  多渠道复用", 72, 598, 1136, 48, 32, C.mint, true, { align: "center" });
  footer(s, true);
}

// 10 传播合作：每阶段只保留两个核心动作。
{
  const s = deck.slides.add();
  s.background.fill = C.white;
  header(s, "08 / 传播合作", "赛前蓄势、赛中引爆、赛后沉淀", 10);
  const blocks = [
    ["01", "赛前蓄势", "冠名官宣\n阳光故事"],
    ["02", "赛中引爆", "赛事直播\n短视频共创"],
    ["03", "赛后沉淀", "捐赠公示\n品牌纪录片"],
  ];
  blocks.forEach(([n, a, b], i) => {
    const x = 72 + i * 378;
    const dark = i === 1;
    rect(s, x, 194, 340, 376, dark ? C.green : C.cream, true);
    text(s, n, x + 30, 222, 90, 62, 46, dark ? C.lime : C.green, true);
    text(s, a, x + 30, 310, 280, 54, 34, dark ? C.white : C.ink, true);
    text(s, b, x + 30, 404, 280, 112, 30, dark ? C.white : C.gray, true);
  });
  footer(s);
}

// 11 合作建议：三种方式，一条明确行动。
{
  const s = deck.slides.add();
  s.background.fill = C.cream;
  header(s, "09 / 合作建议", "三种合作方式，匹配不同投入策略", 11);
  const blocks = [
    ["首选", "独家现金\n总冠名"],
    ["灵活", "现金＋资源\n组合投入"],
    ["长期", "年度战略\n持续合作"],
  ];
  blocks.forEach(([tag, title], i) => {
    const x = 72 + i * 378;
    bigCard(s, tag, title, x, 194, 340, 286, i === 0);
  });
  rect(s, 72, 526, 1136, 100, C.green, true);
  text(s, "下一步：确认投入方式与核心权益", 104, 544, 1072, 62, 36, C.white, true, { align: "center" });
  footer(s);
}

// 12 结语：回到绿色、公益、回报三个关键词。
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  await image(s, assets.finish, 720, 0, 560, 720, "cover");
  rect(s, 0, 0, 20, 720, C.lime);
  text(s, "携手鹏飞集团", 76, 80, 560, 50, 30, C.lime, true);
  text(s, "以氢筑新程\n以爱抵达远方", 72, 150, 610, 180, 62, C.white, true);
  text(s, "绿色产业被看见", 76, 384, 560, 46, 32, C.mint, true);
  text(s, "公益担当被感知", 76, 442, 560, 46, 32, C.mint, true);
  text(s, "赛事流量被转化", 76, 500, 560, 46, 32, C.mint, true);
  rect(s, 76, 584, 470, 3, C.green);
  text(s, "共建有影响力、有温度、有回报的标杆赛事", 76, 600, 590, 54, 28, C.white, true);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(PREVIEW, { recursive: true });
  for (const [i, slide] of deck.slides.items.entries()) {
    const stem = `slide-${String(i + 1).padStart(2, "0")}`;
    const png = await deck.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(path.join(PREVIEW, `${stem}.png`), new Uint8Array(await png.arrayBuffer()));
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(PREVIEW, `${stem}.layout.json`), await layout.text());
  }
  const montage = await deck.export({ format: "webp", montage: true, scale: 1 });
  await fs.writeFile(path.join(PREVIEW, "deck-montage.webp"), new Uint8Array(await montage.arrayBuffer()));
  const pptx = await PresentationFile.exportPptx(deck);
  await pptx.save(PPTX);
  console.log(PPTX);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
