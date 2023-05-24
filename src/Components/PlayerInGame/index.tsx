import { Button, Modal } from "antd";
import { useState } from "react";
import { User } from "../../Types/User";
import { RoleCard, roleTypeToSetMap } from "../RoleCard";
import "./index.css";

type PlayerProps = {
  user?: User | null;
};

export const PlayerInGame = ({ user }: PlayerProps) => {
  const [open, setOpen] = useState(false);

  if (!user?.role)
    return (
      <div className="PlayerInGame">
        <h1>{user?.username}</h1>
        <h2>{"Unknown"}</h2>

        <Button disabled className="PlayerCardButton Unknown">
          <i className="ss ss-bcore ss-mythic ss-grad"></i>
        </Button>
      </div>
    );

  const logo = roleTypeToSetMap[user.role.type];

  return (
    <div className="PlayerInGame">
      <h1>{user.username}</h1>
      <h2>The {user.role.name}</h2>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer
        title
      >
        <RoleCard role={user.role} />
      </Modal>
      <Button
        onClick={() => setOpen(true)}
        className={`PlayerCardButton ${user.role.type}`}
      >
        <i className={logo}></i>
      </Button>
    </div>
  );
};
