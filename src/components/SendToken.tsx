"use client";

import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { TokenAbi } from "@/abi/TokenAbi";

const SendToken = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionLink, setTransactionLink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string>("0");

  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
  const pkey = process.env.NEXT_PUBLIC_PKEY;
  const rpc = process.env.NEXT_PUBLIC_RPC;

  // Function to fetch the token balance
  const fetchBalance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(rpc);
      const wallet = new ethers.Wallet(pkey!, provider);
      const tokenContract = new ethers.Contract(
        tokenAddress!,
        TokenAbi,
        wallet
      );
      const balanceBigNumber = await tokenContract.balanceOf(wallet.address);
      const formattedBalance = ethers.formatUnits(balanceBigNumber, 18); // Adjust decimals as needed
      setBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setErrorMessage("An unknown error occurred");
    }
  };

  useEffect(() => {
    fetchBalance(); // Fetch the balance on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setTransactionLink(null);

    try {
      const isValidAddress = ethers.isAddress(recipient);
      if (!isValidAddress) {
        setErrorMessage("Invalid recipient address.");
        return;
      }

      const amountNum = parseFloat(amount);

      if (amountNum == 0) {
        setErrorMessage("Amount cannot be zero.");
        return;
      }

      if (amountNum > 10000) {
        setErrorMessage("Amount cannot exceed 10,000 tokens.");
        return;
      }

      const provider = new ethers.JsonRpcProvider(rpc);
      const wallet = new ethers.Wallet(pkey!, provider);
      const tokenContract = new ethers.Contract(
        tokenAddress!,
        TokenAbi,
        wallet
      );
      const tokenAmount = ethers.parseUnits(amount, 18); // Adjust decimals as needed
      const tx = await tokenContract.transfer(recipient, tokenAmount);
      const receipt = await tx.wait();

      if (receipt) {
        const explorerLink = `${process.env.NEXT_PUBLIC_EXPLORER_LINK}/tx/${tx.hash}`;
        setTransactionLink(explorerLink);
        // Reset recipient and amount fields
        setRecipient("");
        setAmount("");
        fetchBalance(); // Refetch the balance after successful transaction
      }
    } catch (error) {
      console.error("Error sending tokens:", error);
      setErrorMessage("An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
        setRecipient("");
        setAmount("");
      }, 2000);
    }
    if (transactionLink) {
      setTimeout(() => {
        setTransactionLink(null);
      }, 2000);
    }
  }, [errorMessage, transactionLink]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-200 rounded-xl shadow-[4px_4px_0_0_#00000026] p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          DNA Token
        </h1>
        <div className="text-center mb-4 text-gray-800">
          Balance: {Number(balance).toFixed(2)} Tokens
        </div>
        <form onSubmit={handleSend} className="space-y-6">
          <div>
            <label
              htmlFor="recipient"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipient Address
            </label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              placeholder="0x..."
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount (Max: 10,000)
            </label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                // Allow numbers with a maximum of 18 decimals
                if (/^\d*\.?\d{0,18}$/.test(value)) {
                  setAmount(value);
                }
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              placeholder="0.0"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D4A674] flex justify-center text-[16px] md:text-[20px] font-[700] text-black py-2 px-4 rounded-md focus:outline-none transition duration-150 ease-in-out transform hover:scale-105"
          >
            {isLoading ? "Sending..." : "Send Tokens"}
          </button>
        </form>
        {/* Success or error messages */}
        {/* {transactionLink && (
          <div className="text-green-600 text-center mb-4 mt-2">
            Transaction successful! Check it on{" "}
            <a
              href={transactionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-green-600"
            >
              Etherscan
            </a>
          </div>
        )} */}
        {errorMessage && (
          <div className="text-red-600 text-center mb-4 mt-2">
            Error: {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SendToken;
