import ToastProvider from "@/components/bar/ToastProvider";
import "./globals.css";
import { ContextProvider } from "@/components/context/Context";


import { headers } from "next/headers";
import { getTenant } from "@/lib/database/tenant";

export async function generateMetadata() {
  const host = (await headers()).get("host");
  const tenant = await getTenant({ headers: new Map([["host", host]]) });

  return {
    title: tenant?.website_name || tenant?.name || "Restaurant",
    description: tenant?.meta_description || "Exceptional culinary experience.",
    openGraph: {
      title: tenant?.website_name || tenant?.name || "Restaurant",
      description: tenant?.meta_description || "Exceptional culinary experience.",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="w-full overflow-x-hidden relative font-sans text-xs md:text-sm">
        <ContextProvider>
          <ToastProvider>
            <main>{children}</main>
          </ToastProvider>
        </ContextProvider>
      </body>
    </html>
  );
}