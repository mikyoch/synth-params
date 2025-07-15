"use client";

import { useState } from "react";
import NewParamRow from "./Param.New.Row";
import ParamRow, { Row } from "./Param.Row";

import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

interface Props {
  miners: number[];
  data: Row[];
}

export default function Params(props: Props) {
  const [gapSort, setGapSort] = useState<"asc" | "desc">("asc");
  const [gapEthSort, setGapEthSort] = useState<"asc" | "desc">("desc");
  const [gapXAUSort, setGapXAUSort] = useState<"asc" | "desc">("desc");

  const { data, error, isLoading } = useSWR("/api/getRewards", fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 600000,
  });
  let filteredData = [];
  if (!isLoading && data && !error && Array.isArray(data)) {
    filteredData = data
      ?.sort((a: any, b: any) => b.incentive - a.incentive)
      ?.filter((item: any) => props.miners?.includes(item.uid))
      ?.map((item: any, index: number) => ({
        ...item,
        grade: index + 1,
      }));
  }

  return (
    <table className="border border-white border-collapse mb-4">
      <thead>
        <tr className="border border-white">
          <th>No</th>
          <th>UID</th>
          <th>Owner</th>
          <th>index</th>
          <th>dir</th>
          <th
            className="cursor-pointer flex justify-center items-center gap-x-1 mx-auto"
            onClick={() => {
              setGapSort("asc");
              setGapEthSort("desc");
              setGapXAUSort("desc");
            }}
          >
            gap{" "}
            <span className={gapSort === "asc" ? "" : "rotate-180"}>⬆️</span>
          </th>
          <th>dirEth</th>
          <th
            className="cursor-pointer flex justify-center items-center gap-x-1 mx-auto"
            onClick={() => {
              setGapSort("desc");
              setGapEthSort("asc");
              setGapXAUSort("desc");
            }}
          >
            gapEth{" "}
            <span className={gapEthSort === "asc" ? "" : "rotate-180"}>⬆️</span>
          </th>
          <th>dirXAU</th>
          <th
            className="cursor-pointer flex justify-center items-center gap-x-1 mx-auto"
            onClick={() => {
              setGapSort("desc");
              setGapEthSort("desc");
              setGapXAUSort("asc");
            }}
          >
            gapXAU{" "}
            <span className={gapXAUSort === "asc" ? "" : "rotate-180"}>⬆️</span>
          </th>
          <th>Updated at</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {props?.data
          ?.sort((a, b) => {
            if (gapXAUSort === "asc") {
              if (a.gapXAU === b.gapXAU)
                return (
                  Math.abs(a.dirXAU[a.index]) - Math.abs(b.dirXAU[a.index])
                );
              return gapXAUSort === "asc"
                ? b.gapXAU - a.gapXAU
                : a.gapXAU - b.gapXAU;
            }
            if (gapEthSort === "asc") {
              if (a.gapEth === b.gapEth)
                return (
                  Math.abs(a.dirEth[a.index]) - Math.abs(b.dirEth[a.index])
                );
              return gapEthSort === "asc"
                ? b.gapEth - a.gapEth
                : a.gapEth - b.gapEth;
            }
            if (a.gap === b.gap)
              return Math.abs(a.dir[a.index]) - Math.abs(b.dir[a.index]);
            return gapSort === "asc" ? b.gap - a.gap : a.gap - b.gap;
          })
          ?.map((item, index) => {
            let rank = null;
            if (filteredData?.length > 0) {
              const found = filteredData.find(
                (data: any) => data.uid === item.uid
              );
              if (found) {
                rank = found.grade;
              } else {
                rank = null;
              }
            }
            return (
              <ParamRow
                {...item}
                key={item.uid}
                noIndex={index + 1}
                rank={rank}
              />
            );
          })}
        <NewParamRow />
      </tbody>
    </table>
  );
}
