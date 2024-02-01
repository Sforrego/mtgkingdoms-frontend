import { Button, Drawer, Menu, Modal } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAppContext } from '../../Context/AppContext';

import styles from "./index.module.css";

export const AppMenu = () => {
  const { user, socket, roomCode, isLoggedIn, setShowRoles, setProfile, logoutHandler } = useAppContext();
  const [open, setOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const handleShowRoles = () => {
    setShowRoles(true);
  };

  const handleProfile = () => {
    setProfile(true);
  };

  const handleLogout = () => {
    if (socket && user) {
      logoutHandler(user, socket, roomCode);
    }
  };

  const items = [
    ...(isLoggedIn ? [{
      label: 'Profile', 
      key: 'Profile', 
      onClick: () => {
        handleProfile();
        setOpen(false);
      },
    }] : []),
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
        styles={{
          body: {
            overflowY: 'auto',
            maxHeight: '75vh'
          }
        }}
      >
        <p className={styles.rules}>The Monarch begins the game with 50 life points and is the first player to take a turn.</p>
        <p className={styles.rules}>Bandits win if the Monarch is defeated while at least one Bandit remains alive.</p>
        <p className={styles.rules}>Other roles win by eliminating all their opponents, unless their role card specifies otherwise.</p>
        <p className={styles.rules}>Revealed roles form teams as follows: Knights and Monarchs; Bandits; Nobles. These teammates are not considered opponents.</p>
        <p className={styles.rules}>"Reveal" means showing your role to all players and activating its ability.</p>
        <p className={styles.rules}>"Conceal" involves hiding your role from other players, allowing for potential re-Reveal of your role.</p>
        <p className={styles.rules}>"Round" is a turn cycle starting with the Monarch, one round is complete when the Monarch starts his turn after everyone has had at least one turn.</p>
        <p className={styles.rules}>When a role is concealed, all players are considered opponents.</p>
        <p className={styles.rules}>Role abilities cannot be targeted.</p>
        <h1 className={styles.rules}>Game Design Principles</h1>
        <p className={styles.rules}>A player will not assume the role of Monarch in consecutive games.</p>
        <p className={styles.rules}>Efforts are made to avoid assigning the same role to a player in consecutive games, where possible.</p>
      </Modal>
    </>
  );
};


