import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageMeta from "../components/Common/PageMeta";

// Modals
import SuccessModal from "../components/modals/successModal";
import ErrorModal from "../components/modals/errorModal";
import ConfirmationModal from "../components/modals/confirmationModal";

// UI Components
import Button from "../components/Ui/Ftth/Button";
import Checkbox from "../components/Ui/Ftth/Checkbox";
import Switch from "../components/Ui/Ftth/Switch";
import Avatar from "../components/Ui/Ftth/Avatar";
import { InputElement, SearchInputElement, PasswordInput, TextareaElement } from "../components/Ui/Ftth/inputs";
import SingleSelect from "../components/Ui/Ftth/selectElements";
import MultiSelect from "../components/Ui/Ftth/MultiSelectElement";
import { FaUserCircle, FaReact } from "react-icons/fa";

export default function ComponentsPage() {
  const { t } = useTranslation();
  // Modal states
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Async Select States (Mock API Demo)
  const [isAsyncLoading, setIsAsyncLoading] = useState(false);
  const [asyncItems, setAsyncItems] = useState([
    { value: "api-1", label: t("demo.items.server_item_a", "Server Generated Item A") },
    { value: "api-2", label: t("demo.items.fetched_user_b", "Dynamically Fetched User B") }
  ]);

  const mockApiFetch = (query: string) => {
    setIsAsyncLoading(true);
    console.log("Fetching API records for:", query);
    setTimeout(() => {
      if (!query) {
        setAsyncItems([
          { value: "api-1", label: "Server Generated Item A" },
          { value: "api-2", label: "Dynamically Fetched User B" }
        ]);
      } else {
        setAsyncItems([
          { value: `api-${query}`, label: `${t("demo.items.search_result")}: ${query}` },
          { value: `api-mock`, label: t("demo.items.live_payload", { query }) },
        ]);
      }
      setIsAsyncLoading(false);
    }, 1200);
  };

  const handleConfirmAction = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      setConfirmationOpen(false);
    }, 2000);
  };

  // Switch and Checkbox states
  const [isChecked1, setIsChecked1] = useState(true);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isSwitch1, setIsSwitch1] = useState(true);
  const [isSwitch2, setIsSwitch2] = useState(false);

  return (
    <>
      <PageMeta
        title={t("showcase.title")}
        description={t("showcase.description")}
      />
      <div className="space-y-6">
        
        {/* Modals Section */}
        <section className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">{t("showcase.sections.modals")}</h2>
          <div className="flex flex-wrap gap-4">
            <Button label={t("showcase.items.success_modal")} success onClick={() => setSuccessOpen(true)} />
            <Button label={t("showcase.items.error_modal")} error onClick={() => setErrorOpen(true)} />
            <Button label={t("showcase.items.confirm_modal")} onClick={() => setConfirmationOpen(true)} />
          </div>

          <SuccessModal
            isOpen={successOpen}
            onClose={() => setSuccessOpen(false)}
            title={t("showcase.items.success_modal")}
            description={t("showcase.items.success_desc")}
          />
          <ErrorModal
            isOpen={errorOpen}
            onClose={() => setErrorOpen(false)}
            title={t("showcase.items.error_modal")}
            description={t("showcase.items.error_desc")}
          />
          <ConfirmationModal
            isOpen={confirmationOpen}
            onClose={() => setConfirmationOpen(false)}
            onConfirm={() => {
              alert(t("common.confirmed", "Confirmed!"));
              setConfirmationOpen(false);
            }}
            title={t("showcase.items.confirm_title")}
            description={t("showcase.items.confirm_desc")}
            confirmText={t("showcase.items.confirm_yes")}
            cancelText={t("showcase.items.cancel")}
          />
        </section>

        {/* Buttons Section */}
        <section className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">{t("showcase.sections.buttons")}</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <Button label={t("showcase.items.primary_btn")} />
            <Button label={t("showcase.items.success_btn")} success />
            <Button label={t("showcase.items.error_btn")} error />
            <Button label={t("showcase.items.disabled_btn")} disabled />
          </div>
          <div className="flex flex-wrap gap-4">
            <Button label={t("showcase.items.outline_hover_primary")} isFillOnHover />
            <Button label={t("showcase.items.outline_hover_success", "Outline Hover Success")} success isFillOnHover />
            <Button label={t("showcase.items.outline_hover_error", "Outline Hover Error")} error isFillOnHover />
            <Button label={t("showcase.items.loading_btn")} isLoading />
          </div>
        </section>

        {/* Inputs Section */}
        <section className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">{t("showcase.sections.inputs")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">{t("showcase.sections.standard_inputs")}</h3>
              <InputElement 
                label={t("showcase.items.first_name")} 
                placeholder={t("showcase.items.first_name_placeholder")} 
              />
              
              <InputElement 
                label={t("showcase.items.email")} 
                type="email"
                placeholder={t("showcase.items.email_placeholder")} 
                hint={t("showcase.items.email_hint")}
                required
              />

              <PasswordInput 
                label={t("showcase.items.password")} 
                placeholder={t("showcase.items.password_placeholder")} 
                hint={t("showcase.items.password_hint")}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">{t("showcase.sections.state_inputs")}</h3>
              <InputElement 
                label={t("showcase.items.username")} 
                placeholder={t("showcase.items.username_placeholder")} 
                leftIcon={<FaUserCircle className="w-4 h-4" />}
                success
                hint={t("showcase.items.username_hint")}
              />
              
              <InputElement 
                label={t("showcase.items.domain")} 
                placeholder={t("showcase.items.domain_placeholder")} 
                error={t("showcase.items.domain_error")}
                leftIcon={<FaUserCircle className="w-4 h-4" />}
              />

              <SearchInputElement 
                label={t("showcase.items.search_patients")}
                placeholder={t("showcase.items.search_placeholder")} 
                onSearch={() => alert(t("common.search_initiated", "Search initiated!"))} 
              />
            </div>

            <div className="space-y-4 md:col-span-2 grid md:grid-cols-2 gap-6 items-start">
              <TextareaElement 
                label={t("showcase.items.clinical_notes")}
                placeholder={t("showcase.items.notes_placeholder")}
                hint={t("showcase.items.notes_hint")}
              />
              
              <div className="space-y-4">
                <InputElement 
                  label={t("showcase.items.system_id")} 
                  value="SYS-9982-11X"
                  disabled 
                  hint={t("showcase.items.system_id_hint")}
                />
                <TextareaElement 
                  label={t("showcase.items.archived_records")}
                  value={t("showcase.items.archived_val")}
                  disabled
                />
              </div>
            </div>

            {/* Select Elements */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 border-b pb-2 dark:border-gray-700">{t("showcase.sections.selects")}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <SingleSelect 
                  label={t("showcase.items.select_role")} 
                  items={[
                    { value: "1", label: t("demo.roles.super_admin", "Super Admin"), icon: <FaUserCircle /> },
                    { value: "2", label: t("demo.roles.frontend_dev", "Frontend Developer"), icon: <FaReact /> },
                    { value: "3", label: t("demo.roles.sales_manager", "Sales Manager") }
                  ]}
                  placeholder={t("showcase.items.role_placeholder")}
                  hint={t("showcase.items.role_hint")}
                />

                <SingleSelect 
                  label={t("showcase.items.empty_demo")} 
                  items={[]}
                  placeholder={t("showcase.items.empty_placeholder")}
                  hint={t("showcase.items.empty_hint")}
                  required
                />

                <MultiSelect 
                  label={t("showcase.items.assign_tags")} 
                  items={[
                    { value: "react", label: "React" },
                    { value: "node", label: "Node.js" },
                    { value: "aws", label: "AWS" },
                    { value: "typescript", label: "TypeScript" }
                  ]}
                  initialSelected={[{ value: "typescript", label: "TypeScript" }]}
                  placeholder={t("showcase.items.tags_placeholder")}
                  hint={t("showcase.items.tags_hint")}
                />

                <MultiSelect 
                  label={t("showcase.items.team_members")} 
                  items={[
                    { value: "1", label: t("demo.patients.alice", "Alice Cooper"), image: "https://i.pravatar.cc/150?u=alice" },
                    { value: "2", label: t("demo.patients.bob", "Bob Smith"), image: "https://i.pravatar.cc/150?u=bob" },
                    { value: "3", label: t("demo.patients.charlie", "Charlie Davis"), image: "https://i.pravatar.cc/150?u=charlie" }
                  ]}
                  placeholder={t("showcase.items.members_placeholder")}
                  initialSelected={[{ value: "1", label: t("demo.patients.alice"), image: "https://i.pravatar.cc/150?u=alice" }]}
                />

                {/* --- ASYNC EXAMPLES --- */}
                
                <SingleSelect 
                  label={t("showcase.items.async_dropdown")} 
                  isAsync={true}
                  isLoading={isAsyncLoading}
                  asyncFetch={mockApiFetch}
                  items={asyncItems}
                  placeholder={t("showcase.items.async_placeholder")}
                  hint={t("showcase.items.async_hint")}
                  hasMore={true}
                  onLoadMore={() => alert(t("common.loading_more", "Loading more data..."))}
                />

                <MultiSelect 
                  label={t("showcase.items.async_multi")} 
                  isAsync={true}
                  isLoading={isAsyncLoading}
                  asyncFetch={mockApiFetch}
                  items={asyncItems}
                  placeholder={t("showcase.items.async_multi_placeholder")}
                  hint={t("showcase.items.async_multi_hint")}
                />

              </div>
            </div>

          </div>
        </section>

        {/* Toggles & Checkboxes Section */}
        <section className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">{t("showcase.sections.toggles")}</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{t("showcase.items.checkboxes")}</h3>
              <div className="flex items-center gap-4">
                <Checkbox value={isChecked1} onChange={setIsChecked1} />
                <Checkbox value={isChecked2} onChange={setIsChecked2} color="red" />
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{t("showcase.items.switches")}</h3>
              <div className="flex items-center gap-4">
                <Switch value={isSwitch1} onChange={setIsSwitch1} />
                <Switch value={isSwitch2} onChange={setIsSwitch2} color="green" />
              </div>
            </div>
          </div>
        </section>

        {/* Avatars Section */}
        <section className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">{t("showcase.sections.avatars")}</h2>
          <div className="flex flex-wrap items-end gap-6 mb-6">
            <div>
              <p className="mb-2 text-sm text-gray-500">{t("showcase.items.sizes")}</p>
              <div className="flex items-end gap-4">
                <Avatar size="sm" fallback="SM" />
                <Avatar size="md" fallback="MD" />
                <Avatar size="lg" fallback="LG" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-500">{t("showcase.items.variants_images")}</p>
              <div className="flex items-end gap-4">
                <Avatar size="lg" src="https://i.pravatar.cc/150?u=a" />
                <Avatar size="lg" variant="square" src="https://i.pravatar.cc/150?u=b" />
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-gray-500">{t("showcase.items.with_badges")}</p>
            <div className="flex items-end gap-6">
              <Avatar size="md" src="https://i.pravatar.cc/150?u=c" badge={{ position: "bottom-right", color: "#22c55e" }} />
              <Avatar size="lg" src="https://i.pravatar.cc/150?u=d" badge={{ position: "top-right", color: "#ef4444", content: "3" }} />
              <Avatar size="lg" variant="square" src="https://i.pravatar.cc/150?u=e" badge={{ position: "bottom-left", color: "#3b82f6" }} />
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
