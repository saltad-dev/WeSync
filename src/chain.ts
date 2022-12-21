import { Contract, NoteMetadata } from "crossbell.js";
import { ethers } from "ethers";
/** Mock */
//#ifdef DEBUG
import { Network } from "crossbell.js";
import { Article } from "./wx";

const priKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
//0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

const info = Network.getCrossbellMainnetInfo();
info.chainId = 31337;
Network.getCrossbellMainnetInfo = () => info;
Network.jsonRpcAddress = "http://127.0.0.1:8545";
//#endif

/** Mock End */

/** Global vars */
let bal: string;
let contract: Contract;
let characterId: number;
let noteCount: number;
/** Global vars end */

export const setUpContract = async (priKey?: string) => {
  const c = new Contract(priKey);
  await c.connect();
  return c;
};

const getBal = async (user: string) => {
  const { data } = await contract.getBalance(user);
  return ethers.utils.formatEther(data);
};

const hasEnoughBal = async () => {
  const user = getUser();
  bal = await getBal(user);
  if (Number(bal) < 0.0005) {
    // 0.000128251 PostNote
    // 0.000327791 CreateCharacter
    return false;
  } else {
    return true;
  }
};

export const getUser = () => {
  const account = new ethers.Wallet(priKey);
  const user = account.address;
  return user;
};

const getNoteCount = async (characterId: number) => {
  const { data } = await contract.getCharacter(characterId);
  return data.noteCount;
};

export const setUpAccount = async () => {
  const user = getUser();
  const { data } = await contract.getPrimaryCharacterId(user);
  if (data !== 0) {
    characterId = data;
  } else {
    const hashCode = (s: string) =>
      s.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
    const token = window.location.toString().split("token=")[1].split("&")[0];
    const handle = "wxgzh-" + hashCode(token);
    const { data } = await contract.createCharacter(user, handle, "");
    characterId = data;
  }
  noteCount = await getNoteCount(characterId);
};

export const setUp = async () => {
  try {
    getUser();
  } catch (e) {
    return "InvalidPrivateKey";
  }

  contract = await setUpContract(priKey);

  if (!(await hasEnoughBal())) {
    return "BalanceNotEnough";
  }

  await setUpAccount();
  console.log("Contract connected. Logged in as " + characterId);
  return null;
};

const makeUrl = (characterId: number, noteId: number) =>
  `https://crossbell.io/notes/${characterId}-${noteId}`;

export const predictPostUrl = () => makeUrl(characterId, noteCount + 1);

export const save = async (article: Article) => {
  const { data } = await contract.postNote(characterId, {
    content: article.content,
    title: article.title,
    attachments: [
      {
        name: "cover",
        address: article.cover,
      },
    ],
    attributes: [
      {
        trait_type: "summary",
        value: article.summary,
      },
      {
        trait_type: "author",
        value: article.author,
      },
    ],
    // TODO
    // sources:
  } as NoteMetadata);
  return makeUrl(characterId, data.noteId);
};
