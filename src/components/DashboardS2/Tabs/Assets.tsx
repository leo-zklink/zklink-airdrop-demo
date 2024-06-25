import styled from "styled-components";
import { ExplorerTvlItem, SupportToken, getExplorerTokenTvl } from "@/api";
import { AccountTvlItem, TotalTvlItem } from "@/pages/Dashboard";
import { useEffect, useState } from "react";
import { Input, useDisclosure } from "@nextui-org/react";
import { findClosestMultiplier, formatNumberWithUnit } from "@/utils";
import _ from "lodash";
import { SearchIcon } from "@/components/SearchIcon";

const BlurBox = styled.div`
  color: rgba(251, 251, 251, 0.6);
  text-align: center;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  border-radius: 24px;
  border: 1px solid rgba(51, 49, 49, 0.6);
  background: #10131c;
  filter: blur(0.125px);
  .bold {
    font-weight: 900;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Container = styled.div`
  .holding-title {
    color: #fff;
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    text-transform: capitalize;
  }
  .holding-value {
    color: #fff;
    font-family: Satoshi;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: capitalize;
  }
  .holding-desc {
    color: rgba(251, 251, 251, 0.6);
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: capitalize;
  }
`;

const List = styled.div`
  width: 100%;

  .list-header-item {
    padding: 24px 0;
    color: rgba(251, 251, 251, 0.6);
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .row {
    border-radius: 24px;
    border: 2px solid #635f5f;
    background: #151923;
  }

  .list-content-item {
    padding: 16px 28px;
    color: var(--Neutral-1, #fff);
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;

    .symbol {
      color: #fff;
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
      text-transform: capitalize;
    }
    .name {
      color: #03d498;
      font-family: Satoshi;
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    .text-gray {
      color: rgba(255, 255, 255, 0.6);
      font-family: Satoshi;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .action {
      color: rgba(251, 251, 251, 0.6);
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      text-align: center;
    }
    .particpate {
      text-align: center;
      font-family: Satoshi;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      background: linear-gradient(
        90deg,
        #4ba790 0%,
        rgba(251, 251, 251, 0.6) 50.31%,
        #9747ff 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .col-line {
    width: 1px;
    height: 44px;
    opacity: 0.3;
    opacity: 0.3;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  .list-header-item,
  .list-content-item {
    width: 20%;

    &:last-child {
      width: 268px;
    }
  }
`;

export type TokenAddress = {
  chain: string;
  l1Address: string;
  l2Address: string;
};

export type AssetsListItem = {
  // acount tvl
  tvl: string | number;
  amount: string | number;
  tokenAddress: string;
  iconURL: string;
  // total tvl by token
  totalAmount: string | number;
  totalTvl: string | number;
  // support token
  symbol: string;
  decimals: number;
  cgPriceId: string;
  type: string;
  yieldType: string[];
  multipliers: {
    multiplier: number;
    timestamp: number;
  }[];
  isNova: boolean;
  chain?: string;
};

interface IAssetsTableProps {
  accountTvlData: AccountTvlItem[];
  totalTvlList: TotalTvlItem[];
  supportTokens: SupportToken[];
  ethUsdPrice: number;
}

export default function Assets(props: IAssetsTableProps) {
  const { accountTvlData, totalTvlList, supportTokens, ethUsdPrice } = props;
  const [assetsTabsActive, setAssetsTabsActive] = useState(0);
  const [assetTabList, setAssetTabList] = useState([{ name: "All" }]);
  const [tableList, setTableList] = useState<AssetsListItem[]>([]);
  const [filterTableList, setFilterTableList] = useState<AssetsListItem[]>([]);
  const [bridgeToken, setBridgeToken] = useState("");
  const [isMyHolding, setIsMyHolding] = useState(false);
  const bridgeModal = useDisclosure();
  const [serachValue, setSearchValue] = useState("");

  const yieldsTypeList = [
    { name: "NOVA Points", label: "Nova Points" },
    { name: "Native Yield", label: "Native Yield" },
    { name: "EL Points", label: "EL Points" },
    { name: "Kelp Miles", label: "Kelp Miles" },
    { name: "Puffer Points", label: "Puffer Points" },
    { name: "ezPoints", label: "ezPoints" },
    { name: "Loyalty", label: "Loyalty Points" },
    { name: "Pearls", label: "Pearls" },
    { name: "Shard", label: "Shard" },
  ];

  const getTotalTvl = (tokenAddress: string) => {
    return totalTvlList.find(
      (item) => item.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
    );
  };

  const handleBridgeMore = (token: string) => {
    if (token === "rsETH" || token === "M-BTC") {
      window.open("https://free.tech/zklink");
    } else {
      setBridgeToken(token);
      bridgeModal.onOpen();
    }
  };

  const [explorerTvl, setExplorerTvl] = useState<ExplorerTvlItem[]>([]);
  const getExplorerTokenTvlFunc = async () => {
    const res = await getExplorerTokenTvl(true);
    setExplorerTvl(res);
  };

  useEffect(() => {
    getExplorerTokenTvlFunc();
  }, []);

  useEffect(() => {
    let arr = [{ name: "All" }];
    if (
      supportTokens &&
      Array.isArray(supportTokens) &&
      supportTokens.length > 0
    ) {
      supportTokens.forEach((item) => {
        if (item?.type) {
          arr.push({ name: item?.type });
        }
      });
    }

    let list = _.uniqBy(arr, "name");

    setAssetTabList(list);
  }, [supportTokens]);

  const getIconUrlByL2Address = (tokenAddress: string) => {
    let imgURL = "";

    const obj = explorerTvl.find(
      (item) => item.l2Address.toLowerCase() === tokenAddress.toLowerCase()
    );
    if (obj?.iconURL && obj.iconURL !== "") {
      imgURL = obj.iconURL;
    }

    return imgURL;
  };

  const getTokenAccountTvl = (l2Address: string) => {
    const accountTvlItem = accountTvlData.find(
      (tvlItem) =>
        l2Address.toLowerCase() === tvlItem.tokenAddress.toLowerCase()
    );

    return accountTvlItem;
  };

  useEffect(() => {
    let arr: AssetsListItem[] = [];
    supportTokens.forEach((item: any) => {
      let obj = {
        // acount tvl
        amount: 0,
        tvl: 0,
        tokenAddress: "",
        iconURL: "",
        // total tvl by token
        totalAmount: 0,
        totalTvl: 0,
        // support token
        symbol: item?.symbol,
        // address: item?.address,
        decimals: item?.decimals,
        cgPriceId: item?.cgPriceId,
        type: item?.type,
        yieldType: item?.yieldType,
        multipliers: item?.multipliers,
        isNova: item.address[0]?.chain === "Nova" ? true : false,
      };

      // sum all chains token amount/tvl
      item.address.forEach((chains: any) => {
        obj.tokenAddress = chains.l2Address;
        const accountTvlItem = getTokenAccountTvl(chains.l2Address);
        const totalTvlItem = getTotalTvl(chains.l2Address);

        if (accountTvlItem) {
          obj.amount += +accountTvlItem.amount ? +accountTvlItem.amount : 0;
          obj.tvl += +accountTvlItem.tvl
            ? +accountTvlItem.tvl * ethUsdPrice
            : 0;
        }

        if (totalTvlItem) {
          obj.totalAmount += +totalTvlItem.amount ? +totalTvlItem.amount : 0;
          obj.totalTvl += +totalTvlItem.tvl
            ? +totalTvlItem.tvl * ethUsdPrice
            : 0;
        }

        obj.iconURL =
          !obj?.iconURL || obj.iconURL === ""
            ? getIconUrlByL2Address(chains.l2Address)
            : obj.iconURL;
      });

      // not WETH
      if (
        obj.tokenAddress.toLowerCase() !==
        "0x8280a4e7d5b3b658ec4580d3bc30f5e50454f169"
      ) {
        arr.push(obj);
      }
    });

    setTableList(arr);
  }, [
    isMyHolding,
    assetsTabsActive,
    accountTvlData,
    supportTokens,
    explorerTvl,
  ]);

  useEffect(() => {
    let arr = [...tableList];

    if (isMyHolding) {
      arr = arr.filter((item) => +item.tvl !== 0);
    }

    if (assetsTabsActive !== 0) {
      const filterType = assetTabList[assetsTabsActive].name;
      arr = arr.filter((item) => item?.type === filterType);
    }

    if (serachValue.trim()) {
      let queryStringArr = serachValue.split("");
      let str = "(.*?)";
      let regStr = str + queryStringArr.join(str) + str;
      let reg = RegExp(regStr, "i");

      arr = arr.filter((item) => reg.test(item.symbol));
    }

    arr = arr
      .filter(
        (item) =>
          item?.multipliers &&
          Number(findClosestMultiplier(item.multipliers)) !== 0
      )
      .sort(
        (a, b) =>
          Number(findClosestMultiplier(b.multipliers)) -
          Number(findClosestMultiplier(a.multipliers))
      );

    setFilterTableList(arr);

    // const notNovaFilters = arr.filter((item) => !item.isNova);
    // const novaFilters = arr.filter((item) => item.isNova);
    // const newArr = [...novaFilters, ...notNovaFilters];
    // setFilterTableList(newArr);
  }, [tableList, serachValue, isMyHolding, assetsTabsActive]);

  return (
    <Container>
      <div className="flex justify-between items-center">
        <div>
          <div className="holding-title flex items-center gap-[4px]">
            <img src="/img/icon-assets.svg" alt="" className="w-[16px] h-[16px]" />
            <span>Holding $ZKL Allocation</span>
          </div>
          <div className="holding-value mt-[16px]">5,000,000 $ZKL</div>
          <div className="holding-desc mt-[8px]">
            Next $ZKL Allocation Milestone: 10,000,000 $ZKL
          </div>
        </div>
        <div className="flex items-center gap-[14px]">
          <BlurBox className="px-[16px] py-[12px]">
            Total Allocated Points <span className="bold">100,000</span>
          </BlurBox>
          <BlurBox className="px-[16px] py-[12px]">
            Your Points <span className="bold">25</span>
          </BlurBox>
        </div>
      </div>
      <div>
        <List>
          <div className="list-header flex items-center">
            <div className="list-header-item text-left">Token</div>
            <div className="list-header-item text-center">Points Booster</div>
            <div className="list-header-item text-center">Nova TVL</div>
            <div className="list-header-item text-center">Your Deposit</div>
            <div className="list-header-item">
              <Input
                data-hover={false}
                isClearable
                placeholder="Please enter the token symbol."
                classNames={{
                  base: ["bg-[rgba(0,0,0,.4)]", "bg-[rgba(0,0,0,.4)]"],
                  mainWrapper: ["bg-transparent", "hover:bg-transparent"],
                  inputWrapper: ["bg-transparent", "hover:bg-transparent"],
                  input: ["bg-transparent", "hover:bg-transparent"],
                }}
                startContent={
                  <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                }
                onClear={() => {
                  setSearchValue("");
                }}
                onValueChange={setSearchValue}
              />
            </div>
          </div>
          <div className="list-content">
            {filterTableList.map((item, index) => (
              <div className="row mb-[24px] flex items-center" key={index}>
                <div className="list-content-item flex items-center gap-[10px]">
                  <img
                    src={item?.iconURL}
                    alt=""
                    className="w-[55px] h-[56px] rounded-full block"
                  />
                  <div>
                    <div className="symbol">{item?.symbol}</div>
                    <div className="name mt-[5px]">Ethereum</div>
                  </div>
                </div>
                <div className="col-line"></div>
                <div className="list-content-item  text-center">
                  {item?.multipliers && Array.isArray(item.multipliers)
                    ? findClosestMultiplier(item?.multipliers)
                    : 0}
                  x Boost
                </div>
                <div className="col-line"></div>

                <div className="list-content-item  text-center">
                  {formatNumberWithUnit(item?.totalAmount)}
                  <span className="text-gray">
                    ({formatNumberWithUnit(item?.totalTvl, "$")})
                  </span>
                </div>
                <div className="col-line"></div>

                <div className="list-content-item  text-center">
                  {" "}
                  {formatNumberWithUnit(item?.amount)}
                </div>
                <div className="col-line"></div>

                <div className="list-content-item  flex justify-end items-center gap-[10px]">
                  <span className="action">Action:</span>
                  <span className="particpate">Participate</span>
                </div>
              </div>
            ))}
          </div>
        </List>
      </div>
    </Container>
  );
}
