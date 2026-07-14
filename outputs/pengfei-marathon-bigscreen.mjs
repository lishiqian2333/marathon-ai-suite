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
  text(slide, section, SAFE, 30, 440, 28, 18, muted, true);
  text(slide, title, SAFE, 68, 1120, 78, 48, main, true);
  text(slide, String(page).padStart(2, "0"), 1160, 34, 48, 26, 18, muted, true, { align: "right" });
}

function footer(slide, dark = false) {
  const color = dark ? C.mint : C.gray;
  text(slide, "PENGFEI GROUP CUP · HYDROGEN BUILDS A NEW JOURNEY", SAFE, 680, 780, 20, 15, color, false);
}

function bullet(slide, label, body, x, y, w, dark = false) {
  rect(slide, x, y + 14, 10, 10, C.lime, true);
  text(slide, label, x + 28, y, w - 28, 36, 28, dark ? C.white : C.ink, true);
  if (body) text(slide, body, x + 28, y + 38, w - 28, 48, 24, dark ? C.mint : C.gray, false);
}

function metric(slide, big, label, x, y, w, accent = C.lime, dark = false) {
  text(slide, big, x, y, w, 80, 64, accent, true);
  text(slide, label, x, y + 82, w, 42, 24, dark ? C.white : C.ink, true);
}

const deck = Presentation.create({ slideSize: { width: W, height: H } });

// 01 首页：左右 44/56，大标题与赛事现场图形成第一视觉。
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  await image(s, assets.start, 720, 0, 560, 720, "cover");
  rect(s, 0, 0, 20, 720, C.lime);
  text(s, "鹏飞集团杯", 76, 76, 560, 48, 30, C.lime, true);
  text(s, "氢筑新程\n马拉松", 72, 146, 610, 190, 72, C.white, true);
  text(s, "氢筑新程，为爱奔跑", 76, 368, 580, 54, 34, C.mint, true);
  rect(s, 76, 456, 420, 2, C.mint);
  text(s, "独家总冠名合作提案", 76, 486, 520, 48, 28, C.white, true);
  text(s, "为带给你阳光的人奔跑", 76, 584, 520, 38, 24, C.mint, false);
}

// 02 赛事价值：一个核心结论 + 3 个价值支点。
{
  const s = deck.slides.add();
  s.background.fill = C.cream;
  header(s, "01 / 赛事价值", "这场赛事，让品牌影响力与社会价值同向增长", 2);
  await image(s, assets.runner, 72, 194, 530, 420, "cover", true);
  metric(s, "100%", "报名费捐赠点爱基金", 650, 200, 500, C.green);
  bullet(s, "绿色", "氢能理念进入真实赛事场景", 650, 350, 500);
  bullet(s, "公益", "每一次报名都形成可追踪善意", 650, 442, 500);
  bullet(s, "城市", "跑者、媒体与消费场景集中汇聚", 650, 534, 500);
  footer(s);
}

// 03 鹏飞合作价值：用一句商业结论统领五项目标。
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  header(s, "02 / 鹏飞合作价值", "一次冠名，带动五个品牌目标", 3, true);
  text(s, "不止获得曝光，更让鹏飞产业价值被理解、体验与转化。", 72, 160, 1080, 50, 28, C.mint, false);
  const items = [
    ["01", "氢能主业", "场景化传播"],
    ["02", "文旅资源", "持续引流"],
    ["03", "高端酒店", "客源转化"],
    ["04", "企业责任", "可视化"],
    ["05", "高端圈层", "有效链接"],
  ];
  items.forEach(([n, a, b], i) => {
    const x = 72 + i * 226;
    text(s, n, x, 250, 180, 50, 38, C.lime, true);
    rect(s, x, 316, 180, 2, C.green);
    text(s, a, x, 338, 190, 48, 27, C.white, true);
    text(s, b, x, 392, 190, 42, 24, C.mint, false);
  });
  text(s, "产业实力被看见  ·  责任担当被感知  ·  消费场景被激活", 72, 542, 1100, 62, 34, C.white, true);
  footer(s, true);
}

// 04 价值闭环：强调长期回报。
{
  const s = deck.slides.add();
  s.background.fill = C.white;
  header(s, "02 / 鹏飞合作价值", "赛事流量不是终点，而是产业联动的起点", 4);
  await image(s, assets.city, 770, 188, 438, 420, "cover", true);
  const steps = [["赛事流量", "聚集"], ["品牌认知", "沉淀"], ["氢能体验", "理解"], ["文旅酒店", "转化"], ["公益声誉", "复利"]];
  steps.forEach(([a, b], i) => {
    const y = 196 + i * 84;
    text(s, String(i + 1).padStart(2, "0"), 82, y, 54, 42, 24, C.green, true);
    text(s, a, 154, y, 240, 42, 30, C.ink, true);
    text(s, b, 420, y, 110, 42, 24, C.gray, false);
    if (i < 4) rect(s, 154, y + 60, 390, 1, C.light);
  });
  text(s, "长期回报", 548, 520, 170, 40, 24, C.green, true);
  text(s, "从看见鹏飞，到选择鹏飞", 82, 610, 660, 44, 30, C.green, true);
  footer(s);
}

// 05 赛事体验：大图 + 四条短句。
{
  const s = deck.slides.add();
  s.background.fill = C.cream;
  header(s, "03 / 赛事体验", "四条体验线，让理念在现场被看见", 5);
  await image(s, assets.smile, 72, 190, 600, 430, "cover", true);
  bullet(s, "绿色赛道", "低碳补给与清洁能源保障", 720, 198, 450);
  bullet(s, "阳光致敬", "写下一个名字，讲述一段感恩", 720, 294, 450);
  bullet(s, "公益捐赠", "报名即参与，结果可公示", 720, 390, 450);
  bullet(s, "城市文旅", "赛事连接景区、酒店与消费", 720, 486, 450);
  footer(s);
}

// 06 冠名权益总览：六项权益用 3×2 大块表达。
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  header(s, "04 / 独家冠名权益", "六大权益，覆盖赛事全链路", 6, true);
  const items = ["独家名称权", "全场景视觉", "综合体验区", "领导礼遇", "全媒体传播", "产业联动"];
  items.forEach((label, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 72 + col * 378, y = 198 + row * 188;
    rect(s, x, y, 340, 150, row === 0 ? "#16483D" : "#13352E", true, C.green);
    text(s, String(i + 1).padStart(2, "0"), x + 26, y + 22, 64, 42, 26, C.lime, true);
    text(s, label, x + 26, y + 72, 285, 48, 30, C.white, true);
  });
  text(s, "名称绑定 → 现场体验 → 传播扩散 → 产业转化", 72, 594, 1120, 48, 30, C.mint, true);
  footer(s, true);
}

// 07 触点覆盖：以时间轴替代物料清单。
{
  const s = deck.slides.add();
  s.background.fill = C.white;
  header(s, "04 / 独家冠名权益", "鹏飞品牌覆盖跑者旅程的每个关键触点", 7);
  const data = [
    ["赛前", "赛事全称\n官宣与报名"],
    ["到场", "主视觉\n起终点与道旗"],
    ["参赛", "参赛服\n号码布与参赛包"],
    ["完赛", "奖牌证书\n颁奖与赛后专题"],
  ];
  rect(s, 130, 346, 950, 4, C.green);
  data.forEach(([a, b], i) => {
    const x = 96 + i * 290;
    rect(s, x + 22, 326, 44, 44, i === 3 ? C.lime : C.green, true);
    text(s, a, x, 214, 180, 52, 32, C.ink, true);
    text(s, b, x, 392, 210, 112, 26, C.gray, false);
  });
  text(s, "从第一次看见，到完赛后二次传播", 72, 568, 1000, 54, 36, C.green, true);
  footer(s);
}

// 08 领导汇报页：突出发起者身份与礼遇。
{
  const s = deck.slides.add();
  s.background.fill = C.cream;
  header(s, "04 / 独家冠名权益", "让鹏飞成为赛事舞台上的核心发起者", 8);
  await image(s, assets.celebrate, 72, 190, 610, 430, "cover", true);
  bullet(s, "开幕式", "集团领导致辞并鸣枪起跑", 730, 204, 440);
  bullet(s, "颁奖礼", "为获奖选手颁奖", 730, 298, 440);
  bullet(s, "媒体场", "重点口播、采访与专属接待", 730, 392, 440);
  bullet(s, "公益场", "捐赠仪式与成果发布", 730, 486, 440);
  footer(s);
}

// 09 AI 文创：真实成品大图网格，文字只保留结论。
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  header(s, "05 / AI 文创展示", "一套视觉资产，快速覆盖赛事传播全场景", 9, true);
  const cards = [
    [assets.poster, "主视觉海报"],
    [assets.mascot, "赛事 IP"],
    [assets.medal, "完赛奖牌"],
    [assets.shirt, "参赛服"],
  ];
  for (let i = 0; i < cards.length; i++) {
    const x = 72 + i * 286;
    rect(s, x, 184, 258, 376, C.white, true);
    await image(s, cards[i][0], x + 12, 196, 234, 292, "contain", true);
    text(s, cards[i][1], x + 16, 500, 226, 46, 26, C.ink, true, { align: "center" });
  }
  text(s, "统一主题  ·  快速迭代  ·  多渠道复用", 72, 594, 1120, 48, 30, C.mint, true);
  footer(s, true);
}

// 10 传播：三阶段，只展示关键任务。
{
  const s = deck.slides.add();
  s.background.fill = C.white;
  header(s, "06 / 传播合作", "赛前蓄势、赛中引爆、赛后沉淀", 10);
  const blocks = [
    ["01", "赛前蓄势", "冠名官宣\n报名启动\n阳光故事征集"],
    ["02", "赛中引爆", "赛事直播\n短视频共创\n媒体采访"],
    ["03", "赛后沉淀", "成绩发布\n捐赠公示\n品牌纪录片"],
  ];
  blocks.forEach(([n, a, b], i) => {
    const x = 72 + i * 378;
    rect(s, x, 196, 340, 380, i === 1 ? C.green : C.cream, true);
    text(s, n, x + 28, 224, 90, 62, 44, i === 1 ? C.lime : C.green, true);
    text(s, a, x + 28, 304, 280, 52, 32, i === 1 ? C.white : C.ink, true);
    text(s, b, x + 28, 386, 280, 142, 26, i === 1 ? C.white : C.gray, false);
  });
  footer(s);
}

// 11 合作方式：三种方案与明确下一步。
{
  const s = deck.slides.add();
  s.background.fill = C.cream;
  header(s, "07 / 合作建议", "合作方式可组合，核心权益保持清晰", 11);
  const blocks = [
    ["首选", "独家现金总冠名", "完整总冠名\n＋产业联动权益"],
    ["灵活", "现金＋资源置换", "现金投入\n＋门票／房券资源"],
    ["长期", "年度战略合作", "延展徒步、商会\n与系列公益活动"],
  ];
  blocks.forEach(([tag, a, b], i) => {
    const x = 72 + i * 378;
    rect(s, x, 196, 340, 310, i === 0 ? C.ink : C.white, true, i === 0 ? C.ink : C.light);
    text(s, tag, x + 28, 224, 120, 36, 24, i === 0 ? C.lime : C.green, true);
    text(s, a, x + 28, 286, 284, 82, 30, i === 0 ? C.white : C.ink, true);
    text(s, b, x + 28, 392, 284, 78, 24, i === 0 ? C.mint : C.gray, false);
  });
  rect(s, 72, 548, 1136, 82, C.green, true);
  text(s, "下一步：确认赛事基础信息、合作投入与鹏飞品牌资产", 104, 563, 1070, 50, 30, C.white, true);
  footer(s);
}

// 12 总结：回应首页，以清晰行动收束。
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  await image(s, assets.finish, 760, 0, 520, 720, "cover");
  rect(s, 0, 0, 20, 720, C.lime);
  text(s, "携手鹏飞集团", 76, 82, 600, 48, 30, C.lime, true);
  text(s, "以氢筑新程\n以爱抵达远方", 72, 152, 640, 180, 62, C.white, true);
  text(s, "绿色产业被看见\n企业担当被感知\n赛事流量被转化", 76, 376, 560, 142, 30, C.mint, true);
  rect(s, 76, 564, 470, 2, C.green);
  text(s, "共同打造一场有影响力、有温度、有回报的标杆赛事", 76, 582, 600, 58, 26, C.white, true);
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
