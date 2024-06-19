import styled from "styled-components";
import { Link } from "react-router-dom";
import SideRefeffal from "@/components/DashboardS2/Side/SideRefeffal";
import SideNovaPoints from "@/components/DashboardS2/Side/SideNovaPoints";
import SideProjectPoints from "@/components/DashboardS2/Side/SideProjectPoints";
import SideNovaNFT from "@/components/DashboardS2/Side/SideNovaNFT";
import TvlList, { TvlItem } from "@/components/DashboardS2/TvlList";
import UserInfo from "@/components/DashboardS2/Side/UserInfo";
import SocialMedia from "@/components/DashboardS2/Side/SocialMedia";
import Banner from "@/components/DashboardS2/Banner";
import EcoDApps from "@/components/DashboardS2/EcoDApps";

const Side = styled.div`
  position: relative;
  padding: 24px;
  padding-bottom: 160px;
  min-width: 440px;
  min-height: 1200px;
  background: #011a24;

  .title {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px; /* 100% */
    letter-spacing: -0.5px;
  }
`;

const Content = styled.div`
  margin-left: 10px;
  padding: 40px 75px;
  width: 100%;
  /* height: 1494px; */
  /* background: #011a24; */
`;

const Title = styled.div`
  .main-title {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: 40px; /* 100% */
    letter-spacing: -0.5px;
  }

  .allocated {
    font-family: "Chakra Petch";
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    line-height: 36px; /* 100% */
    letter-spacing: -0.5px;
    background: linear-gradient(90deg, #6276e7 0%, #e884fe 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .tag {
    padding: 8px 16px;
    border-radius: 8px;
    background: #043f38;
    color: #fff;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
  }

  .date {
    color: #999;
    font-family: "Chakra Petch";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px; /* 100% */
    letter-spacing: -0.5px;
  }

  .desc {
    color: #999;
    font-family: "Chakra Petch";
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 100% */
    letter-spacing: -0.5px;
  }
`;

const HoldingPoints = styled.div`
  font-family: "Chakra Petch";
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: -0.5px;
`;

export default function DashboardS2() {
  const tvlList: TvlItem[] = [
    {
      title: "3,500,000 $ZKL",
      name: "HOLDING",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "100%",
    },
    {
      title: "500,000 $ZKL",
      name: "SPOT DEX",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "20%",
    },
    {
      title: "500,000 $ZKL",
      name: "PERP DEX",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "20%",
    },
    {
      title: "100,000 $ZKL",
      name: "LENDING",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "20%",
    },
    {
      title: "100,000 $ZKL",
      name: "GAMEFI",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "20%",
    },
    {
      title: "100,000 $ZKL",
      name: "OTHER",
      currentTvl: "1.23m",
      targetTvl: "5m",
      nextMilestone: "3,500,000 $ZKL",
      progress: "20%",
    },
  ];

  return (
    <div className="relative pt-[64px] bg-[#0F242E] min-w-[1440px]">
      <Banner />

      <div className="flex">
        <Side>
          <div className="flex">
            <span className="title">Portfolio</span>
          </div>
          <UserInfo />

          <SideRefeffal />
          <SideNovaPoints />
          <SideProjectPoints />
          <SideNovaNFT />

          <div className="absolute bottom-[40px] left-0 right-0 w-full">
            <SocialMedia />
            <div className="mt-[24px]">
              <Link
                to="/about?anchor=disclaimer"
                className="block text-center text-[#999] text-[24px]"
              >
                zkLink Nova Disclaimer
              </Link>
            </div>
          </div>
        </Side>

        <Content>
          <Title>
            <div className="flex justify-between">
              <span className="main-title">Aggregation Parade Season II</span>
              <span className="allocated">Allocated: 30,000,000 $ZKL</span>
            </div>
            <div className="mt-[16px] flex items-center gap-[16px]">
              <span className="tag">Epoch One - 10,000,000 $ZKL Allocated</span>
              <span className="date">From 06/15/2024 - 07/15/2024</span>
            </div>
            <div className="mt-[16px] desc">
              The Aggregation Parade has allocated 30,000,000 $ZKL for Season 2,
              which will last at least three months. Each month, up to
              10,000,000 $ZKL will be distributed to participants. $ZKL will be
              divided among various sectors, each starting with a minimum
              allocation and its own set of milestones. Sectors can unlock
              additional $ZKL by reaching their goals, and participants in each
              sector will share the sector's $ZKL based on their Nova points
              ratio.
            </div>
          </Title>

          <TvlList tvlList={tvlList} />
          {/* 
          <HoldingPoints className="mt-[40px] flex justify-between items-center">
            <div>
              <span className="text-[#999]">Total Holding Points: </span>
              <span className="text-[#fff]">100,000,000</span>
            </div>
            <div>
              <span className="text-[#999]">Your Holding Points: </span>
              <span className="text-[#fff]">456</span>
            </div>
          </HoldingPoints> */}

          <EcoDApps />
        </Content>
      </div>
    </div>
  );
}
