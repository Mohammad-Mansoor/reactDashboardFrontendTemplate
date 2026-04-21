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
import { useTranslation } from "react-i18next";


export default function Home() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [errorOpen, seterrorOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleConfirm = () => {
    alert(t("dashboard.modals.confirmation.deleted_alert") || "Item deleted!");
    setConfirmationOpen(false);
  };

  return (
    <>
    <div className="border border-red-500 py-4 rounded-md flex items-center justify-center gap-4">
      <button onClick={()=>seterrorOpen(true)} className="rounded-md border border-blue-500 px-4 py-2 hover:bg-blue-500 transition-all duration-300 hover:text-white">{t("dashboard.test_buttons.error")}</button>
      <button onClick={()=>setOpen(true)} className="rounded-md border border-blue-500 px-4 py-2 hover:bg-blue-500 transition-all duration-300 hover:text-white">{t("dashboard.test_buttons.success")}</button>
      <button onClick={()=>setConfirmationOpen(true)} className="rounded-md border border-blue-500 px-4 py-2 hover:bg-blue-500 transition-all duration-300 hover:text-white">{t("dashboard.test_buttons.confirmation")}</button>
       <SuccessModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={t("dashboard.modals.success.title")}
        description={t("dashboard.modals.success.description")}
      >
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>{t("dashboard.modals.success.transaction_id")}:</strong> #293847</p>
          <p><strong>{t("dashboard.modals.success.amount")}:</strong> $250</p>
        </div>
      </SuccessModal>
      <ErrorModal
        isOpen={errorOpen}
        onClose={() => seterrorOpen(false)}
        title={t("dashboard.modals.error.title")}
        description={t("dashboard.modals.error.description")}
      >
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>{t("dashboard.modals.success.transaction_id")}:</strong> #293847</p>
          <p><strong>{t("dashboard.modals.success.amount")}:</strong> $250</p>
        </div>
      </ErrorModal>
       <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirm}
        title={t("dashboard.modals.confirmation.title")}
        description={t("dashboard.modals.confirmation.description")}
        confirmText={t("dashboard.modals.confirmation.confirm")}
        cancelText={t("dashboard.modals.confirmation.cancel")}
      >
        <p className="text-sm text-gray-700">{t("dashboard.modals.confirmation.item_id")}: #12345</p>
      </ConfirmationModal>
    </div>
      <PageMeta
        title={t("dashboard.title")}
        description={t("dashboard.description")}
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

