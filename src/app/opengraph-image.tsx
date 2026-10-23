import { ImageResponse } from "next/og";

export const alt = "Luksuri Reka — Studio Digital";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#081b29", color: "#edf3f4" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 1 }}><div style={{ display: "flex" }}>LUKSURI<span style={{ color: "#67e1de" }}>REKA</span></div><span style={{ color: "#a5b5bf", fontSize: 18 }}>STUDIO DIGITAL</span></div><div style={{ display: "flex", flexDirection: "column", fontSize: 79, lineHeight: 1.08, letterSpacing: -4 }}><span>Ide yang terarah.</span><span style={{ color: "#67e1de" }}>Sistem yang bekerja.</span></div><div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #2c404b", paddingTop: 24, fontSize: 18, color: "#a5b5bf" }}><span>Dirancang dengan makna. Dibangun untuk bekerja.</span><span>luksurireka.com</span></div></div>, size);
}
