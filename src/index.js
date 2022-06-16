// server/index.js
const path = require('path');
const express = require('express');
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const abipath = path.join(__dirname,"../public/Token.json");
const contract = require(abipath);
const PORT = process.env.PORT || 3000;

const app = express();
app.set("view engine","hbs");
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
app.use(express.json());
// app.use(require('body-parser').json());
const staticPath = path.join(__dirname,"../public")
console.log(staticPath);
app.use(express.static(staticPath));


app.get("", (req, res) => {
  res.render("index");
});


app.post("/x", (req, res) => {
  console.log(req.body.tokens);
  console.log(req.body.add);
  mintingToken(req.body.tokens,req.body.add);
  res.send({
    title : 'fetch working'
  });
});

//0x58b45e3fd21bd19d51397f41d78276cb06b8a538
const API_URL = 'https://eth-rinkeby.alchemyapi.io/v2/y1KY1IllQKgow_xVmrVQtEytJDB9THB4'; 
const PUBLIC_KEY = '0x60f94DBa25380610Dc4cBa80eEE249B6F1007E60';
const PRIVATE_KEY = 'ed8ab54004d7138bca3f8015e012defdf8461a289f866b2b4ad5a0dbd0bd1816';

const web3 = createAlchemyWeb3(API_URL);
console.log(JSON.stringify(abipath));
const contractAddress = "0x58b45e3fd21bd19d51397f41d78276cb06b8a538";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
// //create transaction
async function mintingToken(value,add) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce

//   //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mint(value,add).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}
