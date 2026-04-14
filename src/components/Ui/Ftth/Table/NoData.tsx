import Lottie from "lottie-react";
import noDataAnimation from "./empty.json";

export default function NoData({Description = "No data available"}) {
  return (
    <div className="text-center py-12 flex flex-col items-center gap-1 justify-center">

 <Lottie
                    animationData={noDataAnimation}
                    loop={true}
                    className="w-24 h-24 sm:w-42 sm:h-42"
                  />
      <p className="text-gray-500 text-22 dark:text-gray-400">{Description}</p>
    </div>
  )}
