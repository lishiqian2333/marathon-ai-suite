import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "太马报名助手 Demo", description: "太原马拉松报名期智能客服交互演示" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
