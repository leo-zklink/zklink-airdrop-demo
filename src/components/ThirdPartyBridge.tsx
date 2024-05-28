import useNovaPoints from "@/hooks/useNovaPoints";
import { useMemo } from "react";

export default () => {
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
        desc: "Bridge M-BTC and solvBTC from Merlin to earn 1.5x Nova Points",
        tooltip: "",
        points: "",
        link: "https://free.tech/zklink",
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
    owltoBridgeNovaPoints,
    symbiosisBridgeNovaPoints,
  ]);

  return (
    <div>
      <p className="mt-[2rem] text-[#fff] text-[1.25rem]">
        Earn Extra Nova Points by deposit from third-party bridges!
      </p>
      {bridges.map((bridge, index) => (
        <a
          key={index}
          className="mt-[1rem] px-[1rem] py-[0.75rem] bg-[#011C26] rounded-[1rem] block hover:bg-[#001117] flex justify-between items-center"
          href={bridge.link}
          target="_blank"
        >
          <div className="flex items-center gap-[0.44rem]">
            <img
              src={bridge.iconURL}
              alt={bridge.name}
              className="w-[2.5rem] h-[2.5rem] rounded-full"
            />
            <div>
              <div className="text-[#fff] text-[1rem]">{bridge.name}</div>
              <div className="text-[#A0A5AD] text-[0.75rem]">{bridge.desc}</div>
            </div>
          </div>
          <div className="min-w-[100px] flex justify-end items-center gap-[0.5rem] whitespace-nowrap">
            <span>{bridge.points}</span>
            <img src="img/icon-open-in-new.svg" />
          </div>
        </a>
      ))}
    </div>
  );
};
