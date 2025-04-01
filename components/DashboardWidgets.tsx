import { ArrowDownRight } from "lucide-react";

type DashboardWidgetsProps = {
  container?: string;
  wrapper?: string;
};

const DashboardWidgets = ({ container, wrapper }: DashboardWidgetsProps) => {
  return (
    <div className={` ${container}`}>
      <div className={`${wrapper} rounded-xl flex flex-col items-center justify-center p-4 gap-4`}>
        <p className="text-xl font-medium underline">Total Deposits</p>
        <span className="text-3xl font-bold">$4,000,000</span>
        <div className="flex items-center gap-2  mt-2">
          <ArrowDownRight />
          <span>$1,000,000 (+5%)</span>
        </div>
      </div>
      <div className={`${wrapper} rounded-xl flex flex-col items-center justify-center p-4 gap-4`}>
        <p className="text-xl font-medium underline">Active Loans</p>
        <span className="text-3xl font-bold">$12,000,000</span>
        <div className="flex items-center gap-2  mt-2">
          <ArrowDownRight />
          <span>$5,000 (+5%)</span>
        </div>
      </div>
      <div className={`${wrapper} rounded-xl flex flex-col items-center justify-center p-4 gap-4`}>
        <p className="text-xl font-medium underline">Total Value Locked</p>
        <span className="text-3xl font-bold">$1,000,000</span>
        <div className="flex items-center gap-2  mt-2">
          <ArrowDownRight />
          <span>$600,000 (+5%)</span>
        </div>
      </div>
      <div className={`${wrapper} rounded-xl flex flex-col items-center justify-center p-4 gap-4`}>
        <p className="text-xl font-medium underline">Total Supply</p>
        <span className="text-3xl font-bold">$600,000</span>
        <div className="flex items-center gap-2  mt-2">
          <ArrowDownRight />
          <span>$10,000 (+5%)</span>
        </div>
      </div>
    </div>
  );
};
export default DashboardWidgets;
