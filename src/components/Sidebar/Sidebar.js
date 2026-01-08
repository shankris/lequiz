"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { menuItems } from "./menuItems";
import { ChevronDown, Menu } from "lucide-react";

const Icon = ({ icon: IconComponent }) => (IconComponent ? <IconComponent size={22} /> : null);

const NavHeader = () => (
  <header className={styles.sidebarHeader}>
    <div>
      <Menu size={22} />
    </div>
    <span>Admin</span>
  </header>
);

const NavButton = ({ onClick, name, icon, isActive, hasSubNav, isSubOpen }) => (
  <div
    onClick={() => onClick(name)}
    className={`${isActive ? styles.active : ""} ${styles.navButton}`}
  >
    {icon && <Icon icon={icon} />}
    <span>{name}</span>
    {hasSubNav && (
      <ChevronDown
        size={18}
        style={{
          rotate: isSubOpen ? "-180deg" : "0deg",
          transition: "0.3s",
        }}
      />
    )}
  </div>
);

const SubMenu = ({ item, activeItem, handleClick }) => {
  const navRef = useRef(null);
  const isSubNavOpen = (item, items) => items.some((i) => i === activeItem) || item === activeItem;

  return (
    <div
      className={styles.subNav}
      style={{
        height: !isSubNavOpen(item.name, item.items) ? 0 : navRef.current?.clientHeight,
      }}
    >
      <div
        ref={navRef}
        className={styles.subNavInner}
      >
        {item?.items.map((subItem) => (
          <div
            key={subItem}
            onClick={() => handleClick(subItem)}
            className={`${activeItem === subItem ? styles.active : ""} ${styles.subNavItem}`}
          >
            <span>{subItem}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("");
  const [isOpen, setIsOpen] = useState(true); // ✅ added

  const handleClick = (item) => setActiveItem(item !== activeItem ? item : "");

  // ✅ Keyboard toggle (Ctrl/Cmd + B)
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section className={styles.pageSidebar}>
      {/* ✅ UPDATED LINE */}
      <aside className={`${styles.sidebar1} ${!isOpen ? styles.closed : ""}`}>
        <NavHeader />

        {menuItems.map((item) => (
          <div key={item.name}>
            {!item.items && (
              <NavButton
                onClick={handleClick}
                name={item.name}
                icon={item.icon}
                isActive={activeItem === item.name}
                hasSubNav={!!item.items}
              />
            )}

            {item.items && (
              <>
                <NavButton
                  onClick={handleClick}
                  name={item.name}
                  icon={item.icon}
                  isActive={activeItem === item.name}
                  hasSubNav
                  isSubOpen={activeItem === item.name}
                />
                <SubMenu
                  activeItem={activeItem}
                  handleClick={handleClick}
                  item={item}
                />
              </>
            )}
          </div>
        ))}
      </aside>
    </section>
  );
};
