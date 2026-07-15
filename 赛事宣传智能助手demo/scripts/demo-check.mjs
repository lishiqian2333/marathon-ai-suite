import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];
const successes = [];

function pass(message) { successes.push(`✓ ${message}`); }
function fail(message) { failures.push(`✗ ${message}`); }

async function exists(relativePath) {
  try { await access(path.join(root, relativePath)); return true; }
  catch { return false; }
}

async function requireFiles(label, files) {
  const missing = [];
  for (const file of files) if (!(await exists(file))) missing.push(file);
  if (missing.length) missing.forEach(file => fail(`${label}缺失：${file}`));
  else pass(`${label}完整（${files.length} 项）`);
}

const documents = [
  "cases/pengfei-marathon/demo-script.md",
  "cases/pengfei-marathon/demo-faq.md",
  "cases/pengfei-marathon/checklist.md",
  "cases/pengfei-marathon/rehearsal-report.md",
];

const videoAssets = [
  ...Array.from({ length: 8 }, (_, index) => `public/demo-media/${String(index + 1).padStart(2, "0")}-${["start","city","pack","pacer","runner","smile","finish","celebrate"][index]}.jpg`),
  "public/demo-media/final.mp4",
];

const creativeAssets = [
  "public/creative-assets/award/hydrogen_future.png",
  "public/creative-assets/tshirt/tshirt01.png",
  "public/creative-assets/mascot/qing_runner.png",
  "public/creative-assets/poster/campaign_overview.png",
];

const pptAssets = [
  "public/ppt-slides/Preview.html",
  "public/downloads/鹏飞集团杯·氢筑新程马拉松·独家总冠名合作提案.pptx",
];

await requireFiles("演示文档", documents);
await requireFiles("视频素材", videoAssets);
await requireFiles("文创素材", creativeAssets);
await requireFiles("PPT 成果", pptAssets);

const componentFiles = ["ContentPlatform", "VideoDemo", "PptDemo", "CreativeDemo"].map(name => `app/components/${name}.tsx`);
const forbiddenComponentTerms = ["鹏飞", "太原", "古县城", "晋阳", "氢筑新程", "点爱"];
for (const file of componentFiles) {
  const source = await readFile(path.join(root, file), "utf8");
  const found = forbiddenComponentTerms.filter(term => source.includes(term));
  if (found.length) fail(`${file} 包含案例硬编码：${found.join("、")}`);
}
if (!failures.some(item => item.includes("案例硬编码"))) pass("通用组件未包含案例硬编码");

const copySource = await readFile(path.join(root, "cases/pengfei-marathon/copywriting.ts"), "utf8");
const unsafeClaims = ["2026年9月20日", "40,000人", "7月15日10:00", "9月17日至19日"];
const foundUnsafeClaims = unsafeClaims.filter(term => copySource.includes(term));
if (foundUnsafeClaims.length) fail(`公众号案例包含无来源旧数据：${foundUnsafeClaims.join("、")}`);
else pass("公众号案例未发现无来源旧数据");

const caseSource = await readFile(path.join(root, "cases/pengfei-marathon/index.ts"), "utf8");
for (const requiredPattern of ["fullName: confirmed", "slogan: confirmed", "date: unknown", "scale: unknown", "modules:"]) {
  if (!caseSource.includes(requiredPattern)) fail(`案例配置缺少关键声明：${requiredPattern}`);
}
if (!failures.some(item => item.includes("关键声明"))) pass("案例事实状态与模块入口完整");

const pptSource = await readFile(path.join(root, "cases/pengfei-marathon/ppt.ts"), "utf8");
const slideCount = (pptSource.match(/\{section:/g) ?? []).length;
const compactMatch = pptSource.match(/compactSlideIndexes:\[([^\]]*)\]/);
const compactIndexes = compactMatch ? compactMatch[1].split(",").map(value => Number(value.trim())).filter(Number.isFinite) : [];
if (!slideCount) fail("PPT 配置没有页面");
else if (compactIndexes.some(index => index < 0 || index >= slideCount)) fail("PPT 领导版页面索引越界");
else pass(`PPT 配置有效（${slideCount} 页，领导版 ${compactIndexes.length} 页）`);

const scriptSource = await readFile(path.join(root, documents[0]), "utf8");
for (const requiredSection of ["3 分钟领导速览版", "5 分钟标准版", "8 分钟完整版", "应急切换"]) {
  if (!scriptSource.includes(requiredSection)) fail(`演示脚本缺少章节：${requiredSection}`);
}
if (!failures.some(item => item.includes("演示脚本缺少"))) pass("三套演示路线与应急方案完整");

console.log([...successes, ...failures].join("\n"));
if (failures.length) {
  console.error(`\nDemo 检查失败：${failures.length} 项问题`);
  process.exitCode = 1;
} else {
  console.log("\nDemo 静态检查通过，继续执行构建与自动化测试。\n");
}
