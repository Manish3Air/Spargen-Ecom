
import dynamic from "next/dynamic";

const ClientVideoText = dynamic(() =>
  import("./magicui/video-text").then((mod) => mod.VideoText), {
  ssr: false,
});

export default ClientVideoText;
