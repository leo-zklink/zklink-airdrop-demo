import Assets from "@/components/DashboardS2/Tabs/Assets";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  NovaCategoryPoints,
  SupportToken,
  TvlCategory,
  getAccountTvl,
  getExplorerTokenTvl,
  getNovaCategoryPoints,
  getSupportTokens,
  getTokenPrice,
  getTotalTvlByToken,
  getTvlCategory,
} from "@/api";
import { useAccount } from "wagmi";
import EcoDApps from "@/components/DashboardS2/Tabs/EcoDApps";
import Portfolio from "@/components/DashboardS2/Tabs/Protfolio";

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

const Container = styled.div`
  position: relative;
  padding-top: 92px;
  min-height: 100vh;
  background-color: #000811;
`;

const CardBox = styled.div`
  padding: 23px 32px;
  border-radius: 24.133px;
  border: 2.011px solid #635f5f;
  background: #000811;

  .prize-title {
    color: #fff;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 900;
    line-height: 110%; /* 26.4px */
  }

  .prize-desc {
    color: rgba(251, 251, 251, 0.6);
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
  }
  .prize-value {
    text-align: right;
    font-family: Satoshi;
    font-size: 84px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    white-space: nowrap;
  }
`;

const BlurButton = styled.span`
  border-radius: 24px;
  border: 1px solid rgba(51, 49, 49, 0.6);
  background: #10131c;
  filter: blur(0.125px);
  color: rgba(251, 251, 251, 0.6);
  text-align: center;
  font-family: Satoshi;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  text-transform: capitalize;
  cursor: pointer;
`;

const Tabs = styled.div`
  .tab-item {
    color: rgba(251, 251, 251, 0.6);
    font-family: "Chakra Petch";
    font-size: 28px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.5px;
    cursor: pointer;
    &.active {
      color: #fff;
      font-family: "Chakra Petch";
      font-size: 28px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.5px;
      text-decoration-line: underline;
      /* text-underline-offset: 14px; */
      /* border-bottom: 1px solid #fff; */
    }
  }

  .tag {
    padding: 2px 12px;
    color: #fff;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 100% */
    letter-spacing: -0.5px;
    border-radius: 32px;
    background: #03ca91;
  }
`;

const GreenButton = styled.span`
  color: #0bc48f;
  text-align: center;
  font-family: "Chakra Petch";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 66.667% */
  letter-spacing: -0.5px;
  border-radius: 40px;
  border: 1px solid #0bc48f;
  cursor: pointer;
`;

const TabsCard = styled.div`
  .tab-item {
    padding: 12px 14px 44px;
    color: rgba(251, 251, 251, 0.6);
    text-align: center;
    font-family: Satoshi;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    border-radius: 8px 8px 0 0;
    border: 1px solid #635f5f;
    border-bottom: none;
    opacity: 0.6;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(45, 45, 45, 0.1) 40.05%,
      rgba(19, 19, 19, 0.1) 100%
    );
    cursor: pointer;

    &.active {
      color: #fff;
      opacity: 1;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(145, 145, 145, 0.1) 40.05%,
        rgba(19, 19, 19, 0.1) 100%
      );
    }
  }

  .tab-content {
    min-height: 965.435px;
    border-radius: 24px;
    border: 2px solid #635f5f;
    background: #000811;
  }
`;

export default function Dashboard() {
  const { address } = useAccount();
  const tabs1 = [
    {
      name: "Aggregation Parade",
      tag: "+50%",
    },
    {
      name: "Points & NFTs Breakdown",
    },
    {
      name: "Referrals",
    },
  ];
  const [tabs1Active, setTabs1Active] = useState(0);

  const tabs2 = [
    {
      iconURL: "/img/icon-assets.svg",
      name: "Assets",
      category: "assets",
    },
    // {
    //   iconURL: "/img/icon-assets.svg",
    //   name: "Boosted",
    //   category: "boost",
    // },
    {
      iconURL: "/img/icon-spotdex.svg",
      name: "Spot DEX",
      category: "spotdex",
    },
    {
      iconURL: "/img/icon-perpdex.svg",
      name: "Perp DEX",
      category: "perpdex",
    },
    {
      iconURL: "/img/icon-lending.svg",
      name: "Lending",
      category: "lending",
    },
    {
      iconURL: "/img/icon-gamefi.svg",
      name: "GameFi",
      category: "gamefi",
    },
    {
      iconURL: "/img/icon-others.svg",
      name: "Others",
      category: "other",
    },
  ];

  const [tabs2Active, setTabs2Active] = useState(0);

  const [ethUsdPrice, setEthUsdPrice] = useState(0);
  const [supportTokens, setSupportTokens] = useState<SupportToken[]>([]);
  const [totalTvlList, setTotalTvlList] = useState<TotalTvlItem[]>([]);
  const [accountTvlData, setAccountTvlData] = useState<AccountTvlItem[]>([]);

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
    // setStakingEthValue(eth);
    // setStakingUsdValue(usd * usdPrice);
  };

  const getSupportTokensFunc = async () => {
    const res = await getSupportTokens();
    if (res && Array.isArray(res)) {
      setSupportTokens(res);
    }
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

  const [novaCategoryPoints, setNovaCategoryPoints] = useState<
    NovaCategoryPoints[]
  >([]);

  const getNovaCategoryPointsFunc = async () => {
    if (!address) return;
    const res = await getNovaCategoryPoints(address);
    console.log("getNovaCategoryPoints", res);
    setNovaCategoryPoints(res?.data || []);
  };

  const [tvlCategory, setTvlCategory] = useState<TvlCategory[]>([]);
  const getTvlCategoryFunc = async () => {
    const res = await getTvlCategory();
    console.log("getTvlCategory", res);
    setTvlCategory(res?.data || []);
  };

  useEffect(() => {
    getAccountTvlFunc();
    getSupportTokensFunc();
    getTotalTvlByTokenFunc();
    getNovaCategoryPointsFunc();
    getTvlCategoryFunc();
  }, [address]);

  return (
    <Container>
      <div className="mt-[29.6px] mx-auto max-w-[1246px] ">
        <CardBox className="w-[full] h-[180px] flex justify-between items-center gap-[61px]">
          <div>
            <div className="flex items-center gap-[10px]">
              <img
                src="/img/icon-dollar.svg"
                alt=""
                className="w-[24px] h-[24px]"
              />
              <span className="prize-title">Prize Pool</span>
            </div>
            <div className="prize-desc mt-[19px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt
            </div>
          </div>

          <div className="prize-value">30,000,000 $ZKL</div>
        </CardBox>
      </div>

      <div className="mx-auto max-w-[1246px]">
        <div className="mt-[40px] flex justify-between items-center">
          <Tabs className="flex items-center gap-[40px]">
            {tabs1.map((tab, index) => (
              <div
                key={index}
                className={`flex items-center gap-[10px]`}
                onClick={() => setTabs1Active(index)}
              >
                <span
                  className={`tab-item ${
                    index === tabs1Active ? "active" : ""
                  }`}
                >
                  {tab.name}
                </span>
                {tab?.tag && <span className="tag">{tab.tag}</span>}
              </div>
            ))}
          </Tabs>
          <GreenButton className="px-[14px] py-[12px] flex justify-center items-center gap-[2px]">
            <img
              src="/img/icon-cale.svg"
              alt=""
              className="mt-[4px] w-[24px] h-[24px] block"
            />
            <span>Check In Box</span>
          </GreenButton>
        </div>

        <div className="mt-[40px]">
          <TabsCard>
            <div className="relative bottom-[-14.5px] flex items-center justify-between">
              <div className="flex flex items-center gap-[12.15px]">
                {tabs2.map((tab, index) => (
                  <div
                    className={`tab-item flex justify-center items-center gap-[8px] ${
                      index === tabs2Active ? "active" : ""
                    }`}
                    onClick={() => setTabs2Active(index)}
                    key={index}
                  >
                    <img
                      src={tab.iconURL}
                      alt=""
                      className="w-[24px] h-[24px] block"
                    />
                    <span>{tab.name}</span>
                  </div>
                ))}
              </div>

              <div
                className={`tab-item flex justify-center items-center gap-[8px] ${
                  tabs2Active === 99 ? "active" : ""
                }`}
                onClick={() => setTabs2Active(99)}
              >
                <img
                  src={"/img/icon-assets.svg"}
                  alt=""
                  className="w-[24px] h-[24px] block"
                />
                <span>Portfolio</span>
              </div>
            </div>

            <div className="tab-content px-[31px] py-[32.5px]">
              {tabs2Active === 0 && (
                <Assets
                  ethUsdPrice={ethUsdPrice}
                  supportTokens={supportTokens}
                  totalTvlList={totalTvlList}
                  accountTvlData={accountTvlData}
                  tvlCategory={tvlCategory}
                />
              )}
              {tabs2Active !== 0 && tabs2Active !== 99 && (
                <EcoDApps
                  tabActive={tabs2[tabs2Active]}
                  novaCategoryPoints={novaCategoryPoints}
                  tvlCategory={tvlCategory}
                />
              )}

              {tabs2Active === 99 && <Portfolio />}
            </div>
          </TabsCard>
        </div>
      </div>
    </Container>
  );
}
