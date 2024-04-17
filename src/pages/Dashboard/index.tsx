import styled from "styled-components";
import AssetsTable from "@/components/AssetsTable";
import { BgBox, BgCoverImg, CardBox } from "@/styles/common";
import { useEffect, useMemo, useState } from "react";
import ReferralList from "@/components/ReferralList";
import { RootState } from "@/store";
import {
  SupportToken,
  getAccountRefferalsTVL,
  getAccountTvl,
  getEigenlayerPoints,
  getExplorerTokenTvl,
  getGroupTvl,
  getPufferPoints,
  getReferralTvl,
  getRenzoPoints,
  getSupportTokens,
  getTokenPrice,
  getTotalTvlByToken,
  getMagPiePoints,
  getLayerbankPufferPoints,
  getRoyaltyBooster,
} from "@/api";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";
import NovaCharacter from "@/components/Dashboard/NovaCharacter";
import NovaPoints from "@/components/Dashboard/NovaPoints";
import StakingValue from "@/components/Dashboard/StakingValue";
import TvlSummary from "@/components/Dashboard/TvlSummary";
import GroupMilestone from "@/components/Dashboard/GroupMilestone";
import { formatNumberWithUnit } from "@/utils";
import NFTCard from "./components/NFTCard";
import NFTCardV2 from "./components/NFTCardV2";
import EcoDApps from "@/components/Dashboard/EcoDApps";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { setIsAdHide } from "@/store/modules/airdrop";
import { PUFFER_TOKEN_ADDRESS } from "@/constants";
import Banner from "@/components/Dashboard/Banner";
import useNovaPoints from "@/hooks/useNovaPoints";

const TabsBox = styled.div`
  .tab-item {
    color: #a9a9a9;
    font-family: Satoshi;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2rem; /* 133.333% */
    letter-spacing: 0.09rem;
    user-select: none;
    cursor: pointer;
    &.active,
    &:hover {
      color: #fff;
    }
  }
`;

export type TotalTvlItem = {
  symbol: string;
  tokenAddress: string;
  amount: string;
  tvl: string;
  type: string;
  yieldType: string;
  iconURL: string | null;
};

export type AccountTvlItem = {
  tvl: string;
  amount: string;
  tokenAddress: string;
  symbol: string;
  iconURL: string | null;
};

export enum TabType {
  Eco = 0,
  Assets = 1,
  NFTs = 2,
  Referral = 3,
}

export function DisclaimerFooter() {
  return (
    <div className="flex justify-between items-center">
      <div className="right-[6rem] bottom-[1rem] flex justify-end items-end">
        <div className="flex items-center gap-[1rem]">
          <a href="https://blog.zk.link/" target="_blank">
            <img src="/img/icon-medium.svg" className="w-[1rem] h-[1rem]" />
          </a>
          <a href="https://discord.com/invite/zklink" target="_blank">
            <img src="/img/icon-dc.svg" className="w-[1rem] h-[1rem]" />
          </a>
          <a href="https://t.me/zkLinkorg">
            <img src="/img/icon-tg.svg" className="w-[1rem] h-[1rem]" />
          </a>
          <a href="https://twitter.com/zkLink_Official" target="_blank">
            <img
              src="/img/icon-twitter.svg"
              className="w-[0.75rem] h-[0.75rem]"
            />
          </a>
          <a href="https://github.com/zkLinkProtocol" target="_blank">
            <img src="/img/icon-github.svg" className="w-[1rem] h-[1rem]" />
          </a>
        </div>
      </div>
      <Link to="/about?anchor=disclaimer">zkLink Nova Disclaimer</Link>
    </div>
  );
}

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const { invite, isAdHide } = useSelector((store: RootState) => store.airdrop);
  const [tabsActive, setTabsActive] = useState(0);
  const [totalTvlList, setTotalTvlList] = useState<TotalTvlItem[]>([]);
  const [stakingUsdValue, setStakingUsdValue] = useState(0);
  const [stakingEthValue, setStakingEthValue] = useState(0);
  const [referrersTvlList, setReferrersTvl] = useState([]);
  const [accountTvlData, setAccountTvlData] = useState<AccountTvlItem[]>([]);
  const [groupTvl, setGroupTvl] = useState(0);
  const [totalTvl, setTotalTvl] = useState(0);
  const [referralTvl, setReferralTvl] = useState(0);
  const [supportTokens, setSupportTokens] = useState<SupportToken[]>([]);
  const [ethUsdPrice, setEthUsdPrice] = useState(0);
  const [nftPhase, setNftPhase] = useState(2); // default: phase 2
  const adModal = useDisclosure();

  const {
    novaPoints,
    referPoints,
    layerbankNovaPoints,
    linkswapNovaPoints,
    trademarkPoints,
    okxPoints,
    kolPoints,
    totalNovaPoints,
  } = useNovaPoints();

  const navigatorTo = useNavigate();

  const getAccountRefferalsTVLFunc = async () => {
    if (!address) return;
    const res = await getAccountRefferalsTVL(address);
    if (res.result) {
      setReferrersTvl(res.result);
    }
  };

  // const getAccounTvlFunc = async () => {
  //   if (!address) return;
  //   const res = await getAccounTvl(address);
  // };

  const getAccountTvlFunc = async () => {
    let usdPrice = 0;
    const tokenList = await getExplorerTokenTvl(true);
    const ethToken = tokenList.find((item) => item.symbol === "ETH");
    if (ethToken) {
      const res = await getTokenPrice(ethToken.l2Address);
      usdPrice = +res.usdPrice || 0;
      setEthUsdPrice(usdPrice);
    }

    if (!address) return;

    const res = await getAccountTvl(address);
    const { result } = res;
    let data = [];
    if (result && Array.isArray(result) && result.length > 0) {
      data = result;
    }
    setAccountTvlData(data);

    let usd = 0;
    let eth = 0;
    data.forEach((item) => {
      usd += +item?.tvl;
      eth += +item?.tvl;
    });
    setStakingEthValue(eth);
    setStakingUsdValue(usd * usdPrice);
  };

  const getTotalTvlByTokenFunc = async () => {
    const res = await getTotalTvlByToken();
    const { result } = res;
    let arr = [];
    if (result && Array.isArray(result) && result.length > 0) {
      arr = result;
    }
    setTotalTvlList(arr);
  };

  const getGroupTvlFunc = async () => {
    if (!address) return;
    const res = await getGroupTvl(address);
    setGroupTvl(res?.result || 0);
  };

  const getReferralTvlFunc = async () => {
    if (!address) return;
    const res = await getReferralTvl(address);
    setReferralTvl(res?.result || 0);
  };

  const getSupportTokensFunc = async () => {
    const res = await getSupportTokens();
    if (res && Array.isArray(res)) {
      setSupportTokens(res);
    }
  };

  const getTotalTvlFunc = async () => {
    // const res = await getTotalTvl();
    // setTotalTvl(res?.result || 0);
    const res = await getExplorerTokenTvl(false);

    let num = 0;
    if (res.length > 0) {
      num = +parseInt(res[0].tvl);
    }

    setTotalTvl(num);
  };

  const getEthUsdPrice = async () => {
    const tokenList = await getExplorerTokenTvl(true);
    const ethToken = tokenList.find((item) => item.symbol === "ETH");
    if (ethToken) {
      const res = await getTokenPrice(ethToken.l2Address);
      setEthUsdPrice(+res.usdPrice || 0);
    }
  };

  const [pufferEigenlayerPoints, setPufferEigenlayerPoints] = useState(0);
  const getEigenlayerPointsFunc = async () => {
    if (!address) return;
    const { data } = await getEigenlayerPoints(address);
    console.log("getEigenlayerPointsFunc", data);
    if (data && data?.eigenlayer_points) {
      setPufferEigenlayerPoints(+data.eigenlayer_points);
    }
  };

  const [pufferPoints, setPufferPoints] = useState(0);
  const getPufferPointsFunc = async () => {
    if (!address) return;
    const { data } = await getPufferPoints(address);

    if (data && Array.isArray(data) && data.length > 0) {
      const obj = data.find((item) => (item.address = address));
      if (obj) {
        setPufferPoints(+obj.points);
      }
    }
  };

  const [magpiePointsData, setMagpiePointsData] = useState<{
    points: number;
    layerPoints: number;
  }>({
    points: 0,
    layerPoints: 0,
  });

  const getMagpiePointsFunc = async () => {
    if (!address) return;
    const { data } = await getMagPiePoints(address);
    if (data && Array.isArray(data) && data.length > 0) {
      setMagpiePointsData({
        points: data.reduce(
          (prev, cur) => prev + Number(cur.points.eigenpiePoints),
          0
        ),
        layerPoints: data.reduce(
          (prev, cur) => prev + Number(cur.points.eigenLayerPoints),
          0
        ),
      });
    }
  };

  const [renzoPoints, setRenzoPoints] = useState(0);
  const [renzoEigenLayerPoints, setRenzoEigenLayerPoints] = useState(0);
  const getRenzoPointsFunc = async () => {
    if (!address) return;
    const { data } = await getRenzoPoints(address);

    if (data && Array.isArray(data) && data.length > 0) {
      setRenzoPoints(
        data.reduce((prev, item) => prev + +item.points.renzoPoints, 0)
      );

      setRenzoEigenLayerPoints(
        data.reduce((prev, item) => prev + +item.points.eigenLayerPoints, 0)
      );
    }
  };

  const [layerbankPufferPoints, setLayerbankPufferPoints] = useState(0);
  const [layerbankEigenlayerPoints, setLayerbankEigenlayerPoints] = useState(0);

  const getLayerbankPufferPointsFunc = async () => {
    if (!address) return;
    const { data } = await getLayerbankPufferPoints(
      address,
      PUFFER_TOKEN_ADDRESS
    );
    if (data && Array.isArray(data) && data.length > 0) {
      const points = data.reduce((prev, item) => prev + Number(item.points), 0);
      console.log("setLayerbankPufferPoints", points);
      setLayerbankPufferPoints(points);
    }
  };

  const [royaltyBooster, setRoyaltyBooster] = useState(0);
  const getRoyaltyBoosterFunc = async () => {
    if (!address) return;
    const { result } = await getRoyaltyBooster(address);
    if (result?.loyaltyBooster) {
      setRoyaltyBooster(Number(result.loyaltyBooster) || 0);
    }
  };

  /**
   * Init: Get data from server
   */
  useEffect(() => {
    getEthUsdPrice();
    getSupportTokensFunc();
    getTotalTvlByTokenFunc();
    getAccountRefferalsTVLFunc();
    getGroupTvlFunc();
    getReferralTvlFunc();
    getTotalTvlFunc();
    getEigenlayerPointsFunc();
    getPufferPointsFunc();
    getRenzoPointsFunc();
    getAccountTvlFunc();
    getMagpiePointsFunc();
    getLayerbankPufferPointsFunc();
    getRoyaltyBoosterFunc();
  }, [address]);

  useEffect(() => {
    /**
     * return home page if not active
     */
    if (!isConnected || !invite?.twitterHandler) {
      navigatorTo("/");
    }
  }, [isConnected, invite]);

  const [isLoading, setIsLoading] = useState(false);

  const [dontShowAgain, setDontShowAgain] = useState(true);

  const dispatch = useDispatch();
  const handleAdClose = () => {
    console.log("dontShowAgain", dontShowAgain);
    if (dontShowAgain) {
      dispatch(setIsAdHide(true));
    }
    adModal.onClose();
  };

  const handleAdJump = () => {
    console.log("dontShowAgain", dontShowAgain);
    if (dontShowAgain) {
      dispatch(setIsAdHide(true));
    }
    window.open(
      "https://www.okx.com/web3/discover/cryptopedia/event/28",
      "_blank"
    );
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (!isAdHide) {
        adModal.onOpen();
      }
    }, 1000);
  }, []);

  const ecoDappsData = useMemo(() => {
    const lauyerbankPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(layerbankNovaPoints),
      },
      {
        name: "LayerBank Points",
        value: "Comming soon",
      },
      {
        name: "Puffer Points",
        value: formatNumberWithUnit(layerbankPufferPoints),
      },
      // {
      //   name: "Eigenlayer Points",
      //   value: formatNumberWithUnit(layerbankEigenlayerPoints),
      // },
    ];
    const layerbank = {
      name: "LayerBank",
      handler: "@LayerBankFi",
      link: "https://zklink.layerbank.finance/",
      iconURL: "/img/icon-layerbank.svg",
      booster: "2x",
      type: "Lending",
      points: lauyerbankPoints,
      earned: `${lauyerbankPoints.length} Points`,
      status: "Live",
      multiplier: "2x Nova Points",
      description: `You gain points multiplied by the amount of liquidity you've provided for each block that it's in a pool.`,
    };

    const linkswapPoints = [
      {
        name: "Nova Points",
        value: formatNumberWithUnit(linkswapNovaPoints),
      },
    ];
    const linkswap = {
      name: "Linkswap",
      handler: "@LinkswapFinance",
      link: "https://linkswap.finance/earn",
      iconURL: "/img/icon-linkswap.svg",
      booster: "1.5x",
      type: "Dex",
      points: linkswapPoints,
      earned: `${linkswapPoints.length} Points + Yield`,
      status: "Syncing Data",
      multiplier: "1.5x Nova Points",
      description: `You gain points multiplied by the amount of liquidity you've provided for each block that it's in a pool.`,
    };
    return [layerbank, linkswap];
  }, [
    layerbankNovaPoints,
    layerbankPufferPoints,
    layerbankEigenlayerPoints,
    linkswapNovaPoints,
  ]);

  return (
    <BgBox>
      <BgCoverImg />
      {isLoading && <Loading />}

      <div className="md:w-full md:text-center md:py-[0.5rem] py-[1rem] text-[1rem] bg-[#226959] z-10 md:px-[6.125rem] md:mx-0 px-[1rem] mx-3">
        <span className="text-[#03d498]">
          All other projects points are undergoing synchronization at the
          moment. Your point balances may not be visible until this process is
          complete.
        </span>
      </div>

      <div className="mt-4 md:pl-[4.75rem] md:pr-[6rem] px-[1rem]">
        <Banner />
      </div>

      <div className="relative md:flex gap-[1.5rem] md:px-[4.75rem] px-[1rem] z-[1] pt-[1rem]">
        {/* Left: nova points ... data */}
        <div className="md:w-[27.125rem] z-10">
          <NovaCharacter />
          <NovaPoints
            groupTvl={groupTvl}
            referPoints={referPoints}
            novaPoints={novaPoints}
            pufferEigenlayerPoints={pufferEigenlayerPoints}
            pufferPoints={pufferPoints}
            renzoPoints={renzoPoints}
            renzoEigenLayerPoints={renzoEigenLayerPoints}
            magpiePointsData={magpiePointsData}
            layerbankNovaPoints={layerbankNovaPoints}
            royaltyBooster={royaltyBooster}
            okxPoints={okxPoints}
            kolPoints={kolPoints}
            trademarkPoints={trademarkPoints}
            totalNovaPoints={totalNovaPoints}
          />
          <StakingValue
            stakingUsdValue={stakingUsdValue}
            stakingEthValue={stakingEthValue}
          />
        </div>

        {/* Right: tvl ... data */}
        <div className="md:w-full maxWid">
          <TvlSummary
            totalTvl={totalTvl}
            groupTvl={groupTvl}
            referralTvl={referralTvl}
          />

          {/* Group Milestone */}
          <div className="mt-[2rem]">
            <GroupMilestone groupTvl={groupTvl} />
          </div>

          <div className="mt-[2rem]">
            {/* Tabs btn: Assets | Trademark NFTs | Referral  */}
            <TabsBox className="flex items-center gap-[1.5rem] overflow-x-auto">
              {["Eco dApps", "Assets", "Nova NFTs", "Referral"].map(
                (item, index) => (
                  <span
                    key={index}
                    className={`tab-item whitespace-nowrap ${
                      tabsActive === index ? "active" : ""
                    }`}
                    onClick={() => setTabsActive(index)}
                  >
                    {item}
                  </span>
                )
              )}
            </TabsBox>

            {/* Tabs view: Assets */}
            {tabsActive === TabType.Eco && <EcoDApps data={ecoDappsData} />}

            {/* Tabs view: Assets */}
            {tabsActive === TabType.Assets && (
              <AssetsTable
                ethUsdPrice={ethUsdPrice}
                supportTokens={supportTokens}
                totalTvlList={totalTvlList}
                accountTvlData={accountTvlData}
              />
            )}
            {/* Tabs view: Trademark NFTs */}
            {tabsActive === TabType.NFTs && (
              <>
                {nftPhase === 1 && (
                  <NFTCard switchPhase={(p) => setNftPhase(p)} />
                )}
                {nftPhase === 2 && (
                  <NFTCardV2 switchPhase={(p) => setNftPhase(p)} />
                )}
              </>
            )}

            {/* Tabs view: Referral */}
            {tabsActive === TabType.Referral && (
              <CardBox className="mt-[2rem] min-h-[30rem]">
                <ReferralList
                  data={referrersTvlList}
                  ethUsdPrice={ethUsdPrice}
                />
              </CardBox>
            )}
          </div>
        </div>
      </div>

      <div className="relative mt-[3rem] md:pl-[4.75rem] md:pr-[6rem] px-[1rem] z-[1]">
        <DisclaimerFooter />
      </div>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        size="md"
        hideCloseButton
        isOpen={adModal.isOpen}
        onOpenChange={adModal.onOpenChange}
      >
        <ModalContent className="mb-[3.75rem]">
          {(onClose) => (
            <>
              <ModalHeader className="text-center text-[1.5rem]">
                Join Nova Cryptopedia Event and Win $300k in Rewards!
              </ModalHeader>
              <ModalBody className="pb-8">
                <div>
                  <img src="/img/join-nova-cryptopedia.png" />
                </div>

                <div>
                  <Checkbox
                    classNames={{
                      label: "text-[0.75rem] text-[#999] whitespace-nowrap",
                    }}
                    isSelected={dontShowAgain}
                    onValueChange={setDontShowAgain}
                  >
                    {"Don't show again"}
                  </Checkbox>
                </div>

                <div>
                  <Button
                    className="gradient-btn mt-4 w-full h-[2.1875rem] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1rem]"
                    onClick={handleAdJump}
                  >
                    Join & Verify Now
                  </Button>

                  <Button
                    className="mt-4 w-full h-[2.1875rem] py-[1rem] flex justify-center items-center gap-[0.38rem] text-[1rem] rounded-[6px]"
                    onClick={handleAdClose}
                  >
                    Close
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </BgBox>
  );
}
