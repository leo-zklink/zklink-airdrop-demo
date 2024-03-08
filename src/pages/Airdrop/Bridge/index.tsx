import { useState, useMemo, useCallback, useEffect } from "react";
import classnames from "classnames";
import OTPInput from "react-otp-input";
import "@/styles/otp-input.css";
import BridgeComponent from "@/components/Bridge";
import { Button } from "@nextui-org/react";
import styled from "styled-components";

const BgBox = styled.div`
  position: relative;
  padding-top: 5.5rem;
  padding-bottom: 2rem;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    360deg,
    rgba(0, 179, 255, 0.4) 0%,
    rgba(12, 14, 17, 0.4) 100%
  );

  overflow: auto;
`;
const ActiveTypes = [
  { label: "NOVA Points", value: "points" },
  { label: "NOVA NFT", value: "nft" },
];
const UtilityList = [
  "ZKL Airdrop",
  "IDO whitelist",
  "ZKL swags",
  "Future NFT whitelist",
  "zkLinkers event access",
  "GAS rebates",
];
const Link = styled.div`
  color: #03d498;
`;
export default function Bridge() {
  const [activeType, setActiveType] = useState(ActiveTypes[0].value);

  const NovaPoints = () => (
    <div className="text-base mt-10">
      <p>
        You could see the detail and formula of how we calculate Nova points{" "}
        <Link>here</Link>
      </p>
      <p className="mt-6">Minimal Entry: </p>
      <ul className="list mb-8">
        <li>1. First & days 0.1 ETH</li>
        <li>2. After Day 7th 0.25 ETH</li>
      </ul>
      <p className="mt-6">
        <span>Deposit / Bridge Assets to Nova</span>
        Bridging any supported assets to Nova can instantly earn Nova points.
      </p>
      <p className="mt-6">
        <span> Holding assets on Nova: </span>
        Holding any supported assets on Nova allows you to accrue Nova points
        every 8 hours.
      </p>
      <p className="mt-6">
        <span> Referral Rewards: </span>
        By inviting friends, you can earn 10% of the Nova points they earn
        throughout the duration of the Aggregation Parade.
      </p>
      <p className="mt-6">
        <span>Multiplier: </span>
        Multiplier Early Bird Multiplier: During Phase 1 of the Nova Campaign,
        you can earn additional Nova Points, though withdrawals are temporarily
      </p>
      <p className="mt-6">
        <span>Token Multiplier: </span>
        Tokens are categorized into three tiers, with higher liquidity tokens
        receiving more Nova Points.
      </p>
      <p className="mt-6">
        <span> Deposit Multiplier: </span>
        You will receive 10 times Nova points for EACH deposit/ bridging action
        that occurs.
      </p>
      <p className="mt-6">
        <span> Group Multiplier: </span>
        This group has the potential to unlock Group Booster by achieving the
        following Milestones.
      </p>
    </div>
  );

  const NovaNFT = () => (
    <>
      <div className="text-base mt-10">
        <p>
          You will earn one of the four Nova SBT once you bridge any amount of
          supported token into zkLink Nova.
        </p>
        <div className="flex items-center mt-12 mb-12">
          {new Array(4).fill("").map((_, index) => (
            <img
              className="w-20 h-20 mr-6"
              src={"/img/sbt-nft.png"}
              alt=""
              key={index}
            />
          ))}
        </div>
        <p>
          Upon collecting your SBT, you can upgrade it into an ERC7221 NFT
          through collecting 4 different types of trademark NFT through our
          referral program.
        </p>
        <p>
          You will get a trademark NFT airdrop for each 3 referrals <br />
          Top 50 on the referral leader-board will be airdrop a Mystery Box.
        </p>
        <p className="mt-8">
          Once you upgrade your SBT into , here are the Utility
        </p>
      </div>
      <div
        className="p-6 rounded-[18px] mt-4"
        style={{ background: "rgba(0, 0, 0, 0.4)" }}
      >
        {UtilityList.map((item, index) => (
          <p
            className={classnames(
              "font-semibold text-lg",
              index === UtilityList.length - 1 ? "mb-0" : "mb-4"
            )}
            key={item}
          >
            {item}
          </p>
        ))}
      </div>
    </>
  );

  return (
    <BgBox>
      <div className="block lg:flex md:py-24 py-12">
        <div className="px-8 md:px-16 lg:px-32 lg:w-1/2">
          <h2 className="text-4xl mt-6">
            Bridge to Nova to Earn EXTRA YIELD and token rewards on zkLink Nova.
          </h2>
          <div className="flex items-center mt-10">
            {ActiveTypes.map((item) => (
              <Button
                onClick={() => setActiveType(item.value)}
                className={classnames(
                  activeType === item.value
                    ? "gradient-btn"
                    : "gradient-secondary-btn",
                  " px-[1rem] py-[0.5rem] text-[1rem] mr-4"
                )}
              >
                {item.label}
              </Button>
            ))}
          </div>
          {activeType === "nft" ? <NovaNFT /> : <NovaPoints />}
        </div>
        <div className="px-8 md:px-16 lg:px-32 lg:w-1/2">
          <BridgeComponent isFirstDeposit={true} />
        </div>
      </div>
    </BgBox>
  );
}
