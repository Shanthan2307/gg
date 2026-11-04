import { ImageResponse } from "next/og";

export const alt = "Gargi Pathak · The Build Log";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A ticket stub on the site's paper ground, so shared links look like the log itself
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f7f6f3", padding: 64 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            background: "#ffffff",
            border: "2px solid #e7e4de",
            borderRadius: 28,
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 56 }}>
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#69655e", textTransform: "uppercase" }}>
              Admit one · The Build Log
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 112, color: "#1b1a18", letterSpacing: -3 }}>Gargi Pathak</div>
              <div style={{ fontSize: 34, color: "#69655e", marginTop: 12 }}>
                Hackathon winner. Builder of GPS for drones. Texas Tech CS.
              </div>
            </div>
          </div>
          <div style={{ width: 0, borderLeft: "4px solid #e7e4de", margin: "40px 0" }} />
          <div style={{ width: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: 190,
                height: 190,
                borderRadius: 999,
                border: "6px solid #d6492f",
                color: "#d6492f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                letterSpacing: 4,
                transform: "rotate(-14deg)",
              }}
            >
              WINNER
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
