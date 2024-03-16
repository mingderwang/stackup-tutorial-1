import { ethers, Wallet, Contract } from "ethers";
import { Presets, Client, type ISigner } from "userop";

const rpcUrl = process.env.RPC_URL || "https://rpc.goerli.linea.build/";

async function sendUserOp(signer: Wallet, contract: Contract) {

  // Initialize userop builder
  var builder = await Presets.Builder.Kernel.init(signer, rpcUrl);
  const address = builder.getSender();
  console.log(`Account address: ${address}`);
  const SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x23adcfF090C9244672114d3fB89D28a018F528FE"

  const call = {
      to: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
      value: ethers.constants.Zero,
      data: contract.interface.encodeFunctionData({
        abi: [{
          inputs: [{ name: "owner", type: "address" }, { name: "salt", type: "uint256" }],
          name: "createAccount",
          outputs: [{ name: "ret", type: "address" }],
          stateMutability: "nonpayable",
          type: "function",
         }],
       args: [owner.address, 0n]
     })
  };
  
  // Build & send
  const client = await Client.init(rpcUrl);
  const res = await client.sendUserOperation(builder.execute(call), {
    onBuild: (op) => console.log("Signed UserOperation:", op),
  });

  console.log(`UserOpHash: ${res.userOpHash}`);
  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
}
