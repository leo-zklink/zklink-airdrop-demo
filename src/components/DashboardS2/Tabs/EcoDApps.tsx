import { NovaCategoryPoints } from "@/api";
import useNovaPoints from "@/hooks/useNovaPoints";
import { formatNumberWithUnit } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { ReactNode, useMemo, useState } from "react";
import styled from "styled-components";

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

const AllocatedBox = styled.div`
  padding: 16px 28px;
  min-width: 419px;
  border-radius: 16px;
  border: 1px solid rgba(51, 49, 49, 0);
  background: #10131c;
  filter: blur(0.125px);

  .label {
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    text-align: center;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .value {
    text-align: right;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .line {
    margin: 12px auto;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
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

const DetailTable = styled.table`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.08px;
  font-family: "Chakra Petch";
  background: #011a24;
  .detail-label {
    margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
  .detail-value {
    color: #fff;
  }
  td {
    padding: 24px;
  }
`;

interface EcoDAppItem {
  category?: string;
  iconURL: string;
  name: string;
  link: string;
  handler: string;
  type: string;
  rewards: string;
  protocolAllocated: string;
  yourPoints: string;
  details: {
    booster: string | ReactNode;
    description: string;
    action: string;
    actionLink?: string;
  }[];
  idFeatured?: boolean;
}

const milestoneMap = {
  spotdex: [
    {
      target: 1000000,
      zkl: 1000000,
      progress: 0,
    },
  ],
};

const EcoDApp = (props: {
  data: EcoDAppItem;
  handleLink: (link: string) => void;
}) => {
  const { data, handleLink } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-[24px]">
      <div className="row flex items-center cursor-pointer">
        <div className="list-content-item flex items-center gap-[10px]">
          <img
            src={data.iconURL}
            alt=""
            className="w-[55px] h-[56px] rounded-full block"
          />
          <div>
            <div
              className="symbol flex items-center gap-[4px]"
              onClick={() => handleLink(data.link)}
            >
              <span>{data.name}</span>
              <img src="/img/icon-ecolink.svg" alt="" width={16} height={16} />
            </div>
            <div className="name mt-[5px]">{data.handler}</div>
          </div>
        </div>
        <div className="col-line"></div>
        <div className="list-content-item text-center">
          Up to {data.rewards}
        </div>
        <div className="col-line"></div>

        <div className="list-content-item text-center flex items-center justify-center">
          <span className="w-[32px] h-[32px] rounded-full bg-[#7C3434]"></span>
          <span className="w-[32px] h-[32px] rounded-full bg-[#777D29]"></span>
          <span className="w-[32px] h-[32px] rounded-full bg-[#3C7F53]"></span>
          <span className="w-[32px] h-[32px] rounded-full bg-[#777]"></span>
        </div>
        <div className="col-line"></div>

        <div className="list-content-item text-center">
          {data.protocolAllocated}
        </div>
        <div className="col-line"></div>

        <div className="list-content-item  flex justify-end items-center gap-[10px]">
          <span className="action">Action:</span>
          <div
            className="flex items-center gap-[4px] cursor-pointer select-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="particpate">Participate</span>
            <img src="/img/icon-ecolink2.svg" alt="" width={16} height={16} />
          </div>
        </div>
      </div>
      {isOpen && (
        <DetailTable className="w-full mt-[5px]">
          {data.details.map((detail, index) => (
            <tr key={index}>
              <td className="detail-td">
                <div className="detail-label">Booster</div>
                <div className="detail-value">{detail.booster}</div>
              </td>
              <td className="detail-td">
                <div className="detail-label">Description</div>
                <div className="detail-value">{detail.description}</div>
              </td>
              <td className="detail-td text-right">
                <div className="detail-label">Action</div>
                <div className="detail-value flex justify-end items-center gap-[4px]">
                  <div
                    className="text-right whitespace-nowrap text-[#0BC48F] cursor-pointer"
                    onClick={() => handleLink(detail.actionLink || data.link)}
                  >
                    {detail.action}
                  </div>
                  <img
                    src="/img/icon-open-in-new-green.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
              </td>
            </tr>
          ))}
        </DetailTable>
      )}
    </div>
  );
};

export default function EcoDApps({
  tabActive,
  novaCategoryPoints,
}: {
  tabActive?: {
    category: string;
    name: string;
    iconURL: string;
  };
  novaCategoryPoints: NovaCategoryPoints[];
}) {
  const geNovaCategoryPointsByProject = (project: string) => {
    console.log("novaCategoryPoints", novaCategoryPoints);
    const obj = novaCategoryPoints.find((item) => item.project === project);
    // const obj = {
    //   ...findObj,
    //   tab: findObj ? categoryMap[findObj.category] : "",
    // };
    return obj;
  };

  const {
    orbiterBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
    mesonBridgeNovaPoints,
  } = useNovaPoints();

  const ecoDAppsList = useMemo(() => {
    const novaswap = geNovaCategoryPointsByProject("novaswap");
    const izumi = geNovaCategoryPointsByProject("izumi");
    const wagmi = geNovaCategoryPointsByProject("wagmi");
    const eddy = geNovaCategoryPointsByProject("eddy");
    const logx = geNovaCategoryPointsByProject("logx");
    const zkdx = geNovaCategoryPointsByProject("zkdx");
    const layerbank = geNovaCategoryPointsByProject("layerbank");
    const aqua = geNovaCategoryPointsByProject("aqua");
    const allspark = geNovaCategoryPointsByProject("allspark");
    const rubic = geNovaCategoryPointsByProject("rubic");
    const interport = geNovaCategoryPointsByProject("interport");
    const orbiter = geNovaCategoryPointsByProject("orbiter");
    const symbiosis = geNovaCategoryPointsByProject("symbiosis");
    const meson = geNovaCategoryPointsByProject("meson");

    const arr: EcoDAppItem[] = [
      {
        category: novaswap?.category || "spotdex",
        iconURL: "/img/icon-novaswap.svg",
        name: "Novaswap",
        link: "https://novaswap.fi/",
        handler: "@NovaSwap_fi",
        type: "DEX",
        idFeatured: true,
        rewards: "20x",
        protocolAllocated: formatNumberWithUnit(novaswap?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(novaswap?.holdingPoints || 0), // TODO
        details: [
          {
            booster: (
              <div>
                <p className="whitespace-nowrap">
                  <span className="font-[700]">20x</span> for ETH, WETH, Merged
                  WBTC, USDT, USDC
                </p>
                <p className="whitespace-nowrap">
                  <span className="font-[700]">10x</span> for canonically
                  bridged tokens eligible to earn points
                </p>
              </div>
            ),
            description:
              "You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.",
            action: "Provide Liquidity",
          },
        ],
      },
      {
        category: layerbank?.category || "lending",
        iconURL: "/img/icon-layerbank.svg",
        name: "LayerBank",
        link: "https://zklink.layerbank.finance/",
        handler: "@LayerBankFi",
        type: "Lending",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(layerbank?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(layerbank?.holdingPoints || 0), // TODO
        details: [
          {
            booster: (
              <div>
                <p>10x for ETH/wETH and merged wBTC, USDT, USDC</p>
                <p>
                  4x for canonically bridged tokens (pufETH.eth, Manta.manta,
                  Stone.manta, wBTC.eth)
                </p>
                <p>2x for externally bridged tokens (solvBTC.m, mBTC, BTCT)</p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
        ],
      },
      {
        category: logx?.category || "perpdex",
        iconURL: "/img/icon-logx.svg",
        name: "LogX",
        link: "https://app.logx.trade/liquidity",
        handler: "@LogX_trade",
        type: "Perp DEX",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(logx?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(logx?.holdingPoints || 0), // TODO
        details: [
          {
            booster: (
              <div>
                <p>10x points for LPs providing USDT</p>
                <p>1 points for a trader’s every 1000 USD trading volume</p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
          {
            booster: (
              <div>
                <p>1 point / $1000 volume</p>
              </div>
            ),
            description: `For every $1000 in trading volume on LogX, you will receive 1 Nova Point.`,
            action: "Provide Liquidity",
            actionLink: "https://app.logx.trade/",
          },
        ],
      },

      {
        category: aqua?.category,
        iconURL: "/img/icon-native.svg",
        name: "Native Lend" || "lending",
        link: "https://native.org/lend?utm_campaign=zklink_nova&utm_source=custom&utm_medium=2xpoints?chainId=810180",
        handler: "@native_fi",
        type: "Lending",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(aqua?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(aqua?.holdingPoints || 0), // TODO
        details: [
          {
            booster: (
              <div>
                <p>
                  10x for ETH/wETH and merged wBTC, USDT, USDC <br />
                  4x for canonically bridged tokens
                </p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
        ],
      },

      {
        category: wagmi?.category || "spotdex",
        iconURL: "/img/icon-wagmi.svg",
        name: "Wagmi",
        link: "https://app.wagmi.com/liquidity/pools",
        handler: "@popsiclefinance",
        type: "DEX",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(wagmi?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(wagmi?.holdingPoints || 0), // TODO
        details: [
          {
            booster: (
              <div>
                <p>10x for Merged wBTC, wETH, USDT</p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
          {
            booster: (
              <div>
                <p>1 point / $200 volume</p>
              </div>
            ),
            description: `For every $200 in trading volume on Wagmi, you will receive 1 Nova Point.`,
            action: "Trade",
            actionLink: "https://app.wagmi.com/trade/swap",
          },
        ],
      },

      {
        category: izumi?.category || "spotdex",
        iconURL: "/img/icon-izumi.svg",
        name: "iZUMI",
        link: "https://izumi.finance/trade/swap?chainId=810180",
        handler: "@izumi_Finance",
        type: "DEX",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(izumi?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(izumi?.holdingPoints || 0), // TODO
        details: [
          {
            booster: (
              <div>
                <p>10x for ETH/wETH and merged wBTC, USDT, USDC</p>
                <p>3x for externally bridged tokens (solvBTC.m)</p>
                <p>
                  Note: Boosts are provided only for effective liquidity. For
                  AMM DEX, two-sided liquidity provision is required to qualify
                  for the dApp booster.
                </p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
        ],
      },

      {
        category: zkdx?.category,
        iconURL: "/img/icon-zkdx.svg" || "perpdex",
        name: "zkDX",
        link: "https://app.zkdx.io/stakingliquidity",
        handler: "@zkDXio",
        type: "Perp DEX",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(zkdx?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(zkdx?.holdingPoints || 0), // TODO
        details: [
          {
            booster: (
              <div>
                <p>10x for Merged ETH, USDC</p>
              </div>
            ),
            description: `You earn points based on the liquidity you've supplied to the pool over a specific period, with the points multiplied accordingly.`,
            action: "Provide Liquidity",
          },
          {
            booster: (
              <div>
                <p>1 point / $200 volume</p>
              </div>
            ),
            description: `For every $200 in trading volume on zkDX, you will receive 1 Nova Point.`,
            action: "Trade",
            actionLink: "https://app.zkdx.io/trade",
          },
        ],
      },

      {
        category: eddy?.category || "spotdex",
        iconURL: "/img/icon-eddyfinance.svg",
        name: "Eddy Finance",
        link: "https://app.eddy.finance/swap",
        handler: "@eddy_protocol",
        type: "DEX",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(eddy?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(eddy?.holdingPoints || 0), // TODO
        details: [
          {
            booster: (
              <div>
                <p>1 point / $200 volume</p>
              </div>
            ),
            description: `For every $200 in trading volume on Eddy Finance (Nova Network), you will receive 1 Nova Point.`,
            action: "Trade",
          },
        ],
      },

      {
        category: allspark?.category || "gamefi",
        iconURL: "/img/icon-allspark.svg",
        name: "Allspark",
        link: "https://www.allspark.finance/mantissa/",
        handler: "@AllsparkFinance",
        type: "DEX",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(allspark?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(allspark?.holdingPoints || 0), // TODO
        details: [
          {
            booster: (
              <div>
                <p>0.5 point per trade</p>
              </div>
            ),
            description: `For each transaction you interact with Allspark, you could receive 0.5 Nova Points.`,
            action: "Use Protocol",
          },
        ],
      },

      {
        category: rubic?.category || "other",
        iconURL: "/img/icon-rubic.svg",
        name: "Rubic",
        link: "https://rubic.exchange/",
        handler: "@CryptoRubic",
        type: "",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(rubic?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(rubic?.holdingPoints || 0), // TODO
        details: [
          {
            booster: (
              <div>
                <p>1 point per trade</p>
              </div>
            ),
            description: `For each transaction you interact with Rubic, you could receive 1 Nova Points.`,
            action: "Use Protocol",
          },
        ],
      },

      {
        category: interport?.category || "other",
        iconURL: "/img/icon-interport.svg",
        name: "Interport",
        link: "https://app.interport.fi/stablecoin-pools?network=zkLink+Nova",
        handler: "@InterportFi",
        type: "",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(interport?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(interport?.holdingPoints || 0), // TODO
        details: [
          {
            booster: (
              <div>
                <p>10x for merged USDT and USDC</p>
              </div>
            ),
            description: `For each block that liquidity is in a pool you earn points multiplied by the liquidity you provided`,
            action: "Use Protocol",
          },
        ],
      },

      {
        category: orbiter?.category || "other",
        iconURL: "/img/icon-orbiter.svg",
        name: "Orbiter",
        link: "https://www.orbiter.finance/?source=Ethereum&dest=zkLink%20Nova&token=ETH",
        handler: "@InterportFi",
        type: "",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(orbiter?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(orbiter?.holdingPoints || 0), // TODO
        details: [
          {
            booster: `${orbiterBridgeNovaPoints} Nova Points`,
            description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
            action: "Bridge",
          },
        ],
      },

      {
        category: symbiosis?.category || "other",
        iconURL: "/img/icon-symbiosis.svg",
        name: "Symbiosis",
        link: "https://app.symbiosis.finance/swap?chainIn=Ethereum&chainOut=ZkLink&tokenIn=ETH&tokenOut=ETH",
        handler: "@symbiosis_fi",
        type: "",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(symbiosis?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(symbiosis?.holdingPoints || 0), // TODO
        details: [
          {
            booster: `${symbiosisBridgeNovaPoints} Nova Points`,
            description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
            action: "Bridge",
          },
        ],
      },

      {
        category: meson?.category || "other",
        iconURL: "/img/icon-meson.svg",
        name: "Meson",
        link: "https://meson.fi/zklink",
        handler: "@mesonfi",
        type: "",
        rewards: "10x",
        protocolAllocated: formatNumberWithUnit(meson?.refPoints || 0), // TODO
        yourPoints: formatNumberWithUnit(meson?.holdingPoints || 0), // TODO
        details: [
          {
            booster: `${mesonBridgeNovaPoints} Nova Points`,
            description: `Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.`,
            action: "Bridge",
          },
        ],
      },
    ];

    console.log("tabActive", tabActive, arr);

    return tabActive
      ? arr.filter((item) => item?.category === tabActive.category)
      : arr;
  }, [
    orbiterBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
    mesonBridgeNovaPoints,
    novaCategoryPoints,
    geNovaCategoryPointsByProject,
    tabActive,
  ]);

  const warningModal = useDisclosure();
  const [link, setLink] = useState<string | undefined>(undefined);
  const [recognize, setRecognize] = useState(false);

  const handleLink = (link: string) => {
    setRecognize(false);
    setLink(link);
    warningModal.onOpen();
  };

  return (
    <Container>
      <div className="flex justify-between items-center">
        <div>
          <div className="holding-title flex items-center gap-[4px]">
            <img
              src={tabActive?.iconURL}
              alt=""
              className="w-[16px] h-[16px]"
            />
            <span>{tabActive?.name} $ZKL Allocation</span>
          </div>
          <div className="holding-value mt-[16px]">5,000,000 $ZKL</div>
          <div className="holding-desc mt-[8px]">
            Next $ZKL Allocation Milestone: 10,000,000 $ZKL
          </div>
        </div>
        <AllocatedBox>
          <div className="flex items-center justify-between">
            <span className="label">Total Allocated Points</span>
            <span className="value">100,000</span>
          </div>
          <div className="line"></div>
          <div className="flex items-center justify-between">
            <span className="label">Your Points</span>
            <span className="value">25</span>
          </div>
        </AllocatedBox>
      </div>
      <List>
        <div className="list-header flex items-center">
          <div className="list-header-item text-left">Protocol</div>
          <div className="list-header-item text-center">Points Booster</div>
          <div className="list-header-item text-center">Rewards</div>
          <div className="list-header-item text-center">Allocated Points</div>
          <div className="list-header-item"></div>
        </div>
        <div className="list-content">
          {ecoDAppsList.map((item, index) => (
            <EcoDApp key={index} data={item} handleLink={handleLink} />
          ))}
        </div>
      </List>

      <Modal
        classNames={{ closeButton: "text-[1.5rem]" }}
        className="bg-[#313841] max-w-[39rem] rounded-[1.5rem]"
        size="lg"
        isOpen={warningModal.isOpen}
        onOpenChange={warningModal.onOpenChange}
      >
        <ModalContent className="p-2 mb-20 md:mb-0">
          <ModalHeader>
            <div className="text-center w-full flex justify-center items-center gap-1">
              <img src="/img/icon-warning.svg" className="w-[2rem] h-[2rem]" />
              <span className="text-[1.5rem] font-[500]">WARNING</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-[1.25rem] text-[#A0A5AD] font-[500] leading-[2rem]">
              You are about to access a third-party website. Please do your own
              research (DYOR) and avoid engaging in unfamiliar activities.
              Please note that zkLink and its affiliates are not liable for any
              losses, damages, or other consequences arising from your use of
              third-party websites.
            </p>
            <div className="mt-[1.88rem] flex items-center gap-2">
              <input
                type="checkbox"
                id="recognize"
                name="subscribe"
                value="newsletter"
                checked={recognize}
                onChange={(e) => setRecognize(e.target.checked)}
              />
              <label
                htmlFor="recognize"
                className="text-[#A0A5AD] text-[0.875rem] flex-1"
              >
                I recognize the risks and will take responsibility for actions
                on third-party websites.
              </label>
            </div>

            <div className="py-[1rem]">
              <Button
                className="gradient-btn w-full h-[2.1875rem] flex justify-center items-center gap-[0.38rem] text-[1rem] tracking-[0.0625rem] flex-1"
                disabled={!recognize}
                onClick={() => {
                  setRecognize(false);
                  warningModal.onClose();
                  window.open(link, "_blank");
                }}
              >
                Continue to Access
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
