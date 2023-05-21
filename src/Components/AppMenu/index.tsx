import { Button, Drawer, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";

import styles from "./index.module.css";

const Item = Menu.Item;

export const AppMenu = () => {
  const [open, setOpen] = useState(false);
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
        <Menu>
          <Item>Base Rules</Item>
          <Item>Base Rules</Item>
          <Item>Base Rules</Item>
          <Item>Base Rules</Item>
          <Item>Base Rules</Item>
        </Menu>
      </Drawer>
    </>
  );
};
