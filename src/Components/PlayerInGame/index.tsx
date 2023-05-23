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
        <h2>Role: {"Unknown"}</h2>

        <Button disabled className="PlayerCardButton Unknown">
          <i className="ss ss-bcore ss-mythic ss-grad"></i>
        </Button>
      </div>
    );

  const logo = roleTypeToSetMap[user.role.Type];

  return (
    <div className="PlayerInGame">
      <h2>{user.username}</h2>
      <h3>{user.role.Name ?? "Unknown"}</h3>
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
        className={`PlayerCardButton ${user.role.Type}`}
      >
        <i className={logo}></i>
      </Button>
    </div>
  );
};
