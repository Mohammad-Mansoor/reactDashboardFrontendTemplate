import { useState } from "react";
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
  // Modal states
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Async Select States (Mock API Demo)
  const [isAsyncLoading, setIsAsyncLoading] = useState(false);
  const [asyncItems, setAsyncItems] = useState([
    { value: "api-1", label: "Server Generated Item A" },
    { value: "api-2", label: "Dynamically Fetched User B" }
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
          { value: `api-${query}`, label: `Searched Result: ${query}` },
          { value: `api-mock`, label: `Live API Payload for "${query}"` },
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
        title="Components Showcase | HCMS"
        description="Reusable UI Components Showcase"
      />
      <div className="space-y-6">
        
        {/* Modals Section */}
        <section className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Modals</h2>
          <div className="flex flex-wrap gap-4">
            <Button label="Success Modal" success onClick={() => setSuccessOpen(true)} />
            <Button label="Error Modal" error onClick={() => setErrorOpen(true)} />
            <Button label="Confirmation Modal" onClick={() => setConfirmationOpen(true)} />
          </div>

          <SuccessModal
            isOpen={successOpen}
            onClose={() => setSuccessOpen(false)}
            title="Success Modal"
            description="This is a reusable success modal component."
          />
          <ErrorModal
            isOpen={errorOpen}
            onClose={() => setErrorOpen(false)}
            title="Error Modal"
            description="This is a reusable error modal component."
          />
          <ConfirmationModal
            isOpen={confirmationOpen}
            onClose={() => setConfirmationOpen(false)}
            onConfirm={() => {
              alert("Confirmed!");
              setConfirmationOpen(false);
            }}
            title="Confirm Action"
            description="Are you sure you want to proceed?"
            confirmText="Yes, Proceed"
            cancelText="Cancel"
          />
        </section>

        {/* Buttons Section */}
        <section className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Buttons</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <Button label="Primary Button" />
            <Button label="Success Button" success />
            <Button label="Error Button" error />
            <Button label="Disabled Button" disabled />
          </div>
          <div className="flex flex-wrap gap-4">
            <Button label="Outline Hover Primary" isFillOnHover />
            <Button label="Outline Hover Success" success isFillOnHover />
            <Button label="Outline Hover Error" error isFillOnHover />
            <Button label="Loading Button" isLoading />
          </div>
        </section>

        {/* Inputs Section */}
        <section className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Inputs & Forms (Enterprise UI)</h2>
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Standard Text Inputs */}
            <div className="space-y-4">
              <InputElement 
                label="First Name" 
                placeholder="Enter your first name" 
              />
              
              <InputElement 
                label="Email Address" 
                type="email"
                placeholder="you@company.com" 
                hint="We will never share your email."
                required
              />

              <PasswordInput 
                label="Password" 
                placeholder="Enter your password" 
                hint="Must be at least 8 characters."
              />
            </div>

            {/* State & Icon Inputs */}
            <div className="space-y-4">
              <InputElement 
                label="Username" 
                placeholder="johndoe123" 
                leftIcon={<FaUserCircle className="w-4 h-4" />}
                success
                hint="Username is available!"
              />
              
              <InputElement 
                label="Domain" 
                placeholder="company.com" 
                error="This domain is already registered."
                leftIcon={<FaUserCircle className="w-4 h-4" />}
              />

              <SearchInputElement 
                label="Search Patients"
                placeholder="Search by ID or Name..." 
                onSearch={() => alert('Search initiated!')} 
              />
            </div>

            {/* Textarea & Disabled States */}
            <div className="space-y-4 md:col-span-2 grid md:grid-cols-2 gap-6 items-start">
              <TextareaElement 
                label="Clinical Notes"
                placeholder="Type your notes here..."
                hint="These notes will be attached to the patient record."
              />
              
              <div className="space-y-4">
                <InputElement 
                  label="System ID (Read Only)" 
                  value="SYS-9982-11X"
                  disabled 
                  hint="You do not have permission to edit this field."
                />
                <TextareaElement 
                  label="Archived Records"
                  value="Patient discharged on 10/12/2023. No further actions required."
                  disabled
                />
              </div>
            </div>

            {/* Select Elements */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 border-b pb-2 dark:border-gray-700">Dropdowns (Selects)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <SingleSelect 
                  label="Select Role" 
                  items={[
                    { value: "1", label: "Super Admin", icon: <FaUserCircle /> },
                    { value: "2", label: "Frontend Developer", icon: <FaReact /> },
                    { value: "3", label: "Sales Manager" }
                  ]}
                  placeholder="Choose an option..."
                  hint="These options have built-in icon support"
                />

                <SingleSelect 
                  label="Empty State Demo" 
                  items={[]}
                  placeholder="Click to see magic..."
                  hint="Watch the empty state animation!"
                  required
                />

                <MultiSelect 
                  label="Assign Tags" 
                  items={[
                    { value: "react", label: "React" },
                    { value: "node", label: "Node.js" },
                    { value: "aws", label: "AWS" },
                    { value: "typescript", label: "TypeScript" }
                  ]}
                  initialSelected={[{ value: "typescript", label: "TypeScript" }]}
                  placeholder="Select technical skills..."
                  hint="You can select multiple options"
                />

                <MultiSelect 
                  label="Team Members (With Avatars)" 
                  items={[
                    { value: "1", label: "Alice Cooper", image: "https://i.pravatar.cc/150?u=alice" },
                    { value: "2", label: "Bob Smith", image: "https://i.pravatar.cc/150?u=bob" },
                    { value: "3", label: "Charlie Davis", image: "https://i.pravatar.cc/150?u=charlie" }
                  ]}
                  placeholder="Assign members..."
                  initialSelected={[{ value: "1", label: "Alice Cooper", image: "https://i.pravatar.cc/150?u=alice" }]}
                />

                {/* --- ASYNC EXAMPLES --- */}
                
                <SingleSelect 
                  label="Async Dropdown (Context Persistence)" 
                  isAsync={true}
                  isLoading={isAsyncLoading}
                  asyncFetch={mockApiFetch}
                  items={asyncItems}
                  placeholder="Select item... (will stay pinned at top)"
                  hint="Even if API results change, your selection stays pinned at the top!"
                  hasMore={true}
                  onLoadMore={() => alert("Loading more data...")}
                />

                <MultiSelect 
                  label="Async Multi-Select (Logic Fixed)" 
                  isAsync={true}
                  isLoading={isAsyncLoading}
                  asyncFetch={mockApiFetch}
                  items={asyncItems}
                  placeholder="Select tags..."
                  hint="Selection now perfectly persists across search fetches"
                />

              </div>
            </div>

          </div>
        </section>

        {/* Toggles & Checkboxes Section */}
        <section className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Checkboxes & Switches</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Checkboxes</h3>
              <div className="flex items-center gap-4">
                <Checkbox value={isChecked1} onChange={setIsChecked1} />
                <Checkbox value={isChecked2} onChange={setIsChecked2} color="red" />
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Switches</h3>
              <div className="flex items-center gap-4">
                <Switch value={isSwitch1} onChange={setIsSwitch1} />
                <Switch value={isSwitch2} onChange={setIsSwitch2} color="green" />
              </div>
            </div>
          </div>
        </section>

        {/* Avatars Section */}
        <section className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Avatars</h2>
          <div className="flex flex-wrap items-end gap-6 mb-6">
            <div>
              <p className="mb-2 text-sm text-gray-500">Sizes</p>
              <div className="flex items-end gap-4">
                <Avatar size="sm" fallback="SM" />
                <Avatar size="md" fallback="MD" />
                <Avatar size="lg" fallback="LG" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-500">Variants & Images</p>
              <div className="flex items-end gap-4">
                <Avatar size="lg" src="https://i.pravatar.cc/150?u=a" />
                <Avatar size="lg" variant="square" src="https://i.pravatar.cc/150?u=b" />
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-gray-500">With Badges</p>
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
