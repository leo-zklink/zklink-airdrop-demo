import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Avatar,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Link, NavLink, useSearchParams, useLocation } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import styled from "styled-components";
import { scrollToTop, showAccount } from "@/utils";
import { useEffect, useState } from "react";
import {
  setInvite,
  setSignature,
  airdropState,
  setTwitterAccessToken,
  setInviteCode,
  setIsActiveUser,
  setDepositTx,
  setSignatureAddress,
  setIsOkxFlag,
  setIsOkxUser,
  setApiToken,
} from "@/store/modules/airdrop";
import { useDispatch, useSelector } from "react-redux";
import { useBridgeTx } from "@/hooks/useBridgeTx";
import { authLogin, getInvite, okxVisitTask, visitReward } from "@/api";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { BrowserView } from "react-device-detect";
const nodeType = import.meta.env.VITE_NODE_TYPE;
import toast from "react-hot-toast";
import { eventBus } from "@/utils/event-bus";
import { AiOutlineDown } from "react-icons/ai";
import useSignature from "@/hooks/useSignature";
import ReferralModal from "./ReferralModal";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/hooks/useLanguageStore";
const Container = styled.div`
  .navbar {
    /* height: 92px; */
    /* border-bottom: 0.6px solid rgba(255, 255, 255, 0.4); */
    /* background: rgba(255, 255, 255, 0.1); */
    background: linear-gradient(90deg, #000811 0%, #000811 116.47%);
    backdrop-filter: blur(20px);
  }

  .nav-link {
    padding: 10px;
    color: #7e7e7e;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px; /* 137.5% */
    letter-spacing: -0.5px;

    &:hover,
    &.active {
      color: #fff;
      /* border-radius: 100px; */
      /* background: rgba(255, 255, 255, 0.14); */
    }
  }
`;

const NavNet = styled.div`
  background: #313841;
  border-radius: 5px;
  margin-left: 10px;
  div {
    width: 79px;
    height: 22px;
    flex-shrink: 0;
    font-family: Satoshi;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: -0.5px;
    background: linear-gradient(
      90deg,
      #48ecae 0%,
      #606ff2 51.07%,
      #49ced7 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }
`;
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
  /* color: var(--Black-1, var(--Black, #030d19)); */
  text-align: center;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 162.5% */
  background: linear-gradient(
    90deg,
    #4ba790 0%,
    rgba(251, 251, 251, 0.6) 50.31%,
    #9747ff 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export default function Header() {
  // const web3Modal = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const {
    depositStatus,
    depositL1TxHash,
    invite,
    isActiveUser,
    signatureAddress,
    signature,
    apiToken,
    inviteCode,
    isOkxFlag,
    isOkxUser,
  } = useSelector((store: { airdrop: airdropState }) => store.airdrop);

  const { getDepositL2TxHash } = useBridgeTx();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const location = useLocation();

  const visitRewardFunc = async () => {
    if (!address) return;
    await visitReward(address);
  };

  const okxVisitTaskFunc = async () => {
    if (!address) return;
    await okxVisitTask(address);
  };

  useEffect(() => {
    const queryInviteCode = searchParams.get("inviteCode");
    const flag = searchParams.get("flag");
    const u = searchParams.get("u");

    if (u && u.toLowerCase() === "okx") {
      dispatch(setIsOkxUser(true));
    }

    if (queryInviteCode && queryInviteCode.length === 6) {
      dispatch(setInviteCode(queryInviteCode));
    } else {
      dispatch(setInviteCode("zklink"));
    }

    if (flag) {
      const isOkx =
        flag.toLowerCase() === "okx" || flag.toLowerCase() === "bonus";
      dispatch(setIsOkxFlag(isOkx));
    }

    console.log("okxVisitTaskFunc", u);
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (address && isOkxFlag) {
      console.log("visitRewardFunc", address, isOkxFlag);
      visitRewardFunc();
    }
  }, [address, isOkxFlag]);

  useEffect(() => {
    if (address && isOkxUser) {
      console.log("okxVisitTaskFunc", address, isOkxUser);
      okxVisitTaskFunc();
    }
  }, [address, isOkxUser]);

  useEffect(() => {
    if (location.pathname.includes("invite")) {
      const code = location.pathname.substring(
        location.pathname.lastIndexOf("/") + 1
      );
      if (code && code.length === 6) {
        dispatch(setInviteCode(code));
      }
    }
  }, [dispatch, location.pathname]);

  //Fix: remove for now
  // useEffect(() => {
  //   (async () => {
  //     if (!depositL1TxHash) {
  //       dispatch(setDepositStatus(""));
  //       return;
  //     } else {
  //       dispatch(setDepositStatus("pending"));
  //       setTimeout(() => {
  //         dispatch(setDepositL1TxHash(""));
  //         dispatch(setDepositStatus(""));
  //       }, 30 * 1000); //avoid wait to long
  //       const l2hash = await getDepositL2TxHash(
  //         depositL1TxHash as `0x${string}`
  //       );
  //       if (l2hash) {
  //         dispatch(setDepositL1TxHash(""));
  //         dispatch(setDepositStatus("success"));
  //         setTimeout(() => {
  //           dispatch(setDepositStatus(""));
  //         }, 5000);
  //       }
  //     }
  //   })();
  // }, [depositL1TxHash, getDepositL2TxHash, dispatch, depositStatus]);

  const [isHeaderTop, setIsHeaderTop] = useState(true);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsHeaderTop(false);
    } else {
      setIsHeaderTop(true);
    }
  };
  const getInviteFunc = async () => {
    if (!address || !apiToken) return;

    console.log("getInviteFunc ===========", address, apiToken);
    try {
      const res = await getInvite(address);
      if (res?.result) {
        dispatch(setInvite(res?.result));
      }
    } catch (error) {
      if ((error as any)?.statusCode) {
        console.log("invite error", error);
        localStorage.removeItem("API_TOKEN");
        dispatch(setApiToken(""));
      }
    }
  };

  useEffect(() => {
    eventBus.on("getInvite", getInviteFunc);
    return () => {
      eventBus.remove("getInvite", getInviteFunc);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { handleSign } = useSignature();
  const getJWT = async () => {
    if (!address || !signature) return;
    const res = await authLogin({
      address,
      signature,
    });
    console.log("auth login", res);

    if (res.status === "0" && !!res?.result) {
      dispatch(setApiToken(res.result));
      localStorage.setItem("API_TOKEN", res.result);
      // window.location.reload();
      // forceUpdate();
    }
  };

  useEffect(() => {
    if (!!signatureAddress && !!address && address !== signatureAddress) {
      onDisconnect();
      dispatch(setApiToken(""));
      localStorage.removeItem("API_TOKEN");
    }
  }, [signatureAddress, address, signature]);

  useEffect(() => {
    if (address && !signature) {
      handleSign();
    }
  }, [address, signature]);

  useEffect(() => {
    if (signature && !apiToken) {
      getJWT();
    }
  }, [signature, apiToken]);

  useEffect(() => {
    if (address && apiToken) {
      getInviteFunc();
    }
  }, [apiToken, address]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (address && signature) {
      timer = setInterval(() => {
        // This will run every hour
        getJWT();
      }, 60 * 60 * 1000);
    } else {
      timer && clearInterval(timer);
    }

    return () => {
      timer && clearInterval(timer);
    };
  }, [address, signature]);

  useEffect(() => {
    if (!isConnected) {
      dispatch(setSignature(""));
      dispatch(setSignatureAddress(""));
      dispatch(setDepositTx(""));
      dispatch(setInvite(null));
      dispatch(setApiToken(""));
      localStorage.removeItem("API_TOKEN");
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (isConnected && Boolean(invite?.code)) {
      dispatch(setIsActiveUser(true));
    } else {
      dispatch(setIsActiveUser(false));
    }
  }, [invite, isConnected, address]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { connectors, disconnect } = useDisconnect();

  const onDisconnect = async () => {
    if (isConnected || address) {
      for (const connector of connectors) {
        //maybe multi connectors. disconnct all.
        await disconnect({ connector });
      }
      await disconnect();
      console.log("=====================>disconnect");
    }
  };

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    toast.success("Copied", { duration: 2000 });
  };

  const handleWallectAction = (key: string | number) => {
    console.log("handleWallectAction", key);

    if (key === "copy") {
      handleCopyAddress();
    } else if (key === "explorer") {
      window.open(`https://explorer.zklink.io/address/${address}`, "_blank");
    } else if (key === "disconnect") {
      onDisconnect();
    }
  };
  useEffect(() => {
    const anchor = searchParams.get("anchor");
    if (!anchor) {
      scrollToTop();
    }
  }, [location.pathname]);

  const langs = [
    { name: "English", key: "en" },
    { name: "한국어", key: "ko" },
    { name: "简体中文", key: "zh_CN" },
  ];

  // const [selectedLang, setLanguage] = useState("en");

  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const handleLanguage = (key: string | number) => {
    setLanguage(key as string);
    i18n.changeLanguage(key as string);
  };

  return (
    <Container>
      <Navbar
        // shouldHideOnScroll
        className={`navbar md:px-[1.5rem] md:h-[92px] fixed pt-0 ${
          isMenuOpen ? "bg-mobile" : ""
        }`}
        style={
          {
            // position: isHeaderTop ? 'fixed' : 'sticky',
            // background: isHeaderTop ? "transparent" : "hsla(0,0%,9%,.88)",
          }
        }
        maxWidth="full"
        isBlurred={false}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          {/* <Logo /> */}

          <Link to="/" onClick={() => dispatch(setTwitterAccessToken(""))}>
            <LogoBox
              className="relative"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <img
                className="max-w-[150px] md:max-w-[145.431px] h-auto"
                src="/img/NOVA.svg"
              />
              {/* <span className='logo-text'>zk.Link</span> */}
            </LogoBox>
          </Link>
          {/* <NavNet className="hidden md:flex">
            <div>Mainnet Live</div>
          </NavNet> */}
          {/* <NavBox> */}
          <NavbarContent className="hidden md:flex" justify="center">
            <NavbarItem>
              <NavLink to="/aggregation-parade" className="nav-link">
                Aggregation Parade
              </NavLink>
            </NavbarItem>
            {/* <NavbarItem>
                {isActive() ? (
                  <NavLink to="/dashboard" className="nav-link">
                    Dashboard
                  </NavLink>
                ) : (
                  <Tooltip content="Not Active">
                    <span className="nav-link cursor-not-allowed opacity-40">
                      Dashboard
                    </span>
                  </Tooltip>
                )}
              </NavbarItem> */}

            <NavbarItem>
              <a
                href="https://zklink.io/novadrop"
                className="nav-link"
                target="_blank"
              >
                NovaDrop🔥
              </a>
            </NavbarItem>
            <NavbarItem>
              <NavLink to="/leaderboard" className={"nav-link"}>
                {t("header.leaderboard")}
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink to="/bridge" className={"nav-link"}>
                {t("header.bridge")}
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <a
                href="https://zk.link/governance"
                target="_blank"
                className={"nav-link"}
              >
                Governance
              </a>
            </NavbarItem>
            <NavbarItem>
              <NavLink to="/about" className={"nav-link"}>
                {t("header.about")}
              </NavLink>
            </NavbarItem>

            <Dropdown>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="nav-link p-0 bg-transparent data-[hover=true]:bg-transparent"
                    radius="sm"
                    variant="light"
                  >
                    {t("header.useful_tools")} <AiOutlineDown />
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label="ACME features"
                className="w-[10rem]"
                itemClasses={{
                  base: "gap-4",
                }}
              >
                <DropdownItem key="merge-token">
                  <a href="https://zklink.io/merge" target="_blank">
                    Merge Token
                  </a>
                </DropdownItem>
                <DropdownItem key="unwrap">
                  <NavLink to="/unwrap">Unwrap ETH</NavLink>
                </DropdownItem>
                <DropdownItem key="user-guide">
                  <a
                    href="https://blog.zk.link/user-onboarding-guide-zklink-nova-aggregation-parade-07861acb48e7"
                    target="_blank"
                  >
                    User Guide
                  </a>
                </DropdownItem>
                <DropdownItem key="user-guide">
                  <a href="https://explorer.zklink.io/" target="_blank">
                    Explorer
                  </a>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* <NavbarItem>
              <a href="https://zklink.io/merge" target="_blank">
                Merge Token
              </a>
            </NavbarItem>
           
            <NavbarItem>
              <NavLink to="/unwrap">Unwrap ETH</NavLink>
            </NavbarItem>
            <NavbarItem>
              <a
                href="https://blog.zk.link/user-onboarding-guide-zklink-nova-aggregation-parade-07861acb48e7"
                target="_blank"
              >
                User Guide
              </a>
            </NavbarItem>
            <NavbarItem>
              <a href="https://explorer.zklink.io/" target="_blank">
                Explorer
              </a>
            </NavbarItem> */}

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
          {/* </NavBox> */}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="hidden flex items-center gap-[1rem]">
            <Dropdown disableAnimation>
              <DropdownTrigger>
                <div className="w-[40px] h-[40px] rounded-full border-1 border-[#282828] bg-[#10131C] flex justify-center itmes-center">
                  <img
                    src="/img/icon-language.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                </div>
              </DropdownTrigger>
              <DropdownMenu onAction={(key) => handleLanguage(key)}>
                {langs.map((lang) => (
                  <DropdownItem key={lang.key}>
                    {
                      <div className="flex justify-between items-center">
                        <span>{lang.name}</span>
                        {lang.key === language && (
                          <img
                            src="/img/icon-right-gradient.svg"
                            alt=""
                            width={18}
                            height={18}
                          />
                        )}
                      </div>
                    }
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {address && depositStatus && (
              <>
                {depositStatus === "pending" && (
                  <Tooltip
                    showArrow={true}
                    classNames={{
                      content: "max-w-[300px] p-4",
                    }}
                    content="Please allow a few minutes for your deposit to be confirmed on zkLink Nova."
                  >
                    <Button className="border-solid border-1 border-[#03D498] text-[#03D498] bg-[#000] ">
                      Pending Deposit
                      <div className="relative flex w-6 h-6">
                        <i className="absolute w-full h-full rounded-full animate-spinner-ease-spin border-solid border-t-transparent border-l-transparent border-r-transparent border-3 border-b-current"></i>
                        <i className="absolute w-full h-full rounded-full opacity-75 animate-spinner-linear-spin border-dotted border-t-transparent border-l-transparent border-r-transparent border-3 border-b-current"></i>
                      </div>
                    </Button>
                  </Tooltip>
                )}
                {depositStatus === "success" && (
                  <Tooltip
                    showArrow={true}
                    classNames={{
                      content: "max-w-[300px] p-4",
                    }}
                    content="Your funds have been deposited successfully."
                  >
                    <Button className="border-solid border-1 border-[#03D498] text-[#03D498]bg-[#000] ">
                      Successful Deposit <img src="/img/success.svg" alt="" />
                    </Button>
                  </Tooltip>
                )}
              </>
            )}
            {/* <a href="https://discord.com/invite/zklink" target="_blank">
              <img src="/img/icon-dc.svg" className="w-[1.5rem] h-[1.5rem]" />
            </a>
            <a href="https://twitter.com/zkLink_Official" target="_blank">
              <img
                src="/img/icon-twitter.svg"
                className="w-[1.25rem] h-[1.25rem]"
              />
            </a> */}
            {/* {address && !depositStatus && (
              <Button
                className="hidden md:block border-solid border-1 border-[#03D498] text-[#03D498] bg-transparent font-bold"
                onClick={() =>
                  window.open(
                    nodeType === "nexus-goerli"
                      ? "https://goerli.portal.zklink.io/transfers"
                      : "https://portal.zklink.io/transfers",
                    "_blank"
                  )
                }
              >
                Deposit History
              </Button>
            )} */}
            {address && <ReferralModal />}
            {/* <Button onClick={onDisconnect}>disconnect</Button> */}

            {isConnected && address ? (
              <Dropdown disableAnimation>
                <DropdownTrigger>
                  <Button
                    // variant="bordered"
                    className="px-[24px] py-[20px] md:h-[52px] bg-[#282828] rounded-[100px] flex justify-center items-center md:gap-[10px]"
                    disableAnimation
                  >
                    <img width={20} height={20} src="/img/icon-s2-wallet.svg" />

                    {/* <ConnectButton /> */}
                    <ButtonText
                      className={`${isConnected ? "ml-2 md:ml-0" : ""}`}
                    >
                      {showAccount(address)}
                    </ButtonText>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu onAction={(key) => handleWallectAction(key)}>
                  <DropdownItem key="copy">
                    <span>Copy</span>
                  </DropdownItem>
                  <DropdownItem key="explorer">Explorer</DropdownItem>
                  <DropdownItem
                    key="disconnect"
                    className="text-danger"
                    color="danger"
                  >
                    Disconnect
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <ConnectButton.Custom>
                {({ chain }) => (
                  <Button
                    className="px-[24px] py-[20px] md:h-[52px] bg-[#282828] rounded-[100px] flex justify-center items-center md:gap-[10px]"
                    disableAnimation
                    // onClick={() => web3Modal.open()}
                    onClick={() => {
                      if (chain?.unsupported) {
                        openChainModal?.();
                      } else if (isConnected && address) {
                        openAccountModal?.();
                      } else {
                        openConnectModal?.();
                      }
                    }}
                  >
                    <img width={20} height={20} src="/img/icon-s2-wallet.svg" />

                    {/* <ConnectButton /> */}
                    <ButtonText
                      className={`${isConnected ? "ml-2 md:ml-0" : ""}`}
                    >
                      {isConnected ? (
                        showAccount(address)
                      ) : (
                        <span className="hidden md:block">Connect Wallet</span>
                      )}
                    </ButtonText>
                  </Button>
                )}
              </ConnectButton.Custom>
            )}
          </NavbarItem>
        </NavbarContent>
        {/* mobile toggle button */}
        <NavbarMenuToggle
          className="ml-2 md:hidden text-[1.25rem]"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          icon={isMenuOpen ? <FaTimes /> : <FaBars />}
        />
        <NavbarMenu
          className={`navbar-menu md:px-[1.5rem] py-[0.75rem] fixed pt-4 gap-4`}
          style={{
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
          onClick={() => {
            setIsMenuOpen(false);
          }}
        >
          <NavbarMenuItem
            isActive={location.pathname === "/aggregation-parade"}
          >
            <NavLink to="/aggregation-parade" className="nav-link block">
              Aggregation Parade
            </NavLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <a href="https://zklink.io/novadrop" target="_blank">
              NovaDrop🔥
            </a>
          </NavbarMenuItem>

          {/* <NavbarMenuItem>
                {isActive() ? (
                  <NavLink to="/dashboard" className="nav-link">
                    Dashboard
                  </NavLink>
                ) : (
                  <Tooltip content="Not Active">
                    <span className="nav-link cursor-not-allowed opacity-40">
                      Dashboard
                    </span>
                  </Tooltip>
                )}
              </NavbarMenuItem> */}
          <NavbarMenuItem isActive={location.pathname === "/leaderboard"}>
            <NavLink to="/leaderboard" className="block">
              Leaderboard
            </NavLink>
          </NavbarMenuItem>

          <NavbarMenuItem isActive={location.pathname === "/about"}>
            <a
              href="https://zk.link/governance"
              target="_blank"
              className="block"
            >
              About
            </a>
          </NavbarMenuItem>

          <NavbarMenuItem isActive={location.pathname === "/about"}>
            <NavLink to="/about" className="block">
              About
            </NavLink>
          </NavbarMenuItem>

          <NavbarMenuItem isActive={location.pathname === "/bridge"}>
            <NavLink to="/bridge" className="block">
              Bridge
            </NavLink>
          </NavbarMenuItem>

          <Dropdown>
            <NavbarMenuItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  radius="sm"
                  variant="light"
                >
                  <NavbarMenuItem className="flex items-center gap-2">
                    Useful Tools <AiOutlineDown />
                  </NavbarMenuItem>
                </Button>
              </DropdownTrigger>
            </NavbarMenuItem>
            <DropdownMenu
              aria-label="ACME features"
              className="w-[10rem]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem key="merge-token">
                <NavbarMenuItem>
                  <a
                    href="https://zklink.io/merge"
                    target="_blank"
                    className="block"
                  >
                    Merge Token
                  </a>
                </NavbarMenuItem>
              </DropdownItem>
              <DropdownItem key="unwrap">
                <NavbarMenuItem isActive={location.pathname === "/bridge"}>
                  <NavLink to="/unwrap" className="block">
                    Unwrap wETH
                  </NavLink>
                </NavbarMenuItem>
              </DropdownItem>
              <DropdownItem key="user-guide">
                <NavbarMenuItem>
                  <a
                    href="https://blog.zk.link/user-onboarding-guide-zklink-nova-aggregation-parade-07861acb48e7"
                    target="_blank"
                    className="block"
                  >
                    User Guide
                  </a>
                </NavbarMenuItem>
              </DropdownItem>
              <DropdownItem key="user-guide">
                <NavbarMenuItem>
                  <a
                    href="https://explorer.zklink.io/"
                    target="_blank"
                    className="block"
                  >
                    Explorer
                  </a>
                </NavbarMenuItem>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {/* <NavbarMenuItem>
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
              </NavbarMenuItem> */}
          {/* Footer: nav links */}
          <div className="absolute right-[6rem] bottom-[3rem] flex justify-end items-end">
            <div className="flex items-center gap-[1.25rem]">
              <a href="https://blog.zk.link/" target="_blank">
                <img
                  src="/img/icon-medium.svg"
                  className="w-[1.5rem] h-[1.5rem]"
                />
              </a>
              <a href="https://discord.com/invite/zklink" target="_blank">
                <img src="/img/icon-dc.svg" className="w-[1.5rem] h-[1.5rem]" />
              </a>
              <a href="https://t.me/zkLinkorg">
                <img src="/img/icon-tg.svg" className="w-[1.5rem] h-[1.5rem]" />
              </a>
              <a href="https://twitter.com/zkLink_Official" target="_blank">
                <img
                  src="/img/icon-twitter.svg"
                  className="w-[1.25rem] h-[1.25rem]"
                />
              </a>
              <a href="https://github.com/zkLinkProtocol" target="_blank">
                <img
                  src="/img/icon-github.svg"
                  className="w-[1.5rem] h-[1.5rem]"
                />
              </a>
            </div>
          </div>
        </NavbarMenu>
      </Navbar>

      <BrowserView>
        {connectModalOpen && !address && (
          <div className="fixed bottom-[0rem] w-full text-center z-[2147483647] bg-[#09171e] py-[1rem] text-[1rem] ">
            <p className="text-[#C57D10] font-[700]">
              WalletConnect can be slow sometimes. If the QR code doesn't show
              up after 1 minute, please refresh the page and try again.
            </p>
            <p className="mt-2 text-[#C57D10] font-[700]">
              If you're using MetaMask or OKX Wallet on your mobile device, we
              suggest accessing app.zklink.io directly through the in-app
              browser.
            </p>
          </div>
        )}
      </BrowserView>
    </Container>
  );
}
