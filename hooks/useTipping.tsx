"use client";

import { useState } from "react";
import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";

export function useTipping() {
  const [isTipping, setIsTipping] = useState(false);
  const [tipDigest, setTipDigest] = useState<string | null>(null);
  const { sendTransaction, error: tipError } = useSendTransaction({
    mutation: {
      onSuccess: (hash) => {
        setTipDigest(hash);
        setIsTipping(false);
      },
      onError: () => {
        setIsTipping(false);
      },
    },
  });

  const handleTip = (toAddress: string, amount: string) => {
    if (!toAddress || !amount) {
      alert("Please enter a valid address and amount.");
      return;
    }

    setIsTipping(true);
    sendTransaction({
      to: toAddress as `0x${string}`,
      value: parseEther(amount),
    });
  };

  return {
    handleTip,
    isTipping,
    tipDigest,
    tipError,
  };
}
