import jsdom  from "jsdom";

const { JSDOM } = jsdom;

export const parse = (html) => {
  
    const dom = new JSDOM(html);

    return dom.window.document;
}