import styled from "styled-components";
import DailyBox, { BoxType } from "./DailyBox";
import { useDisclosure } from "@nextui-org/react";
import InviteBoxModal from "./InviteBoxModal";

const Container = styled.div`
  border-radius: 12px;
  border: 2px solid #635f5f;
  background: linear-gradient(
    180deg,
    rgba(0, 8, 17, 0) 14.59%,
    #000811 33.31%,
    #000811 64.52%
  );
  margin: 24px auto;
  padding: 31px 33px;

  .title {
    color: var(--Neutral-1, #fff);
    text-align: center;
    font-family: Satoshi;
    font-size: 18px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    margin-right: 12px;
  }
  .title-desc {
    border-radius: 24px;
    border: 1px solid rgba(51, 49, 49, 0);
    background: #10131c;
    filter: blur(0.125px);
    display: flex;
    padding: 12px 16px;
    justify-content: center;
    align-items: center;
    gap: var(--Button-gap, 8px);
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    leading-trim: both;
    text-edge: cap;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 17.6px */
  }
  .invite-box {
    cursor: pointer;
    border-radius: 64px;
    border: 1px solid var(--Accent, #03d498);
    display: flex;
    height: 40px;
    padding: 7.5px 21.5px 8.5px 21.5px;
    justify-content: center;
    align-items: center;
    color: var(--Accent, #03d498);
    text-align: center;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
  }
`;
const BoxList = [
  {
    type: BoxType.Opend,
    weekday: "Mon",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Expired,
    weekday: "Tue",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Opend,
    weekday: "Wed",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Active,
    weekday: "Thurs",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Pending,
    weekday: "Fri",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Pending,
    weekday: "Sat",
    date: 1000000,
    amount: 1,
  },
  {
    type: BoxType.Pending,
    weekday: "Sun",
    date: 1000000,
    amount: 1,
  },
];
export default function DailyRoulette() {
  const openBoxModal = useDisclosure();
  return (
    <Container>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src="img/s2/icon-roulette.svg" alt="" />
          <p className="title">Daily Roulette</p>
          <div className="title-desc">Determined by the consecutive days</div>
        </div>
        <div className="invite-box" onClick={() => openBoxModal.onOpen()}>
          <img src="img/s2/icon-invite-box.svg" alt="" className="mr-2" />
          <span>Invite Box</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-[30px]">
        {BoxList.map((item, index) => (
          <DailyBox {...item} index={index + 1} key={index} />
        ))}
      </div>
      <InviteBoxModal modalInstance={openBoxModal} />
    </Container>
  );
}
