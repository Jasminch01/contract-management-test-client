import React from "react";

const Contract = () => {
  return (
    <div className="max-w-3xl mx-auto mt-5">
      <div className="border border-gray-300">
        <div className="text-sm bg-white py-10">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold">GROWTH GRAIN SERVICES</h1>
            <p className="text-xs">ABN 64 157 832 216</p>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2 text-xs px-20">
            <div className="pb-1">
              <h2 className="font-bold text-sm">BUYER</h2>
              <p>Veron Awards Pty, LTD</p>
              <p>Top Box Stock</p>
              <p>Minimum VIC, 3004</p>
              <p>Contact: Fully Eurasian</p>
              <p>Veron Contract, 6455744</p>
            </div>

            <div className="pb-1">
              <h2 className="font-bold text-sm">SELLER</h2>
              <p>N/A (Having A Co. Pty, LTD)</p>
              <p>3000 Stock Based Road, Bidermount, SA, 5501</p>
              <p>NOIS, 15000000</p>
              <p>Contact: Total Money Code #2/287</p>
              <p>Email: mvnews@diggard.com</p>
            </div>
          </div>
          {/* Full-width Broker Ref section with borders */}
          <div>

          <div className="w-full py-2 mb-4 border-b border-t  border-gray-300">
            <div className="flex px-20">
              <span className="w-1/4 font-semibold">Broker Ref:</span>
              <span className="w-1/4">JZ002088</span>
              <span className="w-1/4 font-semibold">Contract Date:</span>
              <span className="w-1/4">2/01/2025</span>
            </div>
          </div>
          </div>

          {/* Buyer/Seller Section */}
          <div className="px-20">
            <div className="space-y-2 text-xs">
              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Commodity:</span>
                <span className="w-3/4">ALISTRALIAN WHEAT</span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Season:</span>
                <span className="w-3/4">20342/2025</span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Quality:</span>
                <span className="w-3/4">H1 AP EPS CPA, COS, 101 STANDARDS</span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Quantity:</span>
                <span className="w-3/4">
                  ZG &A METRO TORNES - NE, TOLEBANCE
                </span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Price:</span>
                <span className="w-3/4">
                  AS&C PER TONNE IN DISPOT YITTERM, ROCKVORTHY
                </span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Delivery Period:</span>
                <span className="w-3/4">
                  2ND JANUARY - STH JANUARY - SELLERS OPTION
                </span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Payment:</span>
                <span className="w-3/4">
                  S DARS END OF WEEK OF CULVERT SANDAR IS END OF WEED
                </span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Freight:</span>
                <span className="w-3/4">NOT APPLICABLE</span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Weight:</span>
                <span className="w-3/4">FINAL AT TRANSFERRED TO BUYER</span>
              </div>

              <div className="pb-1">
                <div className="font-semibold mb-1">Terms & Conditions:</div>
                <p className="text-xs">
                  WHEN NOT IN COMPLICITY WITH THE ABOVE CONDITIONS THIS
                  CONTRAICT EXPRESSIVE CORPORATE WILL TERMS A CONDITIONS OF THE
                  GIRL NO 3 CONTRACT INCLUDING THE GIRL TRADE RELEASE AND
                  DISPLIPE RESOLUTION RELEASE
                </p>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Special Conditions:</span>
                <span className="w-3/4">NIL</span>
              </div>

              <div className="pb-1">
                <div className="font-semibold mb-1">Brokerage:</div>
                <p className="text-xs">
                  AT SELLERS COST AT ASI 00 PER TONNE ENCLUSIVE OF GETI WOXCE TO
                  SELLER TO BE FORWARDED ON SEPARATEUT TO THIS CONTRACT
                </p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-4 text-xs italic">
              <p>
                Growth Grain Services as broker does not guarentee the
                performance of this contract. Both the buyer and the seller are
                bound by the above contract and mentioned GTA contracts to
                execute the contract. Seller is resposible for any applicable
                levies/royalties
              </p>
            </div>
          </div>
          {/* Rest of Contract Details (unchanged) */}
        </div>
      </div>
    </div>
  );
};

export default Contract;
