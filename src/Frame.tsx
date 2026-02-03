import type { Exposed } from "./api";
import * as Comlink from "comlink";

const parentOrigin = import.meta.env.ORIGIN;

const api = Comlink.wrap<Exposed>(Comlink.windowEndpoint(window.parent, globalThis, parentOrigin));

export default function Frame() {
  return (
    <div>
      <button
        onClick={() => {
          eval("alert(1+1)");
        }}
      >
        Test eval
      </button>
      <button
        onClick={async () => {
          // fetch using parent fetch
          const raw = await api.nativeFetch("https://jnrbsn.github.io/user-agents/user-agents.json");
          const response = new Response(raw.buffer, {
            status: raw.status,
            statusText: raw.statusText,
            headers: raw.headers,
          });

          alert(await response.text());
        }}
      >
        Test nativeFetch
      </button>
    </div>
  );
}
