import { type GlobalConfig } from "@/types";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Case Tracker",
  description:
    "BLR-INF Case tracker with server side sorting, pagination, and filtering",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://table.sadmn.com",
  links: { github: "https://github.com/sadmann7/shadcn-table" },
};

export const globalConfig: GlobalConfig = {
  mainNav: [
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
  ],
};
