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
  const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(pageSource, /赛事信息输入/);
  assert.match(pageSource, /生成设计方案/);
  assert.match(pageSource, /AI 文化解析/);
  assert.match(pageSource, /设计方向生成/);
  assert.match(pageSource, /文创产品体系/);
  assert.match(pageSource, /鹏飞集团杯·氢筑新程马拉松/);
  const creativeAssetsSource = await readFile(new URL("../lib/creative-assets.ts", import.meta.url), "utf8");
  assert.match(creativeAssetsSource, /mockCreativeDesign/);
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
  assert.match(html, /报名启动/);
  assert.match(html, /赛道发布/);
  assert.match(html, /领物交通/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});
