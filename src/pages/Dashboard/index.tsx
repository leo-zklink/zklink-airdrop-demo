import styled from "styled-components";
import AssetsTable from "@/components/AssetsTable";
import { BgBox, BgCoverImg, CardBox } from "@/styles/common";
import { useEffect, useState } from "react";
import ReferralList from "@/components/ReferralList";
import { RootState } from "@/store";
import {
  SupportToken,
  getAccounTvl,
  getAccountPoint,
  getAccountRefferalsTVL,
  getAccountTvl,
  getExplorerTokenTvl,
  getGroupTvl,
  getReferralTvl,
  getSupportTokens,
  getTokenPrice,
  getTotalTvl,
  getTotalTvlByToken,
} from "@/api";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";
import NovaCharacter from "@/components/Dashboard/NovaCharacter";
import NovaPoints from "@/components/Dashboard/NovaPoints";
import StakingValue from "@/components/Dashboard/StakingValue";
import TvlSummary from "@/components/Dashboard/TvlSummary";
import GroupMilestone from "@/components/Dashboard/GroupMilestone";

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

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { invite } = useSelector((store: RootState) => store.airdrop);
  const [tabsActive, setTabsActive] = useState(0);
  const [totalTvlList, setTotalTvlList] = useState<TotalTvlItem[]>([]);
  const [stakingUsdValue, setStakingUsdValue] = useState(0);
  const [stakingEthValue, setStakingEthValue] = useState(0);
  const [accountPoint, setAccountPoint] = useState({
    novaPoint: 0,
    referPoint: 0,
  });
  const [referrersTvlList, setReferrersTvl] = useState([]);
  const [accountTvlData, setAccountTvlData] = useState<AccountTvlItem[]>([]);
  const [groupTvl, setGroupTvl] = useState(0);
  const [totalTvl, setTotalTvl] = useState(0);
  const [referralTvl, setReferralTvl] = useState(0);
  const [supportTokens, setSupportTokens] = useState<SupportToken[]>([]);
  const [ethUsdPrice, setEthUsdPrice] = useState(0);

  const navigatorTo = useNavigate();

  const getAccountPointFunc = async () => {
    if (!address) return;
    const res = await getAccountPoint(address);
    if (res.result) {
      setAccountPoint(res.result);
    }
  };

  const getAccountRefferalsTVLFunc = async () => {
    if (!address) return;
    const res = await getAccountRefferalsTVL(address);
    if (res.result) {
      setReferrersTvl(res.result);
    }
  };

  const getAccounTvlFunc = async () => {
    if (!address) return;
    const res = await getAccounTvl(address);
  };

  const getAccountTvlFunc = async () => {
    if (!address) return;
    const res = await getAccountTvl(address);
    const { result } = res;
    let data = [];
    if (result && Array.isArray(result) && result.length > 0) {
      data = result;
    }
    setAccountTvlData(data);

    let usd = 0;
    data.forEach((item) => {
      usd += +item?.tvl;
    });
    setStakingUsdValue(usd);
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
    const res = await getTotalTvl();
    setTotalTvl(res?.result || 0);
  };

  const getEthUsdPrice = async () => {
    const tokenList = await getExplorerTokenTvl(true);
    const ethToken = tokenList.find((item) => item.symbol === "ETH");
    if (ethToken) {
      const res = await getTokenPrice(ethToken.l2Address);
      setEthUsdPrice(+res.usdPrice || 0);
    }
  };

  useEffect(() => {
    let ethValue =
      +stakingUsdValue !== 0 && +ethUsdPrice !== 0
        ? stakingUsdValue / ethUsdPrice
        : 0;

    if (
      accountTvlData.length === 1 &&
      accountTvlData[0].symbol.toLocaleUpperCase() === "ETH"
    ) {
      ethValue = +accountTvlData[0].amount;
    }

    setStakingEthValue(ethValue);
  }, [ethUsdPrice, stakingUsdValue, accountTvlData]);

  /**
   * Init: Get data from server
   */
  useEffect(() => {
    getEthUsdPrice();
    getSupportTokensFunc();
    getTotalTvlByTokenFunc();
    getAccountPointFunc();
    getAccountRefferalsTVLFunc();
    getAccounTvlFunc();
    getAccountTvlFunc();
    getGroupTvlFunc();
    getReferralTvlFunc();
    getTotalTvlFunc();
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

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <BgBox>
      <BgCoverImg />
      <a href={`https://explorer.zklink.io/address/${address}`} target="_blank">
        <div className="absolute md:w-full md:text-center top-[5rem] md:py-[0.5rem] py-[1rem] text-[1rem] bg-[#226959] z-10 md:px-[6.125rem] md:mx-0 px-[1rem] mx-3 rounded">
          <span className="text-[#03d498]">
            Balance and Nova Points may update later. Click here to check your
            balance.
          </span>
        </div>
      </a>

      {isLoading && <Loading />}

      <div className="relative md:flex gap-[1.5rem] md:px-[4.75rem] px-[1rem] z-[1] pt-[3rem]">
        {/* Left: nova points ... data */}
        <div className="md:w-[27.125rem]">
          <NovaCharacter />
          <NovaPoints groupTvl={groupTvl} accountPoint={accountPoint} />
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
              {["Assets", "Trademark NFTs", "Referral"].map((item, index) => (
                <span
                  key={index}
                  className={`tab-item whitespace-nowrap ${
                    tabsActive === index ? "active" : ""
                  }`}
                  onClick={() => setTabsActive(index)}
                >
                  {item}
                </span>
              ))}
            </TabsBox>

            {/* Tabs view: Assets */}
            {tabsActive === 0 && (
              <AssetsTable
                supportTokens={supportTokens}
                totalTvlList={totalTvlList}
                accountTvlData={accountTvlData}
              />
            )}
            {/* Tabs view: Trademark NFTs */}
            {tabsActive === 1 && (
              <CardBox className="flex flex-col justify-center items-center mt-[2rem] py-[10rem]">
                <p className="text-[1rem] text-center mb-[1rem] font-[700]">
                  Coming Soon
                </p>
                <div className="flex">
                  <img
                    style={{ width: 80 }}
                    src="/img/logoAlien.svg"
                    className="w-[9.375rem] h-[9.375rem] mr-[2rem]"
                  />
                  <img
                    style={{ width: 80 }}
                    src="/img/icon-okx-web3.svg"
                    className="w-[9.375rem] h-[9.375rem]"
                  />
                </div>
              </CardBox>
            )}
            {/* Tabs view: Referral */}
            {tabsActive === 2 && (
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
    </BgBox>
  );
}
