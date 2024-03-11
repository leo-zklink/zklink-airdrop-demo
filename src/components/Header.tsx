import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
} from "@nextui-org/react";
import { Link, NavLink } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import styled from "styled-components";
import { showAccount } from "@/utils";
import { useEffect, useState } from "react";
import { setInvite, setSignature, setDepositStatus } from "@/store/modules/airdrop";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useSignMessage } from "wagmi";
import { SIGN_MESSAGE } from "@/constants/sign";
import { MdArrowOutward } from "react-icons/md";
const nodeType = import.meta.env.VITE_NODE_TYPE;

const NavBox = styled.nav`
  a {
    color: #9ccbbd;
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.375rem; /* 137.5% */
    letter-spacing: -0.03125rem;
    &.active {
      color: #fff;
    }
  }
`;

const LogoBox = styled.div`
  .logo-text {
    position: absolute;
    left: 2.94rem;
    top: 0.63rem;
    color: #fff;
    font-family: Satoshi;
    font-size: 2rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.375rem; /* 68.75% */
  }
`;

const ButtonText = styled.span`
  color: #03d498;
  font-family: Heebo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 150% */
`;

export default function Header() {
  const web3Modal = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { signature,depositStatus } = useSelector((store: any) => store.airdrop);

  const { signMessage } = useSignMessage();
  const dispatch = useDispatch();

  const handleSign = async () => {
    await signMessage(
      {
        message: SIGN_MESSAGE,
      },
      {
        onSuccess(data, variables, context) {
          console.log(data, variables, context);
          dispatch(setSignature(data));
        },
        onError(error, variables, context) {
          console.log(error, variables, context);
          // handleSign()
          toast.error("User reject signature. Try again.");
          // disconnect()
        },
      }
    );
  };

  useEffect(() => {
    // console.log('isConnected', isConnected)
    // console.log('signature', signature)

    if (!isConnected) {
      // console.log('disconnect')
      dispatch(setSignature(""));
      dispatch(setInvite(null));
    }
    if (isConnected && (!signature || signature === "")) {
      handleSign();
    }
  }, [isConnected, signature]);

  const [isHeaderTop, setIsHeaderTop] = useState(true);
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsHeaderTop(false);
    } else {
      setIsHeaderTop(true);
    }
  };

  useEffect(() => {
    // const handleScroll = (event: any) => {
    //     console.log('hello scroll listener', event)
    // }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <Navbar
        // shouldHideOnScroll
        className={`px-[1.5rem] py-[0.75rem] fixed`}
        style={{
          // position: isHeaderTop ? 'fixed' : 'sticky',
          background: isHeaderTop ? "transparent" : "hsla(0,0%,9%,.88)",
        }}
        maxWidth="full"
        isBlurred={false}
      >
        <NavbarBrand className="flex items-end">
          {/* <Logo /> */}

          <a href="https://zklink.io/">
            <LogoBox className="relative">
              <img className="max-w-[145.431px] h-auto" src="/img/NOVA.svg" />
              {/* <span className='logo-text'>zk.Link</span> */}
            </LogoBox>
          </a>

          <NavBox className="ml-[3.5rem]">
            <NavbarContent
              className="hidden sm:flex gap-[2.5rem]"
              justify="center"
            >
              <NavbarItem>
                <NavLink to="/aggregation-parade" className="nav-link">
                  Aggregation Parade
                </NavLink>
              </NavbarItem>
              <NavbarItem>
                <NavLink to="/leaderboard" aria-disabled>
                  Leaderboard
                </NavLink>
              </NavbarItem>
              <NavbarItem>
                <NavLink to="/about">About</NavLink>
              </NavbarItem>
              {/* <NavbarItem>
                <a
                  href={
                    nodeType === "nexus-goerli"
                      ? "https://goerli.portal.zklink.io/bridge/"
                      : "https://portal.zklink.io/bridge/"
                  }
                  target="_blank"
                  className="flex items-center"
                >
                  <span>Bridge</span>
                  <MdArrowOutward className="size-[1.75rem]" />
                </a>
              </NavbarItem> */}
            </NavbarContent>
          </NavBox>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavbarItem className="hidden flex items-center gap-[1rem]">
            {/* if the user has completed the invitation */}
            {false && (
              <div className="flex items-center gap-[0.5rem]">
                <div className="text-right">
                  <div className="text-[1rem] text-[#7E7E7E]">YOUR POINTS</div>
                  <div className="text-[1rem] text-[#fff]">2000</div>
                </div>
                <Avatar
                  className="w-[2.5625rem] h-[2.5625rem]"
                  src="/img/icon-avatar.svg"
                />
              </div>
            )}
            {/* <Button
                            className='bg-blue-950'
                            onClick={() => web3Modal.open({ view: 'Networks' })}>
                            Network
                        </Button> */}
            {depositStatus?
            (depositStatus === 'pending'? (
              <Button
                className='border-solid border-1 border-[#03D498] text-[#03D498] bg-[#000] ' title="Please allow a few minutes for your deposit to be confirmed on zkLink Nova.">
                Pending Deposit<div className="relative flex w-8 h-8"><i className="absolute w-full h-full rounded-full animate-spinner-ease-spin border-solid border-t-transparent border-l-transparent border-r-transparent border-3 border-b-current"></i><i className="absolute w-full h-full rounded-full opacity-75 animate-spinner-linear-spin border-dotted border-t-transparent border-l-transparent border-r-transparent border-3 border-b-current"></i></div>
              </Button>
            ):(
              <Button
                className='border-solid border-1 border-[#03D498] text-[#03D498]bg-[#000] ' title="Your funds have been deposited successfully.">
                Successful Deposit <img src="/img/success.svg" alt="" />
              </Button>
            ))
            :(<Button
                className='border-solid border-1 border-[#fff] text-[#fff]'
                onClick={() => window.location.href = (nodeType === "nexus-goerli"? "https://goerli.portal.zklink.io/bridge/": "https://portal.zklink.io/bridge/")}>
                Deposit History
            </Button>)}
            <Button
              className="bg-[#1D4138] text-[#03D498] px-4 flex justify-center items-center gap-[0.75rem]"
              disableAnimation
              onClick={() => web3Modal.open()}
            >
              <img width={20} height={20} src="/img/icon-wallet.svg" />
              <ButtonText>
                {isConnected ? showAccount(address) : "Connect wallet"}
              </ButtonText>
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
}
