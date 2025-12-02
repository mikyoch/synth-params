"use client";
import { fetcher } from "@/utils/fetcher";
import React, { useState } from "react";
import useSWR from "swr";

const Score = ({ miners }: { miners: number[] }) => {
  const [asset, setAsset] = useState("ETH");
  const [type, setType] = useState<"ONE_HOUR" | "ONE_DAY">("ONE_DAY");

  const buildUrl = (type: "ONE_HOUR" | "ONE_DAY", asset: string) => {
    const endpoints = {
      ONE_HOUR: {
        time_increment: 60,
        time_length: 3600,
      },
      ONE_DAY: {
        time_increment: 300,
        time_length: 86400,
      },
    };

    const cfg = endpoints[type];

    return `https://synth.mode.network/validation/scores/latest?asset=${asset}&time_increment=${cfg.time_increment}&time_length=${cfg.time_length}`;
  };

  const url = buildUrl(type, asset);

  console.log(url);

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 200000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (data && !error && Array.isArray(data)) {
    const scoreSortedData = data?.sort((a: any, b: any) => {
      const aValue = a.crps < 0 ? 1e8 : a.crps;
      const bValue = b.crps < 0 ? 1e8 : b.crps;
      return aValue - bValue;
    });

    const addedGradeScore = scoreSortedData?.map(
      (item: any, index: number) => ({
        ...item,
        grade: index + 1,
      })
    );

    const filteredData = addedGradeScore?.filter((item: any) =>
      miners?.includes(item.miner_uid)
    );

    if (window) {
      (window as any).my_miner_top_score_uid = filteredData[0]?.miner_uid;
      (window as any).my_miner_top_score_grade = filteredData[0]?.grade;
      (window as any).my_miner_top_score = filteredData[0]?.crps;

      let grade = 0,
        score = 0;
      for (let i = 0; i < filteredData.length; i++) {
        grade += filteredData[i].grade;
        score += filteredData[i].crps;
      }
      (window as any).my_avg_score = score / filteredData.length;
      (window as any).my_avg_score_grade = grade / filteredData.length;
    }

    const top = {
      SNID: 50,
      UID: addedGradeScore[0].miner_uid,
      Score: addedGradeScore[0].prompt_score,
      Grade: addedGradeScore[0].grade,
    };
    return (
      <div className="w-fit p-10 border border-white rounded-2xl">
        <div className="flex flex-col gap-5">
          <div className="flex flex-row items-center justify-between">
            <div className="text-2xl font-bold text-center">Score</div>
            <select
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              value={type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setType(e.target.value as "ONE_HOUR" | "ONE_DAY")
              }
            >
              <option value="ONE_DAY">Day</option>
              <option value="ONE_HOUR">Hour</option>
            </select>
            <select
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
            >
              <option value="ETH">ETH</option>
              <option value="BTC">BTC</option>
              <option value="XAU">XAU</option>
              <option value="SOL">SOL</option>
            </select>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="py-2">UID</th>
                <th className="py-2">Score</th>
                <th className="py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">{top.UID}</td>
                <td className="text-center px-10">
                  {Number(top.Score)?.toFixed(6)}
                </td>
                <td className="text-center">{top.Grade}</td>
              </tr>
              {filteredData.map((item: any) => (
                <tr>
                  <td className="text-center transition-all duration-300 cursor-pointer">
                    {item.miner_uid}
                  </td>
                  <td className="text-center">
                    {Number(item.prompt_score)?.toFixed(6)}
                  </td>
                  <td className="text-center">{item.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-fit p-10 border border-white rounded-2xl text-md">
        No data available
      </div>
    );
  }
};

export default Score;
