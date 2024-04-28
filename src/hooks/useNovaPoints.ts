import {
  checkOkx,
  getAccountPoint,
  getLayerbankNovaPoints,
  getLinkswapNovaPoints,
  getNovaProjectPoints,
} from "@/api";
import { RootState } from "@/store";
import Decimal from "decimal.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";

export const OKX_POINTS = 5;

export default () => {
  const { address } = useAccount();
  const { invite } = useSelector((store: RootState) => store.airdrop);

  const [novaPoints, setNovaPoints] = useState(0);
  const [referPoints, setReferPoints] = useState(0);
  const [okxPoints, setOkxPoints] = useState(0);
  const [layerbankNovaPoints, setLayerbankNovaPoints] = useState(0);
  const [linkswapNovaPoints, setLinkswapNovaPoints] = useState(0);

  const getAccountPointFunc = useCallback(async () => {
    if (!address) {
      setNovaPoints(0);
      setReferPoints(0);
      return;
    }
    const { result } = await getAccountPoint(address);
    setNovaPoints(Number(result?.novaPoint) || 0);

    const apiReferPoints = Number(result?.referPoint) || 0;
    setReferPoints(
      !!invite?.triplePoints ? apiReferPoints * 3 : apiReferPoints
    );

    if (result?.novaPoint !== 0) {
      const okx = await checkOkx(address);
      setOkxPoints(okx ? OKX_POINTS : 0);
    }
  }, [address, invite?.triplePoints]);

  const getLayerbankNovaPointsFunc = async () => {
    if (!address) {
      setLayerbankNovaPoints(0);
      return;
    }
    const { data } = await getLayerbankNovaPoints(address);
    if (data && Array.isArray(data) && data.length > 0) {
      const points = data.reduce((prev, item) => prev + item.realPoints, 0);
      console.log("layerbankNovaPoints", points);
      setLayerbankNovaPoints(points);
    }
  };

  const getLinkswapNovaPointsFunc = async () => {
    if (!address) {
      setLinkswapNovaPoints(0);
      return;
    }
    const { data } = await getLinkswapNovaPoints(address);
    if (data?.pairs && Array.isArray(data.pairs) && data.pairs.length > 0) {
      const points = data.pairs.reduce(
        (prev, item) => prev + Number(item.novaPoint),
        0
      );
      setLinkswapNovaPoints(points);
    }
  };

  const trademarkPoints = useMemo(() => {
    const points = Number(invite?.points) || 0;
    return address ? points : 0;
  }, [invite?.points]);

  const kolPoints = useMemo(() => {
    const points =
      novaPoints !== 0 && invite?.kolGroup
        ? Decimal.mul(novaPoints, 0.05).toNumber()
        : 0;
    return address ? points : 0;
  }, [novaPoints, invite?.kolGroup]);

  const getAllNovaPoints = () => {
    getAccountPointFunc();
    getLayerbankNovaPointsFunc();
    getLinkswapNovaPointsFunc();
    getAquaNovaPointsFunc();
    getIzumiNovaPointsFunc();
  };

  const [aquaNovaPoints, setAquaNovaPoints] = useState(0);
  const getAquaNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "aqua");
    console.log("getNovaPointsFunc", data);

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setAquaNovaPoints(points);
  };

  const [izumiNovaPoints, setIzumiNovaPoints] = useState(0);
  const getIzumiNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "izumi");
    console.log("getNovaPointsFunc", data);

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setIzumiNovaPoints(points);
  };

  const dAppNovaPoints = useMemo(() => {
    return (
      layerbankNovaPoints +
      linkswapNovaPoints +
      aquaNovaPoints +
      izumiNovaPoints
    );
  }, [
    layerbankNovaPoints,
    linkswapNovaPoints,
    aquaNovaPoints,
    izumiNovaPoints,
  ]);

  useEffect(() => {
    getAllNovaPoints();
  }, [address]);

  const totalNovaPoints = useMemo(() => {
    const points =
      novaPoints +
      referPoints +
      layerbankNovaPoints +
      linkswapNovaPoints +
      izumiNovaPoints +
      aquaNovaPoints +
      trademarkPoints +
      okxPoints +
      kolPoints;
    return points;
  }, [
    novaPoints,
    referPoints,
    layerbankNovaPoints,
    linkswapNovaPoints,
    trademarkPoints,
    okxPoints,
    kolPoints,
    izumiNovaPoints,
    aquaNovaPoints,
  ]);

  return {
    novaPoints,
    referPoints,
    layerbankNovaPoints,
    linkswapNovaPoints,
    trademarkPoints,
    okxPoints,
    kolPoints,
    totalNovaPoints,
    izumiNovaPoints,
    aquaNovaPoints,
    dAppNovaPoints,
    getAllNovaPoints,
  };
};
