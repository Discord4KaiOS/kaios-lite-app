import * as Comlink from "comlink";

function parseHeaders(raw: string): [string, string][] {
  if (!raw) return [];

  return raw
    .trim()
    .split(/[\r\n]+/)
    .map((line) => {
      const index = line.indexOf(":");
      if (index === -1) return null;

      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();

      return [key, value] as [string, string];
    })
    .filter((a) => a !== null);
}

const NO_RESPONSE = {
  status: 0,
  statusText: "",
  headers: [],
  buffer: new ArrayBuffer(0),
};

const api = {
  // nativeFetch: async (url: string, init?: RequestInit) => {
  //   let response: Response | undefined;
  //   let buffer: ArrayBuffer | undefined;

  //   try {
  //     response = await fetch(url, init);
  //     buffer = await response.arrayBuffer();
  //   } catch {}

  //   return response && buffer
  //     ? Comlink.transfer(
  //         {
  //           ok: response.ok,
  //           status: response.status,
  //           statusText: response.statusText,
  //           headers: [...response.headers.entries()],
  //           buffer,
  //         },
  //         [buffer],
  //       )
  //     : {
  //         ok: response?.ok ?? false,
  //         status: response?.status ?? 0,
  //         statusText: response?.statusText ?? "",
  //         headers: response ? [...response.headers.entries()] : [],
  //         buffer: new ArrayBuffer(0),
  //       };
  // },

  nativeFetch: async (
    url: string,
    init?: Omit<RequestInit, "headers" | "body"> & { headers?: [string, string][] },
  ): Promise<{
    status: number;
    statusText: string;
    headers: [string, string][];
    buffer: ArrayBuffer;
  }> => {
    return new Promise((resolve) => {
      // @ts-ignore
      const xhr = new XMLHttpRequest({ mozSystem: true });

      xhr.open(init?.method ?? "GET", url, true);

      xhr.withCredentials = init?.credentials === "include";

      // Headers
      if (init?.headers) {
        for (const [k, v] of init.headers) {
          xhr.setRequestHeader(k, v);
        }
      }

      xhr.responseType = "arraybuffer";

      xhr.onload = () => {
        const buffer: ArrayBuffer = xhr.response ?? new ArrayBuffer(0);
        resolve(
          Comlink.transfer(
            {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders()),
              buffer: buffer,
            },
            [buffer],
          ),
        );
      };

      xhr.onerror = () => {
        resolve(NO_RESPONSE);
      };

      xhr.onabort = () => {
        resolve(NO_RESPONSE);
      };

      xhr.send();
    });
  },
} as const;

export { api };
export type Exposed = typeof api;
