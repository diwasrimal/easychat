export async function makePayload(res) {
  return { ok: res.ok, status: res.status, data: await res.json() };
}
