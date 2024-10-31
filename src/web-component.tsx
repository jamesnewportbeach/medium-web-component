import ReactDOM from "react-dom/client";
import {
  IPolygonAnnotationProps,
  PolygonCanvas,
} from "./components/PolygonAnnotations/Canvas";
import { normalizeAttribute } from "./utils";

class PolygonCanvasWebComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const props = this.getPropsFromAttributes<IPolygonAnnotationProps>();
    const root = ReactDOM.createRoot(this.shadowRoot as ShadowRoot);
    root.render(<PolygonCanvas {...props} />);
  }

  private getPropsFromAttributes<T>(): T {
    const props: Record<string, string> = {};

    for (let index = 0; index < this.attributes.length; index++) {
      const attribute = this.attributes[index];
      props[normalizeAttribute(attribute.name)] = attribute.value;
    }

    return props as T;
  }
}

export default PolygonCanvasWebComponent;
