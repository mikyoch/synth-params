import NewParamRow from "./Param.New.Row";
import ParamRow, { Row } from "./Param.Row";

interface Props {
  data: Row[]
}

export default function Params(props: Props) {
  return <table className="border border-white border-collapse mb-4">
    <thead>
      <tr className="border border-white">
        <th>UID</th>
        <th>dir</th>
        <th>gap</th>
        <th>Updated at</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {props?.data?.map((item) => (
        <ParamRow {...item} key={item.uid} />
      ))}
      <NewParamRow />
    </tbody>
  </table>
}