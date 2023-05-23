import { Button, Drawer, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";

import styles from "./index.module.css";

type AppMenuProps = {
  handleLogout: () => void; // assuming handleLogout is a function that takes no arguments and returns void
  handleShowRoles: () => void; // the same for handleShowRoles
};

export const AppMenu = ({ handleLogout, handleShowRoles }: AppMenuProps) => {
  const [open, setOpen] = useState(false);

  const items = [
    { 
      label: 'Rules', 
      key: 'Rules', 
      //onClick: func,
      //className: class1,
    },
    {
      label: 'Show Roles',
      key: 'ShowRoles',
      onClick: handleShowRoles,
    },
    {
      label: 'Logout',
      key: 'Logout',
      onClick: handleLogout,
    },
  ]

  return (
    <>
      <Button onClick={() => setOpen(true)} className={styles.AppMenuButton}>
        <MenuOutlined size={100} />
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="AppMenu"
        destroyOnClose
        className={styles.AppMenuDrawer}
      >
        <Menu items={items}/>
      </Drawer>
    </>
  );
};


