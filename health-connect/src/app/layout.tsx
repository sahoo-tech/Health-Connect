import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health Connect",
  description: "Simple booking coordination platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof crypto !== 'undefined' && typeof crypto.randomUUID !== 'function') {
                crypto.randomUUID = function() {
                  var bytes = new Uint8Array(16);
                  crypto.getRandomValues(bytes);
                  bytes[6] = (bytes[6] & 0x0f) | 0x40;
                  bytes[8] = (bytes[8] & 0x3f) | 0x80;
                  var hex = Array.from(bytes).map(function(b) { return b.toString(16).padStart(2, '0'); });
                  return hex[0]+hex[1]+hex[2]+hex[3]+'-'+hex[4]+hex[5]+'-'+hex[6]+hex[7]+'-'+hex[8]+hex[9]+'-'+hex[10]+hex[11]+hex[12]+hex[13]+hex[14]+hex[15];
                };
              }
            `,
          }}
        />
      </head>
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
