import AutoECUClient from "./autoecu-client";

export const metadata = {
  title: "AutoECU Portal - ADR Autoparts",
  description: "Upload and download ECU firmware tuning files",
};

export default function AutoECUPage() {
  return <AutoECUClient />;
}
