"use client";
import React from "react";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

interface ColdkeyType {
  coldkey: string;
}

const Reward = ({
  miners,
  coldkeys,
}: {
  miners: number[];
  coldkeys: ColdkeyType[];
}) => {
  // const coldkeys: ColdkeyType[] = [
  //   { coldkey: "5GbbMSnv7y7XXtytqmycScBqdA7Ua8yF5u1ukvbBL9iX6A2G" },
  //   { coldkey: "5CLejgSh3rnbmiJciMB6vBZZT5rUfhD9jVHbioMafZA8s1C2" },
  //   { coldkey: "5FJ6JDExGvk9X3CDHWSCZJ5Li5WuPmTr2XwkwMUhtYhRJTBp" },
  //   { coldkey: "5GmaxyURK1m5rxeqNctt2DPu7ojuXXEpyzKXG9dXy7A1FLZe" },
  //   { coldkey: "5HMZniFCP4x4AkgxAB1o7iKXamrzsUFZVP9vyaLAxpS73pq4" },
  //   { coldkey: "5EFcM8exQHQgKEZeT5pStPkeHfo2Zog39nweRHRyXKY58emv" },
  //   { coldkey: "5C5uVLTBVvoJ3x5MbEB357dX6JZxakjrLN2tptBrkUjk2nbx" },
  //   { coldkey: "5EAVQBPPQeummcbRxMypCFyhi1pSNN97MdhMAnAcmuWeXoSU" },
  //   { coldkey: "5F4vkn5313ap5ZKZeQP4whre883udmVuYWSGjWpX8qatxb9u" },
  //   { coldkey: "5Cg2ujKPDiGTDtX198hio2wb32QpecWg4k6CNhV9Vo9dkTkS" },
  //   { coldkey: "5HeScuTaPpSdZZwdmEvYKsYehVxidNL1aZKvaaxVv8TXqKrd" },
  //   { coldkey: "5CDQSm1sF1xKX4XNxPQgkmqEVuW1cYW7Esy1zsDp7RDhFi4f" },
  //   { coldkey: "5DZq3VjNem4ixv2kAUax6zdKiCv8qnhWyUbzWisiB8VkKTT4" },
  //   { coldkey: "5G745h1mnJshTRWGoqSsArrapDjVZFqXzUaLTgXh9m4z248M" },
  //   { coldkey: "5H9TtV7otEeToAGSYu6LJjPAz3zRgPkyQYr44MWFbw6nJdDy" },
  // ];

  const { data, error, isLoading } = useSWR("/api/getRewards", fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 200000,
  });

  const isColdKeyOwnedByMiner = (coldkey: string): boolean => {
    return coldkeys.some(
      (el) => el?.coldkey?.toLowerCase() === coldkey.toLowerCase()
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (data) {
    const sortedData = data?.sort(
      (a: any, b: any) => b.incentive - a.incentive
    );
    const addedGrade = sortedData?.map((item: any, index: number) => ({
      ...item,
      grade: index + 1,
    }));
    const filteredData = addedGrade?.filter((item: any) =>
      miners?.includes(item.uid)
    );
    const Result = filteredData?.map((item: any) => ({
      Grade: item.grade,
      UID: item.uid,
      Stake: item.stake,
      Incentive: item.incentive,
      Performance: item.minerPerformance,
      daily: item.taoPerDay,
      Score: item.score,
      coldkey: item?.coldkey,
      registeredAtBlock: item?.registeredAtBlock,
      registeredAt: item?.registeredAt,
      ip: item.ip,
    }));
    const total_stake = filteredData?.reduce(
      (acc: number, item: any) => acc + item.stake,
      0
    );
    const total_daily = filteredData?.reduce(
      (acc: number, item: any) => acc + item.taoPerDay,
      0
    );
    if (window) {
      (window as any).total_daily = total_daily;
      (window as any).my_top_miner_performance =
        filteredData[0].minerPerformance;
      (window as any).my_top_miner_uid = filteredData[0].uid;
      (window as any).my_top_miner_grade = filteredData[0].grade;

      let grade = 0,
        performance = 0;
      for (let i = 0; i < filteredData.length; i++) {
        grade += filteredData[i].grade;
        performance += filteredData[i].minerPerformance;
      }

      (window as any).my_avg_performance = performance / filteredData.length;
      (window as any).my_avg_performance_grade = grade / filteredData.length;
    }

    return (
      <div className="w-full p-10 border border-white rounded-2xl border-collapse">
        <div className="flex flex-col gap-5">
          <div className="text-2xl font-bold text-center">Rewards</div>
          <table className="text-md">
            <thead>
              <tr className="border border-white">
                <th className="py-2">UID</th>
                <th className="py-2">Grade</th>
                {/* <th className='py-2'>Stake</th> */}
                {/* <th className='py-2'>Incentive</th> */}
                {/* <th className='py-2'>Performance</th> */}
                <th className="py-2">Daily</th>
                <th className="py-2">Coldkey</th>
                <th className="py-2">Time</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {Result?.map((item: any) => (
                <tr key={`reward-${item.UID}`} className="border border-white">
                  <td className="text-center transition-all duration-300 cursor-pointer">
                    {item.UID}
                  </td>
                  <td className="text-center">{item.Grade}</td>
                  {/* <td className='text-center'>{Number(item.Stake).toFixed(3)}</td> */}
                  {/* <td className='text-center'>{Number(item.Incentive).toFixed(8)}</td> */}
                  {/* <td className='text-center'>{Number(item.Performance).toFixed(2)}</td> */}
                  <td className="text-center">
                    {Number(item.daily).toFixed(3)}
                  </td>
                  <td className="text-center">
                    {item?.coldkey?.slice(0, 9) + "..."}
                  </td>
                  <td className="text-center">
                    {new Date(item.registeredAt).toLocaleString()}
                  </td>
                  <td className="text-center">
                    {isColdKeyOwnedByMiner(item?.coldkey || "") ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col gap-2 mt-4 justify-center items-center">
            <span>Total Daily: {total_daily}</span>
            <span>Total Stake: {total_stake}</span>
          </div>
        </div>
      </div>
    );
  }
};

export default Reward;
