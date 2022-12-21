export interface Article {
  title: string;
  author: string;
  cover: string;
  summary: string;
  content: string;
}

// Buttons Location
export const findMassSendBtn1 = (d: Document) =>
  d.querySelector && d.querySelector("button.mass_send");

export const findMassSendBtn2 = (d: Element) =>
  d.querySelector && d.querySelector(".mass-send__footer .weui-desktop-btn");

export const findMassSendBtn3 = (d: Element) => {
  if (d.querySelectorAll) {
    const btn = [
      ...d.querySelectorAll(".weui-desktop-dialog .weui-desktop-btn_primary"),
    ].find((t) => t.textContent === "继续群发");
    return btn;
  }
};

// Article Modification
export const getArticleIframe = (d: Document) => {
  const iframe = d.querySelector("iframe");
  if (!iframe || !iframe.contentWindow) return;
  //TODO : https://stackoverflow.com/questions/17197084/difference-between-contentdocument-and-contentwindow-javascript-iframe-frame-acc
  return iframe.contentWindow.document;
};
const textPrefix = "本文已同步于 ";

const isHardcodeText = (p: HTMLParagraphElement) => {
  return p.textContent?.startsWith(textPrefix);
};

export const appendOnChainUrl = (d: Document, url: string) => {
  const iframe = getArticleIframe(d);
  if (!iframe) return null;
  const appended = [...iframe.querySelectorAll("p")].find((p) =>
    isHardcodeText(p)
  );
  if (appended) {
    //TODO: fix url
    return;
  }

  const span = document.createElement("span");
  span.setAttribute("style", "font-size: 12px;");
  span.textContent = `${textPrefix}${url}`;
  const newNode = document.createElement("p");
  newNode.appendChild(span);
  iframe.querySelector("body")?.appendChild(newNode);
};

export const appendSyncingNotice = (d: Document) => {
  const location = [...d.querySelectorAll(".dialog_bd")].find((n) =>
    n.innerHTML.includes("扫码后")
  );
  if (!location) return;
  const newNode = d.createElement("p");
  newNode.setAttribute("class", "tc syncing");
  newNode.setAttribute("style", "color: red;");
  newNode.textContent = `备份中......`;
  location.appendChild(newNode);
};

export const appendSucceedNotice = (d: Document, url: string) => {
  const location = [...d.querySelectorAll(".dialog_bd")].find((n) =>
    n.innerHTML.includes("扫码后")
  );
  if (!location) return;
  const syncingText = location.querySelector(".syncing");
  if (syncingText) location.removeChild(syncingText);
  const newNode = d.createElement("p");
  newNode.setAttribute("class", "tc");
  newNode.setAttribute("style", "color: red;");
  newNode.textContent = `已成功备份于： ${url}`;
  location.appendChild(newNode);
};

export const extractArticle = (d: Document): Article | null => {
  const title = (d.querySelector("#js_title_main textarea") as HTMLInputElement)
    .value;

  const author = (d.querySelector("#js_author_area input") as HTMLInputElement)
    .value;

  const summary = (
    d.querySelector("#js_description_area textarea") as HTMLInputElement
  ).value;

  const iframe = getArticleIframe(d);
  if (!iframe) return null;

  // Filter will preserve the original array order
  // https://stackoverflow.com/questions/39712160/does-javascript-filter-preserve-order
  const sections = [...iframe.querySelectorAll("p")].filter(
    (p) => !isHardcodeText(p)
  );
  const content = sections
    .map((node) =>
      node.outerHTML.replace(/<mpchecktext(.*)<\/mpchecktext>/, "")
    )
    .join("<br>");

  let node = d.querySelector(".js_cover_preview");
  if (!node) return null;
  const cover = node["style"]["background-image"].split('"')[1].split("?")[0];
  return {
    title,
    author,
    content,
    cover,
    summary,
  };
};

// Error Panel
const addErrMsg = (
  wrapNode: HTMLDivElement,
  errMsg: "InvalidPrivateKey" | "BalanceNotEnough" | "UnknownError"
) => {
  if (errMsg === "BalanceNotEnough") {
    const span1 = document.createElement("span");
    span1.textContent = "⚠️ 由于您账户的$CSB不足，备份将不会成功。请先去";
    const aNode = document.createElement("a");
    aNode.setAttribute("href", "https://faucet.crossbell.io");
    aNode.textContent = "水龙头(https://faucet.crossbell.io)";
    aNode.setAttribute("style", "color: #940000;");
    aNode.setAttribute("target", "_blank");
    const span2 = document.createElement("span");
    span2.textContent = "领取。";
    wrapNode.appendChild(span1);
    wrapNode.appendChild(aNode);
    wrapNode.appendChild(span2);
  } else if (errMsg === "InvalidPrivateKey") {
    wrapNode.textContent =
      "⚠️ 由于您的私钥设置不当，备份将不会成功。请前往脚本源码页面手动添加私钥。";
  }
};

export const makeErrorPanel = (
  d: Document,
  errMsg: "InvalidPrivateKey" | "BalanceNotEnough" | "UnknownError"
) => {
  const newNode = d.createElement("div");
  newNode.setAttribute(
    "style",
    `margin-top: -15px;
    padding: 0 20px 0 20px;
    color: red;
    text-align: right;`
  );
  d.querySelector("#js_button_area")?.appendChild(newNode);
  addErrMsg(newNode, errMsg);
};
