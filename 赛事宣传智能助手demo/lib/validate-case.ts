import type { CaseFact, DemoCase } from "./case-types";

function checkFact(path:string, fact:CaseFact<unknown>, sourceIds:Set<string>, errors:string[]) {
  if (fact.status === "unknown" && fact.value !== null) errors.push(`${path}: unknown 事实不能包含具体值`);
  if (fact.status !== "unknown" && fact.value === null) errors.push(`${path}: 已声明事实缺少值`);
  for (const sourceId of fact.sourceIds) if (!sourceIds.has(sourceId)) errors.push(`${path}: 来源 ${sourceId} 未登记`);
  if (fact.status === "confirmed" && fact.sourceIds.length === 0) errors.push(`${path}: confirmed 事实必须登记来源`);
}

export function validateCase(demoCase:DemoCase):string[] {
  const errors:string[]=[];
  const sourceIds=new Set(demoCase.sources.map(source=>source.id));
  if (!demoCase.id.trim()) errors.push("case.id 不能为空");
  for (const [group, facts] of Object.entries(demoCase.facts)) {
    for (const [name, fact] of Object.entries(facts)) checkFact(`facts.${group}.${name}`, fact, sourceIds, errors);
  }
  const scenes=Object.values(demoCase.modules.copywriting.scenes);
  if (!scenes.length) errors.push("至少需要一个公众号场景");
  for (const scene of scenes) for (const tone of Object.keys(demoCase.modules.copywriting.tones)) {
    if (!scene.body[tone as keyof typeof scene.body]?.trim()) errors.push(`公众号场景 ${scene.id} 缺少 ${tone} 样稿`);
  }
  const ppt=demoCase.modules.ppt;
  if (!ppt.slides.length) errors.push("PPT 至少需要一页");
  for (const index of ppt.compactSlideIndexes) if (index<0 || index>=ppt.slides.length) errors.push(`PPT 精简版页码 ${index} 越界`);
  if (!demoCase.modules.video.assets.length) errors.push("视频至少需要一个演示素材");
  const productIds=demoCase.modules.creative.products.map(product=>product.product);
  if (new Set(productIds).size!==productIds.length) errors.push("文创产品 ID 不能重复");
  return errors;
}

export function assertValidCase(demoCase:DemoCase):void {
  const errors=validateCase(demoCase);
  if (errors.length) throw new Error(`案例配置无效：\n${errors.join("\n")}`);
}
