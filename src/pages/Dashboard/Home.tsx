import EcommerceMetrics from "../../components/Ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/Ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/Ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/Ecommerce/MonthlyTarget";
import RecentOrders from "../../components/Ecommerce/RecentOrders";
import DemographicCard from "../../components/Ecommerce/DemographicCard";
import PageMeta from "../../components/Common/PageMeta";
import SuccessModal from "../../components/modals/successModal.jsx";
import ErrorModal from "../../components/modals/errorModal.jsx";
import ConfirmationModal from "../../components/modals/confirmationModal.jsx";
import { useState } from "react";
// import SuccessModal from "../../components/Ui/Modals/SuccessModal";


export default function Home() {
  const [open, setOpen] = useState(false);
  const [errorOpen, seterrorOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleConfirm = () => {
    alert("Item deleted!");
    setConfirmationOpen(false);
  };
  return (
    <>
    <div className="border border-red-500 py-4 rounded-md flex items-center justify-center gap-4">
      <button onClick={()=>seterrorOpen(true)} className="rounded-md border border-blue-500 px-4 py-2 hover:bg-blue-500 transition-all duration-300 hover:text-white">error modal</button>
      <button onClick={()=>setOpen(true)} className="rounded-md border border-blue-500 px-4 py-2 hover:bg-blue-500 transition-all duration-300 hover:text-white">Success modal</button>
      <button onClick={()=>setConfirmationOpen(true)} className="rounded-md border border-blue-500 px-4 py-2 hover:bg-blue-500 transition-all duration-300 hover:text-white">Confirmation modal</button>
       <SuccessModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Payment Successful 🎉"
        description="Your transaction has been completed."
      >
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>Transaction ID:</strong> #293847</p>
          <p><strong>Amount:</strong> $250</p>
        </div>
      </SuccessModal>
      <ErrorModal
        isOpen={errorOpen}
        onClose={() => seterrorOpen(false)}
        title="Payment Failed ❌"
        description="Your transaction has been failed."
      >
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>Transaction ID:</strong> #293847</p>
          <p><strong>Amount:</strong> $250</p>
        </div>
      </ErrorModal>
       <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirm}
        title="Delete Item?"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      >
        <p className="text-sm text-gray-700">Item ID: #12345</p>
      </ConfirmationModal>
    </div>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
