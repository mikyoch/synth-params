"use client";

import { useState } from "react";
import NewParamRow from "./Param.New.Row";
import ParamRow, { Row } from "./Param.Row";

interface Props {
  data: Row[];
}

export default function Params(props: Props) {
  const [gapSort, setGapSort] = useState<"asc" | "desc">("asc");
  const [gapEthSort, setGapEthSort] = useState<"asc" | "desc">("desc");
  const [gapXAUSort, setGapXAUSort] = useState<"asc" | "desc">("desc");

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
          ?.map((item, index) => (
            <ParamRow {...item} key={item.uid} noIndex={index + 1} />
          ))}
        <NewParamRow />
      </tbody>
    </table>
  );
}
