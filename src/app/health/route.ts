export function GET() {
  return Response.json(
    { status: "ok", service: "oknef-web-ui-extension" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
