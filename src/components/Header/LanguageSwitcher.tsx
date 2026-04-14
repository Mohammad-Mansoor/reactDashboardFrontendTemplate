import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../Ui/dropdown/Dropdown";
import { DropdownItem } from "../Ui/dropdown/DropdownItem";

const languages = [
  {
    code: "en",
    name: "English",
    flag: "/images/flags/us.png",
  },
  {
    code: "dr",
    name: "دری",
    flag: "/images/flags/afghanistan.png",
  },
  {
    code: "ps",
    name: "پښتو",
    flag: "/images/flags/afghanistan.png",
  },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage =
    languages.find((lng) => lng.code === i18n.language) || languages[0];

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    closeDropdown();
  };

  return (
    <div className='relative'>
      <button
        onClick={toggleDropdown}
        className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg dropdown-toggle hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
      >
        <img
          src={currentLanguage.flag}
          alt={currentLanguage.name}
          className='w-5 h-5 rounded-full object-cover border border-gray-100 dark:border-gray-800'
        />

        <span className='hidden sm:inline'>{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className='ltr:right-0 rtl:left-0 mt-2 w-40 p-2'
      >
        <div className='flex flex-col gap-1'>
          {languages.map((lng) => (
            <button
              key={lng.code}
              onClick={() => changeLanguage(lng.code)}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                i18n.language === lng.code
                  ? "bg-gray-100 text-brand-500 dark:bg-white/10 dark:text-brand-400"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5"
              }`}
            >
              <img
                src={lng.flag}
                alt={lng.name}
                className='w-5 h-5 rounded-full object-cover border border-gray-100 dark:border-gray-800'
              />

              <span>{lng.name}</span>
            </button>
          ))}
        </div>
      </Dropdown>
    </div>
  );
}
