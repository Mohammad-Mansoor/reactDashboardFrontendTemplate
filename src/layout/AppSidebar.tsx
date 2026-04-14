/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PlugInIcon,
  BoxCubeIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import Tooltip from "../components/Common/Tooltip";
import { useTranslation } from "react-i18next";

const AppSidebar = () => {
  const { t } = useTranslation();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  const navItems = [
    {
      icon: <GridIcon />,
      name: t("common.dashboard"),
      subItems: [{ name: t("sidebar.ecommerce"), path: "/", pro: false }],
    },
    {
      icon: <BoxCubeIcon />,
      name: "UI Components",
      path: "/components",
    },
    {
      icon: <GridIcon />,
      name: "Table Premium",
      path: "/table-demo",
    },
  ];

  const othersItems = [
    {
      icon: <PlugInIcon />,
      name: t("common.authentication"),
      subItems: [{ name: t("sidebar.sign_in"), path: "/signin", pro: false }],
    },
  ];

  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname],
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { i18n } = useTranslation();
    const rtlLangs = ["fa", "ps", "dr"];
    const isRtl = rtlLangs.includes(i18n.language);
    const tooltipPosition = isRtl ? "left" : "right";

    return (
      <ul className="flex flex-col gap-4">
        {items.map((nav, index) => (
          <li key={nav.name}>
            <Tooltip
              text={nav.name}
              disabled={isExpanded || isMobileOpen}
              position={tooltipPosition}
            >
              {nav.subItems ? (
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group ${openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                      ? "menu-item-active"
                      : "menu-item-inactive"
                    } cursor-pointer ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                    }`}
                >
                  <span
                    className={`menu-item-icon-size  ${openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                  {(isExpanded || isMobileOpen) && (
                    <ChevronDownIcon
                      className={`ms-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                          openSubmenu?.index === index
                          ? "rotate-180 text-brand-500"
                          : ""
                        }`}
                    />
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    to={nav.path}
                    className={`menu-item group ${isActive(nav.path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                      }`}
                  >
                    <span
                      className={`menu-item-icon-size ${isActive(nav.path)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                        }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                  </Link>
                )
              )}
            </Tooltip>

            {/* SUB-MENU: Keep this OUTSIDE the Tooltip wrapper */}
            {nav.subItems && (isExpanded || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ms-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`menu-dropdown-item ${isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                          }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ms-auto">
                          {subItem.new && (
                            <span
                              className={`ms-auto ${isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ms-auto ${isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };
  return (
    <aside
      className={`fixed mt-[72px] lg:mt-0 flex flex-col top-0 px-4 start-0 bg-white dark:bg-gray-900 dark:border-slate-800 text-slate-800 dark:text-slate-200 h-screen transition-all duration-300 ease-in-out z-[888] border-e border-slate-200 shadow-sm
        ${isExpanded || isMobileOpen ? "w-[250px]" : "w-[90px]"}
        ${isMobileOpen
          ? "translate-x-0"
          : "ltr:-translate-x-full rtl:translate-x-full"
        }
        lg:translate-x-0 ltr:lg:translate-x-0 rtl:lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-1 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
          }`}
      >
        <Link to="/">
          {isExpanded || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/Qalam-logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/Qalam-logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/Qalam-logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isMobileOpen ? (
                  t("sidebar.menu")
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isMobileOpen ? (
                  t("sidebar.others", "Others")
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
