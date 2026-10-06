import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#090908",
          color: "#f7f2eb",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 4,
            color: "#e7b089",
            textTransform: "uppercase",
          }}
        >
          NewIQ · 18+
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 76,
            lineHeight: 1.05,
            letterSpacing: -1,
          }}
        >
          Stop searching. Start finding.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: "#c9bfb4",
          }}
        >
          Five questions. A private recommendation. No account.
        </div>
      </div>
    ),
    size,
  );
}
