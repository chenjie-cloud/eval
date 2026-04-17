import * as QRCode from "qrcode";

export async function generateQrPngDataUrl(text: string, size: number) {
  const dataUrl = await QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 4,
    width: Math.round(size),
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/png")) {
    throw new Error("二维码输出异常");
  }

  return dataUrl;
}

