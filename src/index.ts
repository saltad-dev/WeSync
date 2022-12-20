import { predictPostUrl, save, setUp } from "./chain";
import {
  findMassSendBtn1,
  findMassSendBtn2,
  findMassSendBtn3,
  extractArticle,
  Article,
  appendOnChainUrl,
  makeErrorPanel,
  appendSucceedNotice,
  appendSyncingNotice,
} from "./wx";

const newBtnText = "备份并群发";
console.log("injecting wx");

const main = async () => {
  let errMsg: "InvalidPrivateKey" | "BalanceNotEnough" | "UnknownError" | null;
  try {
    errMsg = await setUp();
  } catch (e) {
    errMsg = "UnknownError";
  }

  if (errMsg) {
    makeErrorPanel(document, errMsg);
    console.log("Fail to initialize.");
    return;
  }

  let article: Article | null;
  const vueApp = window.document.querySelector("#vue_app");
  if (!vueApp) return;

  const changeMassSendBtnsText = (event) => {
    const btn2 = findMassSendBtn2(event.target);
    const btn3 = findMassSendBtn3(event.target);
    if (btn2) {
      // removeEventListener should be previous than
      // the change of btn.textContent because that
      // change would trigger the listener again
      vueApp.removeEventListener("DOMNodeInserted", changeMassSendBtnsText);
      btn2.textContent = newBtnText;
    }
    if (btn3) {
      btn3.textContent = "继续" + newBtnText;
      (btn3 as HTMLElement).onclick = async function () {
        if (article) {
          appendSyncingNotice(document);
          const newUrl = await save(article.content);
          appendSucceedNotice(document, newUrl);
        }
      };
    }
  };

  vueApp.addEventListener("DOMNodeInserted", changeMassSendBtnsText);

  appendOnChainUrl(document, predictPostUrl());

  const massSend = findMassSendBtn1(document);
  if (!massSend) return;
  massSend.textContent = newBtnText;

  (massSend as HTMLElement).onclick = function () {
    article = extractArticle(document);
  };
};

main();
