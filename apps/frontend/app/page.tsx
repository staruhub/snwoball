import { redirect } from "next/navigation";

/**
 * 根路径重定向到工作台
 */
export default function RootPage() {
  redirect("/workspace");
}
