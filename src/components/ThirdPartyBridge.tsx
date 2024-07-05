import useNovaPoints from "@/hooks/useNovaPoints";
import { useMemo } from "react";

export default function ThridPartyBridge() {
  const {
    mesonBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
    owltoBridgeNovaPoints,
    orbiterBridgeNovaPoints,
  } = useNovaPoints();
  const bridges = useMemo(() => {
    return [
      {
        iconURL: "/img/icon-free.svg",
        name: "Free",
        desc: "Bridge Bitcoin assets to earn Nova Points.",
        tooltip: "",
        points: "",
        link: "https://app.free.tech/",
      },
      {
        iconURL: "/img/icon-orbiter.svg",
        name: "Orbiter Finance",
        desc: "Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.",
        tooltip: "",
        points: `${orbiterBridgeNovaPoints} ${
          orbiterBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
        }`,
        link: "https://www.orbiter.finance/?source=Ethereum&dest=zkLink%20Nova&token=ETH",
      },
      {
        iconURL: "/img/icon-meson.svg",
        name: "Meson Finance",
        desc: "Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.",
        tooltip: "",
        points: `${mesonBridgeNovaPoints} ${
          mesonBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
        }`,
        link: "https://meson.fi/zklink",
      },
      // {
      //   iconURL: "/img/icon-owlto.svg",
      //   name: "Owlto Finance",
      //   desc: "Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.",
      //   tooltip: "",
      //   points: `${owltoBridgeNovaPoints} ${
      //     owltoBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
      //   }`,
      //   link: "https://owlto.finance/?to=zkLinkNova",
      // },
      {
        iconURL: "/img/icon-symbiosis.svg",
        name: "Symbiosis",
        desc: "Bridge more than 0.1 ETH/ 500USDT /500 USDC to Nova to earn Nova Points.",
        tooltip: "",
        points: `${symbiosisBridgeNovaPoints} ${
          symbiosisBridgeNovaPoints > 1 ? "Nova Points" : "Nova Point"
        }`,
        link: "https://app.symbiosis.finance/swap?chainIn=Ethereum&chainOut=ZkLink&tokenIn=ETH&tokenOut=ETH",
      },
    ];
  }, [
    mesonBridgeNovaPoints,
    orbiterBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
  ]);

  return (
    <div className="bridge-bg-main mt-10">
      <p className=" text-[#fff] text-[1.25rem] ">
        Earn Extra Nova Points by deposit from third-party bridges!
      </p>
      <div className="bridge-divide mt-6"></div>
      {bridges.map((bridge, index) => (
        <a
          key={index}
          className="bridge-bg-secondary mt-[1rem] px-[1rem] py-[0.75rem] rounded-[1rem] block hover:bg-white/[0.3] flex justify-between items-center"
          href={bridge.link}
          target="_blank"
        >
          <div className="flex shrink grow basis-0 items-center gap-[0.44rem] mr-2">
            <img
              src={bridge.iconURL}
              alt={bridge.name}
              className="w-[3.75rem] h[3.75rem] rounded-full"
            />
            <div>
              <div className="text-[#fff] text-[1rem]">{bridge.name}</div>
              <div className="text-[#A0A5AD] text-[0.75rem] leading-[18px]">
                {bridge.desc}
              </div>
            </div>
          </div>
          <div className="min-w-[100px] flex justify-end items-center gap-[0.5rem] whitespace-nowrap">
            {bridge.points && (
              <div className="block bg-white/[0.1] text-[#03D498] text-[14px] rounded-[100px] px-[10px] h-[28px]">
                <span>{bridge.points}</span>
              </div>
            )}
            <img src="img/icon-open-in-new.svg" className="w-6 h-6" />
          </div>
        </a>
      ))}
    </div>
  );
}
