import RequestsClient from "./requests-client";

export const metadata = {
  title: "ECU Tuning Requests - ADR Autoparts",
  description: "Track your ECU tuning requests and download firmware files",
};

export default function RequestsPage() {
  return <RequestsClient />;
}
