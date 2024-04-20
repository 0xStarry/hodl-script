import {
    createPublicClient,
    createWalletClient,
    formatGwei,
    http,
    parseEther,
    parseGwei,
  } from "viem";
  import { privateKeyToAccount } from "viem/accounts";
  import { bsc } from "viem/chains";
  const txCount = 100; // 一次打几笔交易
  const frequency = 5000; // 几秒跑一次，1000是一秒
  let transport = http("https://bsc-dataseed.binance.org");
  const pubClient = createPublicClient({
    chain: bsc,
    transport,
  });
  // 这里放入自己的私钥
  let wallet = [
    '0x......'
  ];
  
  const client = createWalletClient({
    chain: bsc,
    transport,
  });
  
  const main = async () => {
    wallet.forEach(async (v) => {
      let privateKey = v;
      if (!v.startsWith("0x")) privateKey = `0x${privateKey}`;
      const account = privateKeyToAccount(privateKey);
      const address = account.address;
      const nonce = await pubClient.getTransactionCount({ address });
      console.log(`Address:${address},nonce:${nonce}`);
      for (let i = 0; i < txCount; ++i) {
        let res = await client.sendTransaction({
          account,
          to: "0x1832e00DfF829547E1F564f92401C2886F3236b4",
          gas: 155347,
          gasPrice: parseGwei("1"),
          // 这里放自己的payload
          data: "",
          value: parseEther("0.00182"),
          nonce: nonce + i,
        });
        //   console.log(`${address}成功,${res}`);
      }
    });
  };
  // main();
  setInterval(main, frequency);
  
  process
    .on("unhandledRejection", (reason, p) => {
      // console.error(reason, "Unhandled Rejection at Promise", p);
    })
    .on("uncaughtException", (err) => {
      // console.error(err, "Uncaught Exception thrown");
    });
  