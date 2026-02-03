import * as Comlink from "comlink";

const api = {
  nativeFetch: async (url: string, init?: RequestInit) => {
    let response: Response | undefined;
    let buffer: ArrayBuffer | undefined;

    try {
      response = await fetch(url, init);
      buffer = await response.arrayBuffer();
    } catch {}

    return response && buffer
      ? Comlink.transfer(
          {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: [...response.headers.entries()],
            buffer,
          },
          [buffer],
        )
      : {
          ok: response?.ok ?? false,
          status: response?.status ?? 0,
          statusText: response?.statusText ?? "",
          headers: response ? [...response.headers.entries()] : [],
          buffer: new ArrayBuffer(0),
        };
  },
} as const;

export type Exposed = typeof api;
