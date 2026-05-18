// app/page.tsx — Root entry point: redirect to /login
import { redirect } from "next/navigation";
export default function RootPage() { redirect("/login"); }
