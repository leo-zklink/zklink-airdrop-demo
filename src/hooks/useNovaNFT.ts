import {
  TRADEMARK_NFT_CONTRACT,
  NOVA_CHAIN_ID,
  MYSTERY_BOX_CONTRACT,
  MYSTERY_BOX_CONTRACT_V2,
  BOOSTER_NFT_CONTRACT,
  BOOSTER_NFT_CONTRACT_V2,
  LYNKS_NFT_CONTRACT,
  IS_MAINNET,
  LYNKS_METADATA_PREFIX,
} from "@/constants";
import {
  usePublicClient,
  useWalletClient,
  useAccount,
  useBalance,
} from "wagmi";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useState, useMemo } from "react";
import NovaTrademarkNFT from "@/constants/abi/NovaTrademarkNFT.json";
import NovaBoosterNFT from "@/constants/abi/NovaBoosterNFT.json";
import NovaLynksNFT from "@/constants/abi/NovaLynksNFT.json";
import NovaMysteryBoxNFT from "@/constants/abi/NovaMysteryBoxNFT.json";
import IERC721 from "@/constants/abi/IERC721.json";
import { config } from "@/constants/networks";
import { BigNumber, ethers } from "ethers";
import { zkSyncProvider } from "./zksyncProviders";
import {
  Hash,
  getContract,
  GetContractReturnType,
  WriteContractParameters,
  encodeFunctionData,
  Abi,
} from "viem";
import { formatBalance, getNovaDefaultProvider, sleep } from "@/utils";
import axios from "axios";

/**
 * fro trademark nft and mytestory box nft(booster and lynks nft)
 */
export type TrademarkMintParams = {
  tokenId: number;
  nonce: number;
  signature: string;
  expiry: number;
};
export type MysteryboxOpenParams = {
  tokenId?: number;
  nonce: number;
  signature: string;
  expiry: number;
};
export type MysteryboxMintParams = {
  tokenId?: number;
  nonce: number;
  signature: string;
  expiry: number;
};

const _provider = getNovaDefaultProvider();
const useNovaDrawNFT = () => {
  const { chainId } = useAccount();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [isTrademarkApproved, setIsTrademarkApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const publicClient = usePublicClient({ config, chainId: NOVA_CHAIN_ID });
  const { data: walletClient } = useWalletClient();

  const { data: nativeTokenBalance } = useBalance({
    config,
    address: address as `0x${string}`,
    chainId: NOVA_CHAIN_ID,
    token: undefined,
  });

  const novaETHBalance = useMemo(() => {
    if (nativeTokenBalance) {
      return formatBalance(nativeTokenBalance?.value ?? 0n, 18);
    }
    return 0;
  }, [nativeTokenBalance]);

  const trademarkNFT = useMemo(() => {
    if (!publicClient) return null;
    return getContract({
      address: TRADEMARK_NFT_CONTRACT as Hash,
      abi: NovaTrademarkNFT,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });
  }, [publicClient, walletClient]);

  const boosterNFT = useMemo(() => {
    if (!publicClient) return null;
    return getContract({
      address: BOOSTER_NFT_CONTRACT as Hash,
      abi: NovaBoosterNFT,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });
  }, [publicClient, walletClient]);

  const boosterNFTV2 = useMemo(() => {
    if (!publicClient) return null;
    return getContract({
      address: BOOSTER_NFT_CONTRACT_V2 as Hash,
      abi: NovaBoosterNFT,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });
  }, [publicClient, walletClient]);

  const lynksNFT = useMemo(() => {
    if (!publicClient) return null;
    return getContract({
      address: LYNKS_NFT_CONTRACT as Hash,
      abi: NovaLynksNFT,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });
  }, [publicClient, walletClient]);

  const mysteryBoxNFT = useMemo(() => {
    if (!publicClient) return null;
    return getContract({
      address: MYSTERY_BOX_CONTRACT as Hash,
      abi: NovaMysteryBoxNFT,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });
  }, [publicClient, walletClient]);

  const mysteryBoxNFTV2 = useMemo(() => {
    if (!publicClient) return null;
    return getContract({
      address: MYSTERY_BOX_CONTRACT_V2 as Hash,
      abi: NovaMysteryBoxNFT,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });
  }, [publicClient, walletClient]);

  const getLynksNFT = useCallback(
    async (address: string) => {
      if (!lynksNFT) return [];
      try {
        const balance = await lynksNFT.read.balanceOf([address]);
        if (BigNumber.from(balance).eq(0)) {
          return;
        }

        const tokenIds = await Promise.all(
          new Array(Number(balance))
            .fill(undefined)
            .map((_, index) =>
              lynksNFT.read.tokenOfOwnerByIndex([address, index])
            )
        );
        console.log("tokenIds: ", tokenIds);
        const uris = (await Promise.all(
          new Array(tokenIds.length)
            .fill(undefined)
            .map((_, index) => lynksNFT.read.tokenURI([tokenIds[index]]))
        )) as string[];
        console.log("token uris: ", uris);

        const nftRes = await Promise.all(
          uris.map((item: string) =>
            axios.get(
              `${LYNKS_METADATA_PREFIX}/${item.substring(
                item.lastIndexOf("/") + 1
              )}`
              // `/lynknft-test/${item.substring(item.lastIndexOf("/") + 1)}`
            )
          )
        );
        const nfts = nftRes.map((item) => item.data);
        console.log("nfts: ", nfts);
        const map: Record<string, { name: string; balance: number }> = {};
        for (const nft of nfts) {
          if (!map[nft.name]) {
            map[nft.name] = { name: nft.name, balance: 1 };
          } else {
            map[nft.name].balance++;
          }
        }
        return Object.values(map);
      } catch (e) {
        console.log(e);
        // return [];
        throw new Error("GET_LYNKS_ERROR");
      }
    },
    [lynksNFT]
  );

  const getMysteryboxNFT = useCallback(
    async (address: string) => {
      if (!mysteryBoxNFT) return;
      const balance = await mysteryBoxNFT.read.balanceOf([address]);
      if (BigNumber.from(balance).eq(0)) {
        return;
      }

      const tokenIds = await Promise.all(
        new Array(Number(balance))
          .fill(undefined)
          .map((_, index) =>
            mysteryBoxNFT.read.tokenOfOwnerByIndex([address, index])
          )
      );
      console.log("tokenIds: ", tokenIds);

      return tokenIds.map((item) => Number(item));
    },
    [mysteryBoxNFT]
  );

  const getMysteryboxNFTV2 = useCallback(
    async (address: string) => {
      if (!mysteryBoxNFTV2) return;
      const balance = await mysteryBoxNFTV2.read.balanceOf([address]);
      if (BigNumber.from(balance).eq(0)) {
        return;
      }

      const tokenIds = await Promise.all(
        new Array(Number(balance))
          .fill(undefined)
          .map((_, index) =>
            mysteryBoxNFTV2.read.tokenOfOwnerByIndex([address, index])
          )
      );
      console.log("tokenIds: ", tokenIds);

      return tokenIds.map((item) => Number(item));
    },
    [mysteryBoxNFTV2]
  );

  const insertEstimateFee = async (tx: WriteContractParameters) => {
    const txData = encodeFunctionData({
      abi: tx.abi,
      functionName: tx.functionName,
      args: tx.args,
    });
    const fee = await zkSyncProvider.attachEstimateFee(
      IS_MAINNET ? "https://rpc.zklink.io" : "https://sepolia.rpc.zklink.io"
    )({
      from: address as `0x${string}`,
      to: tx.address as `0x${string}`,
      value: "0x00",
      data: txData,
    });
    console.log("zksync chain fee for ETH", fee);

    tx.maxFeePerGas = fee.maxFeePerGas.toBigInt();
    tx.maxPriorityFeePerGas = fee.maxPriorityFeePerGas.toBigInt();
    tx.gas = fee.gasLimit.toBigInt();
  };

  const sendTrademarkMintTx = async (params: TrademarkMintParams) => {
    if (!address) return;
    const isLynks = params?.tokenId === 88;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: isLynks ? LYNKS_NFT_CONTRACT : TRADEMARK_NFT_CONTRACT,
        abi: (isLynks ? NovaLynksNFT : NovaTrademarkNFT) as Abi,
        functionName: isLynks ? "safeMintWithAuth" : "safeMint",
        args: isLynks
          ? [address, params.nonce, params.expiry, params.signature]
          : [
              address,
              params.nonce,
              params.tokenId,
              1,
              params.expiry,
              params.signature,
            ],
      };
      await insertEstimateFee(tx);
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendTrademarkMintTxV2 = async (params: TrademarkMintParams) => {
    if (!address) return;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: TRADEMARK_NFT_CONTRACT,
        abi: NovaTrademarkNFT,
        functionName: "safeMint2",
        args: [
          address,
          params.nonce,
          params.tokenId,
          1,
          params.expiry,
          params.signature,
        ],
      };
      await insertEstimateFee(tx);
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendOldestFriendsTrademarkMintTx = async (
    params: TrademarkMintParams & { mintType?: number }
  ) => {
    if (!address) return;
    const isLynks = params?.tokenId === 88;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: isLynks ? LYNKS_NFT_CONTRACT : TRADEMARK_NFT_CONTRACT,
        abi: (isLynks ? NovaLynksNFT : NovaTrademarkNFT) as Abi,
        functionName: isLynks ? "safeMintWithAuth" : "safeMintCommon",
        args: isLynks
          ? [address, params.nonce, params.expiry, params.signature]
          : [
              address,
              params.nonce,
              params.tokenId,
              1,
              params.expiry,
              params.signature,
              params.mintType,
            ],
      };
      await insertEstimateFee(tx);
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendEcoBoxMintTx = async (
    params: TrademarkMintParams & { mintType?: number }
  ) => {
    if (!address) return;
    const isLynks = params?.tokenId === 88;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: isLynks ? LYNKS_NFT_CONTRACT : TRADEMARK_NFT_CONTRACT,
        abi: (isLynks ? NovaLynksNFT : NovaTrademarkNFT) as Abi,
        functionName: isLynks ? "safeMintWithAuth" : "safeMintCommon",
        args: isLynks
          ? [address, params.nonce, params.expiry, params.signature]
          : [
              address,
              params.nonce,
              params.tokenId,
              1,
              params.expiry,
              params.signature,
              params.mintType,
            ],
      };
      await insertEstimateFee(tx);
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMysteryBurnTx = async (tokenId: number) => {
    if (!address) return;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: MYSTERY_BOX_CONTRACT as Hash,
        abi: NovaMysteryBoxNFT as Abi,
        functionName: "burn",
        args: [tokenId],
      };

      await insertEstimateFee(tx);
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMysteryBurnTxV2 = async (tokenId: number) => {
    if (!address) return;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: MYSTERY_BOX_CONTRACT_V2 as Hash,
        abi: NovaMysteryBoxNFT as Abi,
        functionName: "burn",
        args: [tokenId],
      };

      await insertEstimateFee(tx);
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMysteryMintTx = async (params: MysteryboxMintParams) => {
    if (!address) return;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: MYSTERY_BOX_CONTRACT as Hash,
        abi: NovaMysteryBoxNFT,
        functionName: "safeMint",
        args: [params.nonce, params.expiry, params.signature],
      };

      await insertEstimateFee(tx);
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMysteryMintTxV2 = async (params: MysteryboxMintParams) => {
    if (!address) return;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: MYSTERY_BOX_CONTRACT_V2 as Hash,
        abi: NovaMysteryBoxNFT,
        functionName: "safeMint",
        args: [params.nonce, params.expiry, params.signature],
      };

      await insertEstimateFee(tx);
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMysteryOpenMintTx = async (params: MysteryboxOpenParams) => {
    if (!address) return;
    const isLynks = !params.tokenId;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: (isLynks ? LYNKS_NFT_CONTRACT : BOOSTER_NFT_CONTRACT) as Hash,
        abi: isLynks ? NovaLynksNFT : NovaBoosterNFT,
        functionName: isLynks ? "safeMintWithAuth" : "safeMint",
        args: isLynks
          ? [address, params.nonce, params.expiry, params.signature]
          : [
              address,
              params.nonce,
              params.tokenId,
              1,
              params.expiry,
              params.signature,
            ],
      };
      await insertEstimateFee(tx);
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMysteryOpenMintTxV2 = async (params: MysteryboxOpenParams) => {
    console.log("sendMysteryOpenMintTxV2", params);
    if (!address) return;
    const isLynks = params?.tokenId === 88;
    const isTrademark = params?.tokenId && Number(params.tokenId) < 5;

    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: (isLynks
          ? LYNKS_NFT_CONTRACT
          : isTrademark
          ? TRADEMARK_NFT_CONTRACT
          : BOOSTER_NFT_CONTRACT_V2) as Hash,
        abi: isLynks
          ? NovaLynksNFT
          : isTrademark
          ? NovaTrademarkNFT
          : NovaBoosterNFT,
        functionName: isLynks
          ? "safeMintWithAuth"
          : isTrademark
          ? "safeMint2"
          : "safeMint",
        args: isLynks
          ? [address, params.nonce, params.expiry, params.signature]
          : [
              address,
              params.nonce,
              params.tokenId,
              1,
              params.expiry,
              params.signature,
            ],
      };
      await insertEstimateFee(tx);
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendUpgradeSBTTx = async (address: string) => {
    if (!address) return;
    try {
      setLoading(true);
      const tx: WriteContractParameters = {
        address: LYNKS_NFT_CONTRACT as Hash,
        abi: NovaLynksNFT,
        functionName: "safeMint",
        args: [address],
      };
      await insertEstimateFee(tx);
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      await sleep(1000); //wait to avoid waitForTransactionReceipt failed
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };

  const sendTrademarkApproveTx = async (address: string) => {
    if (!address) return;
    try {
      setIsApproving(true);
      const tx: WriteContractParameters = {
        address: TRADEMARK_NFT_CONTRACT as Hash,
        abi: NovaTrademarkNFT,
        functionName: "setApprovalForAll",
        args: [LYNKS_NFT_CONTRACT, true],
      };
      const hash = (await walletClient?.writeContract(tx)) as `0x${string}`;
      const res = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(res);
      setIsTrademarkApproved(true);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      setIsApproving(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (address && trademarkNFT) {
        const isApproved = (await trademarkNFT.read.isApprovedForAll([
          address,
          LYNKS_NFT_CONTRACT,
        ])) as boolean;
        setIsTrademarkApproved(isApproved);
      }
    })();
  }, [address, trademarkNFT]);

  return {
    trademarkNFT,
    boosterNFT,
    boosterNFTV2,
    lynksNFT,
    mysteryBoxNFT,
    mysteryBoxNFTV2,
    publicClient,
    getLynksNFT,
    sendTrademarkMintTx,
    sendTrademarkMintTxV2,
    sendMysteryOpenMintTx,
    sendMysteryOpenMintTxV2,
    sendMysteryMintTx,
    sendMysteryMintTxV2,
    loading,
    novaETHBalance,
    getMysteryboxNFT,
    getMysteryboxNFTV2,
    sendUpgradeSBTTx,
    isTrademarkApproved,
    sendTrademarkApproveTx,
    isApproving,
    sendMysteryBurnTx,
    sendMysteryBurnTxV2,
    sendOldestFriendsTrademarkMintTx,
    sendEcoBoxMintTx,
  };
};

export default useNovaDrawNFT;
