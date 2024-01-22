import { Button, Drawer, Menu, Modal } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";

import styles from "./index.module.css";

type AppMenuProps = {
  handleLogout: () => void; // assuming handleLogout is a function that takes no arguments and returns void
  handleShowRoles: () => void; // the same for handleShowRoles
  handleProfile: () => void; // the same for handleShowRoles
};

export const AppMenu = ({ handleLogout, handleShowRoles, handleProfile }: AppMenuProps) => {
  const [open, setOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const items = [
    { 
      label: 'Profile', 
      key: 'Profile', 
      onClick: () => {
        handleProfile();
        setOpen(false);
      },
    },
    { 
      label: 'Rules', 
      key: 'Rules', 
      onClick: () => {
        setIsRulesModalOpen(true);
        setOpen(false);
      },
    },
    {
      label: 'Show Roles',
      key: 'ShowRoles',
      onClick: () => {
        handleShowRoles();
        setOpen(false);
      }
    },
    {
      label: 'Logout',
      key: 'Logout',
      onClick: () => {
        handleLogout();
        setOpen(false);
      },
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
        title="Menu"
        destroyOnClose
        className={styles.AppMenuDrawer}
      >
        <Menu items={items}/>
      </Drawer>
      <Modal
        title="Rules"
        open={isRulesModalOpen}
        onOk={() => setIsRulesModalOpen(false)}
        onCancel={() => setIsRulesModalOpen(false)}
        footer={null}
        centered
        style={{ 
          maxHeight:"85vh",
        }}
        bodyStyle={{ overflowY: 'auto', maxHeight: '75vh' }}  
      >
        <p className={styles.rules}>The Monarch starts the game and at 50 life points.</p>
        <p className={styles.rules}>The Bandits win the game when the Monarch died with at least one Bandit alive.</p>
        <p className={styles.rules}>All the other roles win the game when they have no opponents alive unless stated otherwise on the role.</p>
        <p className={styles.rules}>The following face up role cards are teammates (not opponents): Knight & Monarch; Bandits; Nobles. </p>
        <p className={styles.rules}>While a role card is face down, everyone is considered an opponent.</p>
        <p className={styles.rules}>Noble roles can turn their role card face down when they cause a player to lose the game.</p>
        <p className={styles.rules}>Role abilities can't be targeted.</p>
        <h1 className={styles.rules}>Design Choices</h1>
        <p className={styles.rules}>A player will not be Monarch in consecutive games.</p>
        <p className={styles.rules}>Roles will not be repeated in consecutive games if possible.</p>
      </Modal>
    </>
  );
};


