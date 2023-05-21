import { Button, Modal } from "antd";
import { useState } from "react";
import { Role } from "../../Types/Role";
import { RoleCard, roleTypeToSetMap } from "../RoleCard";
import "./index.css";

export const PlayerInGame = ({ role }: { role?: Role }) => {
  const [open, setOpen] = useState(false);
  if (role === undefined)
    return (
      <div className="PlayerInGame">
        <h1>PlayerInGame</h1>
        <h2>Role: {"Unknown"}</h2>

        <Button disabled className="PlayerCardButton Unknown">
          <i className="ss ss-bcore ss-mythic ss-grad"></i>
        </Button>
      </div>
    );
  const logo = roleTypeToSetMap[role.Type];

  return (
    <div className="PlayerInGame">
      <h1>PlayerInGame</h1>
      <h2>Role: {role?.Name ?? "Unknown"}</h2>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer
        title
      >
        <RoleCard role={role} />
      </Modal>
      <Button
        onClick={() => setOpen(true)}
        className={`PlayerCardButton ${role.Type}`}
      >
        <i className={logo}></i>
      </Button>
    </div>
  );
};
