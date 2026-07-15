import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the AI content creation platform", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>AI 智能宣传内容创作平台<\/title>/i);
  assert.match(html, /公众号宣传文案/);
  assert.match(html, /宣传视频方案/);
  assert.match(html, /汇报 PPT/);
  assert.match(html, /文创产品设计/);
  const creativeDemoSource = await readFile(new URL("../app/components/CreativeDemo.tsx", import.meta.url), "utf8");
  assert.match(creativeDemoSource, /赛事信息输入/);
  assert.match(creativeDemoSource, /生成设计方案/);
  assert.match(creativeDemoSource, /AI 文化解析/);
  assert.match(creativeDemoSource, /设计方向生成/);
  assert.match(creativeDemoSource, /文创产品体系/);
  assert.match(creativeDemoSource, /currentCase\.facts\.event\.fullName/);
  assert.match(creativeDemoSource, /演示预设/);
  const creativeAssetsSource = await readFile(new URL("../cases/pengfei-marathon/creative.ts", import.meta.url), "utf8");
  assert.match(creativeDemoSource, /currentCase\.modules\.creative/);
  assert.match(creativeAssetsSource, /古城文化系列/);
  assert.doesNotMatch(creativeAssetsSource, /文创礼盒/);
  assert.doesNotMatch(creativeAssetsSource, /纪念徽章/);
  assert.match(creativeAssetsSource, /design_name/);
  assert.match(creativeAssetsSource, /award\/hydrogen_future\.png/);
  assert.match(creativeAssetsSource, /tshirt\/tshirt01\.png/);
  assert.match(creativeAssetsSource, /mascot\/qing_runner\.png/);
  assert.match(html, /宣传视频方案/);
  assert.match(html, /创建宣传任务/);
  assert.match(html, /公众号文章初稿/);
  assert.match(html, /标题推荐/);
  assert.match(html, /赛事官宣/);
  assert.match(html, /赛道发布/);
  assert.match(html, /参赛指南/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("keeps confirmed facts separate from demo defaults", async () => {
  const caseSource = await readFile(new URL("../cases/pengfei-marathon/index.ts", import.meta.url), "utf8");
  const currentCaseSource = await readFile(new URL("../lib/current-case.ts", import.meta.url), "utf8");
  const contentSource = await readFile(new URL("../app/components/ContentPlatform.tsx", import.meta.url), "utf8");
  const videoSource = await readFile(new URL("../app/components/VideoDemo.tsx", import.meta.url), "utf8");

  assert.match(caseSource, /fullName: confirmed\("鹏飞集团杯·氢筑新程马拉松"/);
  assert.match(caseSource, /slogan: confirmed\("氢筑新程，为爱奔跑"/);
  assert.match(caseSource, /date: unknown\(/);
  assert.match(caseSource, /scale: unknown\(/);
  assert.match(caseSource, /demoDefaults:/);
  assert.match(currentCaseSource, /pengfeiMarathonCase/);
  assert.doesNotMatch(contentSource, /date:\s*"2026年9月20日 07:30"/);
  assert.doesNotMatch(contentSource, /scale:\s*"40,000人"/);
  assert.doesNotMatch(videoSource, /eventInfo\.title \|\| "2026太原马拉松"/);
});

test("keeps case content out of reusable components", async () => {
  const componentNames = ["ContentPlatform", "VideoDemo", "PptDemo", "CreativeDemo"];
  const forbiddenCaseTerms = [/鹏飞/, /太原/, /古县城/, /晋阳/, /氢筑新程/, /点爱/];
  for (const componentName of componentNames) {
    const source = await readFile(new URL(`../app/components/${componentName}.tsx`, import.meta.url), "utf8");
    assert.match(source, /currentCase/);
    for (const term of forbiddenCaseTerms) assert.doesNotMatch(source, term);
  }

  const caseSource = await readFile(new URL("../cases/pengfei-marathon/copywriting.ts", import.meta.url), "utf8");
  const validatorSource = await readFile(new URL("../lib/validate-case.ts", import.meta.url), "utf8");
  assert.match(caseSource, /赛事日期、报名、路线及服务安排以组委会正式公告为准/);
  assert.doesNotMatch(caseSource, /2026年9月20日|40,000人|7月15日10:00|9月17日至19日/);
  assert.match(validatorSource, /PPT 精简版页码/);
  assert.match(validatorSource, /confirmed 事实必须登记来源/);
});
