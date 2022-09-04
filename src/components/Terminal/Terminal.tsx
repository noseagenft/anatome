import React, { useState, useEffect } from "react";
import { NOSES } from "../../hashList";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

const Terminal = () => {
  const [commandHistory, setCommandHistory] = useState([""]);
  const [outputHistory, setOutputHistory] = useState([
    "Welcome to the command line interface",
    "Type <i><b>help</b></i> for a list of commands",
    "<br />",
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [currentCommandHistoryIndex, setCurrentCommandHistoryIndex] =
    useState(0);
  const { publicKey } = useWallet();

  const truncateWalletAddress = (pubKey: PublicKey): string => {
    const b58pkey = pubKey.toBase58();
    return `${b58pkey.substring(0, 4)}..${b58pkey.substring(
      b58pkey.length - 4,
      b58pkey.length
    )}`;
  };

  const getDirectoryLabel = (pubKey: PublicKey | null): string => {
    return `${
      pubKey ? truncateWalletAddress(pubKey) : "guest"
    }@solana:~/anatome$ `;
  };

  interface CommandResponseType {
    help: string;
    output?: string;
    link?: string;
  }

  const commandResponseMapping: {
    [key: string]: CommandResponseType;
  } = {
    about: {
      help: "read a brief description of the project",
      output: `<b>Anatome</b> is an NFT project championing the message of self-love and empowerment.
      <br/><br/>
      The project is a saga of 7 collections made up of various body parts. With the final one being a merge of all the parts into a 3D representation of you in the metaverse.
      <br/><br/>
      Read more here: <a href="https://noseage.gitbook.io/nose-age-nft-aitepaper/" target="_blank" rel="noreferrer noopener">Nose Age Aitepaper (to be updated to Anatome)</a>`,
    },
    team: {
      help: `get to know who's running the project`,
      output: `<a href="https://twitter.com/nosnaj" target="_blank" rel="noreferrer noopener">@nosenudge.sol</a> - Co-founder, coder, artist of the noses.<br/>
      <a href="https://twitter.com/ftWINyan" target="_blank" rel="noreferrer noopener">@ftWINyan</a> - Co-founder, designer, marketer.<br/>
      <a href="https://twitter.com/realhungrysheep" target="_blank" rel="noreferrer noopener">@hungrysheep</a> - Partner artist of Eyes Age.<br/>`,
    },
    collections: {
      help: "status of collections under the Anatome saga",
      output: `
      <b style="color: #1aff1a">[ STAKING]</b> <b>Nose Age</b> - <i>456 Noses sniffing for $SNIFF to gather the rest of the body parts. Genesis collection.</i><br/>
      <b style="color: #e78710">[ BUIDLNG]</b> <b>Eyes Age</b> - <i>??? Eyes, looking around on the Solana blockchain, enjoying good art.</i><br/>
      <b style="color: #ff4500">[ UNKNOWN]</b> <b>Lips Age</b> - <i>The generative(?) art <b>lips</b> collection of unknown size.</i><br/>
      <b style="color: #ff4500">[ UNKNOWN]</b> <b>Ears Age</b> - <i>The generative(?) art <b>ears</b> collection of unknown size.</i><br/>
      <b style="color: #ff4500">[ UNKNOWN]</b> <b>VisAge</b> - <i>Combine the above to get generative(?) art <b>face</b> collection of unknown size.</i><br/>
      <b style="color: #ff4500">[ UNKNOWN]</b> <b>TorsAge</b> - <i>The generative(?) art <b>torso</b> collection of unknown size.</i><br/>
      <b style="color: #ff4500">[ UNKNOWN]</b> <b>LegsAge</b> - <i>The generative(?) art <b>legs</b> collection of unknown size.</i><br/>
      <b style="color: #ff4500">[ UNKNOWN]</b> <b>Anatome</b> - <i>Merge VisAge, TorsAge, and LegsAge into a 3D generative(?) avatar <b>legs</b> collection of unknown size.</i><br/>
      `,
    },
    sniff: {
      help: "opens the sniffing (staking) site for Nose Age",
      output: "Sniffing site opened in a new tab.",
      link: "https://sniff.noseagenft.com/",
    },
    picknose: {
      help: "picks a random nose from the collection",
    },
    shop: {
      help: "view the $SNIFF shop (stocking in progress)",
      output:
        "The $SNIFF shop is still being stocked at the moment. Check back soon!",
    },
    connect: {
      help: "connect wallet",
      output: "Connecting wallet...",
    },
    disconnect: {
      help: "disconnect wallet",
      output: "Disconnecting wallet...",
    },
    aitepaper: {
      help: "opens the aitepaper in a new tab",
      output: "Aitepaper opened in a new tab.",
      link: "https://noseage.gitbook.io/nose-age-nft-aitepaper/",
    },
    socials: {
      help: "displays links of all project socials",
      output: `
      <a href="https://twitter.com/anatome_fun" target="_blank" rel="noreferrer noopener">Twitter</a><br/>
      <a href="https://www.instagram.com/anatome.fun" target="_blank" rel="noreferrer noopener">Instagram</a><br/>
      <a href="https://www.facebook.com/anatome.fun" target="_blank" rel="noreferrer noopener">Facebook</a><br/>
      `,
    },
    discord: {
      help: "opens the discord invite link",
      output: "Discord invite link opened in a new tab.",
      link: "https://discord.gg/t5wc8x2Htz",
    },
    magiceden: {
      help: "opens the Nose Age Magic Eden page in a new tab",
      output: "Magic Eden page opened in a new tab.",
      link: "https://magiceden.io/marketplace/nose_age",
    },
    shutdown: {
      help: "closes this terminal (redirects to Google)",
    },
    help: {
      help: "shows this list of commands and what they do",
    },
    clear: {
      help: "clears the output and command history",
      output: "Output and command history cleared.",
    },
    look: {
      output: "This is not a text-based game lol.",
      help: "",
    },
  };

  const handleCommandSubmit = async (event: Event) => {
    event.preventDefault();
    setCommandHistory([...commandHistory, currentCommand]);
    setCurrentCommandHistoryIndex(commandHistory.length + 1);
    if (currentCommand === "") {
      return;
    } else if (currentCommand === "clear" || currentCommand === "reset") {
      setCommandHistory([]);
      setOutputHistory(["Output and command history cleared.", "<br />"]);
      setCurrentCommand("");
      setCurrentCommandHistoryIndex(0);
    } else if (currentCommand === "help") {
      const commandAndHelp = Object.entries(commandResponseMapping)
        .map(([command, commandResponse]) => {
          return commandResponse.help
            ? `<div style="display: flex; justify-content: space-between; max-width: 480px;"><b>${command}</b>${commandResponse.help}</div>`
            : "";
        })
        .filter(Boolean);
      setOutputHistory([
        ...outputHistory,
        `${getDirectoryLabel(publicKey)}${currentCommand}`,
        ...commandAndHelp,
        "<br />",
      ]);
      setCurrentCommand("");
    } else if (currentCommand === "shutdown" || currentCommand === "fuck") {
      setOutputHistory([
        ...outputHistory,
        `${getDirectoryLabel(publicKey)}${currentCommand}`,
        "Redirecting to google.com...",
        "<br />",
      ]);
      setCurrentCommand("");
      setTimeout(() => {
        window.location.href = "https://google.com";
      }, 1000);
    } else if (
      currentCommand === "picknose" ||
      currentCommand === "pick nose"
    ) {
      const randomizedNose = NOSES[Math.round(Math.random() * NOSES.length)];
      setOutputHistory([
        ...outputHistory,
        `${getDirectoryLabel(publicKey)}${currentCommand}`,
        "Picking your nose...",
        "<br />",
      ]);
      const pickedNose = await (
        await fetch(
          `https://api-mainnet.magiceden.dev/v2/tokens/${randomizedNose}`
        )
      ).json();
      setOutputHistory([
        ...outputHistory,
        `${getDirectoryLabel(publicKey)}${currentCommand}`,
        "Picked your nose... Click to view details on MagicEden.",
        "<br />",
        `<a href="https://magiceden.io/item-details/${randomizedNose}"><img src="${pickedNose.image}" width="320px" /></a>`,
        "<br />",
      ]);
      setCurrentCommand("");

      setTimeout(() => {
        window.scrollTo(0, window.document.body.scrollHeight);
      }, 2500);
    } else if (
      ["sudo rm -rf", "rm -rf /"].some((command) =>
        currentCommand.includes(command)
      )
    ) {
      setOutputHistory([
        ...outputHistory,
        `${getDirectoryLabel(publicKey)}${currentCommand}`,
        "Woah, woah! Calm down, there. Why are you trying to delete the entire system?",
        "<br />",
      ]);
      setCurrentCommand("");
    } else if (currentCommand === "connect") {
      if (publicKey) {
        setOutputHistory([
          ...outputHistory,
          `${getDirectoryLabel(publicKey)}${currentCommand}`,
          `Wallet <b>${publicKey.toBase58()}</b> already connected.`,
          `Type <b>disconnect</b> to disconnect wallet.`,
          `<br />`,
        ]);
      } else {
        setOutputHistory([
          ...outputHistory,
          `${getDirectoryLabel(publicKey)}${currentCommand}`,
          `<br />`,
        ]);
        const buttons = document.getElementsByTagName("button");
        buttons[0].click();
      }
      setCurrentCommand("");
    } else if (currentCommand === "disconnect") {
      if (!publicKey) {
        setOutputHistory([
          ...outputHistory,
          `${getDirectoryLabel(publicKey)}${currentCommand}`,
          `No wallet connected.`,
          `Type <b>connect</b> to connect a wallet.`,
          `<br />`,
        ]);
      } else {
        const buttons = document.getElementsByTagName("button");
        buttons[1].click();
        setOutputHistory([
          ...outputHistory,
          `${getDirectoryLabel(publicKey)}${currentCommand}`,
          `<br />`,
        ]);
      }
      setCurrentCommand("");
    } else {
      setOutputHistory([
        ...outputHistory,
        `${getDirectoryLabel(publicKey)}${currentCommand}`,
        (commandResponseMapping[currentCommand]?.output as string) ||
          `Unknown command: ${currentCommand}`,
        "<br />",
      ]);
      setCurrentCommand("");

      //process links
      if (commandResponseMapping[currentCommand]?.link) {
        window.open(commandResponseMapping[currentCommand].link, "_blank");
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, window.document.body.scrollHeight);
  }, [currentCommand]);

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleCommandSubmit(event);
    } else if (event.key === "ArrowUp") {
      setCurrentCommand(commandHistory[currentCommandHistoryIndex - 1] || "");
      if (currentCommandHistoryIndex > 0) {
        setCurrentCommandHistoryIndex(currentCommandHistoryIndex - 1);
      }
    } else if (event.key === "ArrowDown") {
      setCurrentCommand(commandHistory[currentCommandHistoryIndex + 1] || "");
      if (currentCommandHistoryIndex < commandHistory.length - 1) {
        setCurrentCommandHistoryIndex(currentCommandHistoryIndex + 1);
      }
    } else {
      setCurrentCommand(event.target.value);
    }
  };

  return (
    <div className="App">
      <div style={{ display: "none" }}>
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      <header>ANATOMΣ</header>
      <div>Nose Age [v1.456.2021]</div>
      <div>Eyes Age [v2.456.2022]</div>
      <div>(c) Anatome Corporation. All rights reserved.</div>
      <br />
      {outputHistory.map((output, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: output }} />
      ))}
      {getDirectoryLabel(publicKey)}
      <input
        type="text"
        value={currentCommand}
        onKeyDown={(e) => handleKeyPress(e)}
        onChange={(e) => setCurrentCommand(e.target.value)}
        autoFocus
      />
    </div>
  );
};

export default Terminal;
