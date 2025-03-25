const Dashboard = () => {
  return (
    <div className="mt-20 px-10">
      <div className="pb-10">
        <p className="font-bold mb-10">Dashboard</p>
        <div className="grid-cols-1 grid md:grid-cols-3 lg:grid-cols-6 gap-10">
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-5 py-7">
            <p className="text-base mb-5">Daily Prices</p>
            <div className="flex items-center gap-10">
              <p className="text-xl font-bold">$1208</p>
              <p className="text-lg text-green-500">4.05%</p>
            </div>
          </div>
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-10 py-7">
            <p className="text-base mb-5">Daily Notebook</p>
            <div className="">
              <p className="text-xl font-bold">08</p>
            </div>
          </div>
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-10 py-7">
            <p className="text-base mb-5">Total Contracts</p>
            <div className="flex items-center gap-10">
              <p className="text-xl font-bold">32</p>
              <p className="text-lg text-green-500">0.05%</p>
            </div>
          </div>
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-5 py-7">
            <p className="text-base mb-5">Completed Contracts</p>
            <div className="">
              <p className="text-xl font-bold">10</p>
            </div>
          </div>
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-5 py-7">
            <p className="text-base mb-5">Uncomplete Contracts</p>
            <div className="">
              <p className="text-xl font-bold">22</p>
            </div>
          </div>
          <div className="shadow-lg border-t-4 border-purple-500 rounded-lg px-10 py-7">
            <p className="text-base mb-5">Today Contracts</p>
            <div className="">
              <p className="text-xl font-bold">7</p>
            </div>
          </div>
        </div>

        <div className="mt-20 p-10 rounded border-t-2 border-purple-500 shadow-xl h-[29.7rem] w-[20rem] flex flex-col">
          {/* Fixed Heading */}
          <div className="pb-4">
            <p className="text-lg">Historical Daily Prices</p>
          </div>

          {/* Scrollable Content with bottom padding */}
          <div className="flex-1 overflow-y-auto">
            <div className="mt-5">
              <ul>
                <li className="relative pb-6">
                  <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                    <div className="w-5 h-6 rounded-full border-purple-500 border-2"></div>
                    <div className="h-full w-px bg-[#A7A7A7]"></div>
                  </div>
                  <div className="pl-14">
                    <p>Contract #123456</p>
                    <div className="flex items-center space-x-8">
                      <p className="text-green-500 font-bold">$340</p>
                      <p className="text-sm">10:12 AM</p>
                    </div>
                  </div>
                </li>

                {/* Repeat other list items */}
                <li className="relative pb-6">
                  <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                    <div className="w-5 h-6 rounded-full border-purple-500 border-2"></div>
                    <div className="h-full w-px bg-[#A7A7A7]"></div>
                  </div>
                  <div className="pl-14">
                    <p>Contract #123456</p>
                    <div className="flex items-center space-x-8">
                      <p className="text-green-500 font-bold">$340</p>
                      <p className="text-sm">10:12 AM</p>
                    </div>
                  </div>
                </li>

                <li className="relative pb-6">
                  <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                    <div className="w-5 h-6 rounded-full border-purple-500 border-2"></div>
                    <div className="h-full w-px bg-[#A7A7A7]"></div>
                  </div>
                  <div className="pl-14">
                    <p>Contract #123456</p>
                    <div className="flex items-center space-x-8">
                      <p className="text-green-500 font-bold">$340</p>
                      <p className="text-sm">10:12 AM</p>
                    </div>
                  </div>
                </li>

                <li className="relative pb-6">
                  <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                    <div className="w-5 h-6 rounded-full border-purple-500 border-2"></div>
                    <div className="h-full w-px bg-[#A7A7A7]"></div>
                  </div>
                  <div className="pl-14">
                    <p>Contract #123456</p>
                    <div className="flex items-center space-x-8">
                      <p className="text-green-500 font-bold">$340</p>
                      <p className="text-sm">10:12 AM</p>
                    </div>
                  </div>
                </li>

                <li className="relative pb-6">
                  <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                    <div className="w-5 h-6 rounded-full border-purple-500 border-2"></div>
                    <div className="h-full w-px bg-[#A7A7A7]"></div>
                  </div>
                  <div className="pl-14">
                    <p>Contract #123456</p>
                    <div className="flex items-center space-x-8">
                      <p className="text-green-500 font-bold">$340</p>
                      <p className="text-sm">10:12 AM</p>
                    </div>
                  </div>
                </li>

                {/* Last item without the vertical line */}
                <li className="relative pb-6">
                  <div className="absolute -left-0 top-3 h-full w-5 flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full border-purple-500 border-2"></div>
                  </div>
                  <div className="pl-14">
                    <p>Contract #123456</p>
                    <div className="flex items-center space-x-8">
                      <p className="text-green-500 font-bold">$340</p>
                      <p className="text-sm">10:12 AM</p>
                    </div>
                  </div>
                </li>

                {/* Extra padding at the bottom */}
                <div className="pb-10"></div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
