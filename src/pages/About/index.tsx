import styled from "styled-components";
import "@/styles/otp-input.css";
const BgBox = styled.div`
  width: 100%;
  min-height: 100vh;
  color: #a0a5ad;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  letter-spacing: -0.5px;
  background: linear-gradient(
    0deg,
    rgba(0, 178, 255, 0.4) 0%,
    rgba(12, 14, 17, 0.4) 100%
  );
  .banner {
    width: 100%;
    margin-bottom: 24px;
  }
  .title {
    color: #fff;
  }
  .paragraph {
    margin-bottom: 24px;
  }
  .paragraph1 {
    margin-bottom: 16px;
  }
  .paragraph2 {
    margin-bottom: 32px;
  }
  .paragraph3 {
    margin-bottom: 90px;
  }
  .before:before {
    content: "•";
    margin-right: 5px;
  }
  .big {
    font-size: 32px;
  }
  .jump {
    color: #03d498;
    cursor: pointer;
  }
  .marginLeft {
    margin-left: 30px;
  }
  .tr {
    width: 80%;
    display: flex;
    justify-content: space-around;
    height: 60px;
    background: rgba(0, 0, 0, 0.4);
  }
  .th {
    background: linear-gradient(90deg, #49eaae 0%, #3f54fb 50%, #4aced7 100%);
    border-radius: 10px 10px 0 0;
  }
  .td {
    width: 150px;
    color: #fff;
    text-align: center;
    font-family: Satoshi;
    font-size: 18px;
    font-style: normal;
    font-weight: 900;
    line-height: 24px; /* 133.333% */
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .last {
    border-radius: 0 0 10px 10px;
  }
  .person {
    width: 147px;
    height: 147px;
    flex-shrink: 0;
    border-radius: 8px;
    background: url(<path-to-image>), lightgray 50% / cover no-repeat;
    margin-right: 55px;
  }

  @media (max-width: 768px) {
    .big {
      font-size: 28px;
    }
  }
`;

const BannerText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.32);

  .text {
    background: linear-gradient(90deg, #fff 0%, #a1f4ff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 1;
    -webkit-text-stroke-color: #000;
    font-family: "Irish Grover";
    font-size: 60px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 1.6px;
    text-transform: capitalize;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .text {
      font-size: 26px;
    }
  }
`;

export default function About() {
  return (
    <BgBox className="relative pb-[3rem]">
      <div className="md:pt-[8.5rem] pt-[5rem] md:px-[252px] px-[20px] box-content ">
        <div className="flex relative ">
          <img src="/img/about-banner.png" className="banner" />

          <BannerText className="absolute flex flex-col justify-center items-center">
            <p className="text text-center">zkLink Nova Campaign</p>
          </BannerText>
        </div>
        <div className="paragraph">
          zkLink Nova is the first aggregated Layer 3 ZK-Rollup network with
          EVM-compatibility, built on top of Ethereum and multiple Layer 2
          rollup networks (L2s).
        </div>
        <div className="paragraph">
          <span className="title">
            Participate in the Aggregation Parade Campaign to earn a share of
            ZKL tokens.
          </span>{" "}
          The Aggregation Parade encompasses rewards in the form of Nova Points
          and NFTs, all tied to the Finale Reward. Users can enhance their Nova
          points by contributing meaningfully to the ecosystem's growth.
          Activities such as early participation, holding more assets, referring
          more friends, and achieving higher group TVL will boost your final
          Nova points which impacts your final reward.
        </div>
        <div className="paragraph">
          <div>The campaign will be divided into two phases:</div>
          <div className="before">Early Bird Stage</div>
          <div className="before">Ecosystem Boost Stage</div>
        </div>
        <div className="paragraph">
          In the Early Bird stage, users enjoy additional points for
          participating in the campaign on the zkLink Nova network.
        </div>
        <div className="paragraph1 title big">How to earn Nova points?</div>
        <div className="paragraph">
          You can see the detail and formula of how we calculate Nova points{" "}
          <a className="jump" href="https://blog.zk.link/aggregation-parade-7997d31ca8e1" target="_blank">here</a>.
        </div>
        <div>
          <img src="/img/image4.svg" className="w-full" />
        </div>
        <div className="paragraph">
          <div className="title mt-4">Minimal Entry:</div>
          <div>1. First 7 days 0.1 ETH (Or Equivalent)</div>
          <div>2. After the 7th day 0.25 ETH (Or Equivalent)</div>
        </div>
        <div className="paragraph2">
          <div className="title">Deposit / Bridge Assets to Nova</div>
          <div>
            Bridging any supported assets to Nova can instantly earn Nova
            points. The points earned is determined by a multiple factors:
          </div>
          <ul>
            <li className="before">Deposit Value </li>
            <li className="before">Token Multiplier</li>
            <li className="before">Deposit Multiplier</li>
          </ul>
          <div className="title">
            To join the Aggregation Parade, make sure your deposit surpasses the
            Minimum Entry.
          </div>
        </div>
        <div className="paragraph">
          <div className="title">Holding assets on Nova</div>
          <div>
            Holding any supported assets on Nova allows you to accrue Nova points every 8 hours until the final Nova Point computation date. Check how your Nova points are computed by holding Value <a className="jump" href="https://blog.zk.link/aggregation-parade-7997d31ca8e1" target="_blank">here</a>.
          </div>
          <img src="/img/image2.svg" className="w-full" />
        </div>
        <div className="paragraph">
          <div>
            Tokens are categorized into three classes, with higher liquidity tokens receiving more Nova Points.
          </div>
          <ul>
            <li className="before">Class I: Multiplier 2x</li>
            <li className="before">Class II: Multiplier 1.5x</li>
            <li className="before">Class III: Multiplier 1x</li>
          </ul>
        </div>
        <div className="paragraph">
          <div className="title">Referral Rewards</div>
          <div>
            By inviting friends, you can earn 10% of the Nova points they earn
            throughout the duration of the Aggregation Parade. For instance, if
            you refer to 10 users, and collectively they earn 100 Nova points,
            you will also earn 10 points.
          </div>
        </div>
        <div className="paragraph">
          <div className="title">Multiplier</div>
          <div>
            <span className="title">Early Bird Multiplier: </span>During Phase 1
            of the Nova Campaign, withdrawals are temporarily restricted for a{" "}
            <span className="title">Maximum</span> of 30 days.
          </div>
          <div className="marginLeft">a. First week: 2x Nova Points</div>
          <div className="marginLeft">b. 2nd week: 1.5x Nova Points</div>
          <div className="marginLeft">c. 3rd & 4th week: 1.2x Nova Points</div>
          <div className="title">
            The Early Bird Multiplier{" "}
            <span className="text-[#03D498]">concludes immediately</span> in the
            event where zkLink Nova removes the withdrawal restriction.
          </div>
        </div>
        <div className="paragraph">
          <div>
            <span className="title">Token Multiplier:</span> Tokens are
            categorized into three tiers, with higher liquidity tokens receiving
            more Nova Points.
          </div>
        </div>
        <div className="paragraph">
          <div>
            <span className="title">Deposit Multiplier:</span> After making a valid deposit, you will instantly receive a x10 Nova Points boost.
          </div>
        </div>
        <div className="paragraph">
          <div>
            <span className="title">Group Multiplier:</span> You, along with the
            users you've referred and their subsequent referrals, will be placed
            into the same group. This group has the potential to unlock Group
            Booster by achieving the following Milestones.
          </div>
        </div>
        <div className="paragraph">
          <img src="/img/image3.svg" className="w-full" />
        </div>
        <div className="paragraph title big">How to earn Nova NFTs?</div>
        <div className="paragraph">
          <div>You will get ONE of the FOUR Nova SBT once you bridge</div>
          <div className="before">0.1ETH (In the first 7 days) OR</div>
          <div className="before">
            0.25 ETH (After day 7th) into zkLink Nova
          </div>
        </div>

        {/* <div className='flex paragraph'>
                    <img src="/img/4.png" alt="" className='person'/>
                    <img src="/img/3.png" alt="" className='person'/>
                    <img src="/img/2.png" alt="" className='person'/>
                    <img src="/img/1.png" alt="" className='person'/>
                </div> */}
        <div className="mb-[1rem]">
          <img src="/img/image5.svg" className="w-full" />
        </div>
        <div className="paragraph">
          <div>
            After obtaining your SBT, you can upgrade it into an ERC-721 NFT
            through collecting ONE OF EACH of the four different types of
            trademark NFT through our referral program.
          </div>
          <div className="before">
            You will get a trademark NFT airdrop for each 3 referrals.
          </div>
          <div className="before">
            Top 100 referrer on the referral leader-board will be airdrop a
            Mystery Box.
          </div>
        </div>
        <div className="paragraph">
          <div>
            Upon Upgrading your Nova Lynks NFT, you will unlock the following
            utilities:
          </div>
          <div className="before">
            <span className="text-[#03D498]">10,000,000 ZKL</span> Airdrop
          </div>
          <div className="before">ZKL swags</div>
          <div className="before">Future NFT whitelist</div>
          <div className="before">zkLink on-site event access</div>
        </div>
        <div className="paragraph title big">Timeline</div>
        <div className="paragraph">
          <div className="title">Phase 1: Aggregation phase 3/2024</div>
          <div className="before">
            Deposit all accepted tokens onto NOVA to earn Nova points
          </div>
        </div>
        <div className="paragraph">
          <div className="title">Phase 2: Claiming Phase 4/2024</div>
          <div className="before">Nova Lynks Holders split 10,000,000 $ZKL</div>
          <div className="before">Nova Points computation wrap up</div>
        </div>
        <div className="paragraph">
          <div className="title">Phase 3: Releasing phase 4/2024</div>
          <div className="before">
            Nova Points will be released in the form of $ZKL
          </div>
        </div>
        <div className="paragraph">
          <div className="title">Phase 4: Reunification Phase 5/2024</div>
          <div className="before">
            More to be revealed after bitcoin halving
          </div>
        </div>
        <div className="paragraph">
          <img src="/img/image1.svg" className="w-full" />
        </div>
        <div className="paragraph title big">About zkLink Nova Network</div>
        <div className="paragraph3">
          zkLink Nova is the pioneering Aggregated Layer 3 Rollup zkEVM network
          that brings unprecedented liquidity and asset aggregation to Ethereum
          and its Layer 2 Rollups. Built with ZK Stack and zkLink Nexus, it
          leverages ZK Proofs to enhance scalability and security. Developers
          enjoy an open platform for deploying Solidity smart contracts, tapping
          into integrated networks like Arbitrum and zkSync. Nova simplifies
          DeFi by presenting a unified ecosystem for users and DApps, promoting
          a seamless blockchain experience.
        </div>
      </div>
    </BgBox>
  );
}
