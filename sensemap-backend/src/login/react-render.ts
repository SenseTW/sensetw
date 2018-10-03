import * as ReactDOMServer from "react-dom/server";
import * as fs from "async-file";

export async function render(component, props = {}) {
  const html = ReactDOMServer.renderToStaticMarkup(component(props));
  const data = await fs.readFile(
    __dirname + "/../../public/index.html",
    "utf8"
  );
  const document = data.replace(/<div id="root">[\s\S]*<\/div>/, `${html}`);
  return document;
}
