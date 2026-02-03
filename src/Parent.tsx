import { onMount } from "solid-js";
import * as Comlink from "comlink";
import "./App.css";
import { api } from "./api";

export default function Parent() {
  let iframe!: HTMLIFrameElement;
  let iframeOrigin = import.meta.env.FRAME_ORIGIN;

  onMount(() => {
    Comlink.expose(api, Comlink.windowEndpoint(iframe.contentWindow!, globalThis, iframeOrigin));
  });

  return <iframe ref={iframe} src={import.meta.env.FRAME_ORIGIN}></iframe>;
}
