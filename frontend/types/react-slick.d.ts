declare module "react-slick" {
  import * as React from "react";

  interface Settings {
    dots?: boolean;
    arrows?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    fade?: boolean;
    [key: string]: any;
  }

  export default class Slider extends React.Component<Settings> {}
}
