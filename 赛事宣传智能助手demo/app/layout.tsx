import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 智能宣传内容创作平台",
  description: "围绕同一个活动项目，通过 AI 生成公众号宣传文案、宣传视频方案、汇报 PPT 与文创产品设计。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
