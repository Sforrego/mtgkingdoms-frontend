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

  if (!user?.role) {
    return (
      <div className="PlayerInGame">
        <p>{user?.username}</p>
        <p>{"Unknown"}</p>

        <Button disabled className="PlayerCardButton Unknown">
          <i className="ss ss-bcore ss-mythic ss-grad"></i>
        </Button>
      </div>
    );
  }

  const logo = roleTypeToSetMap[user.role.type || ""];

  return (
    <div className="PlayerInGame">
      <p>{user.username}</p>
      <p>{user.role.name ? "The " + user.role.name : "Unknown"}</p>

      {user.role.type ? (
        <>
          <Modal
            open={open}
            onCancel={() => setOpen(false)}
            destroyOnClose
            footer={null}
            title={null}
            centered
          >
            <RoleCard role={user.role} />
          </Modal>

          <Button
            onClick={() => setOpen(true)}
            disabled={!user.role.name}
            className={`PlayerCardButton ${user.role.type}`}
          >
            <i className={logo}></i>
          </Button>
        </>
      ) : (
        <Button disabled className="PlayerCardButton Unknown">
          <i className="ss ss-bcore ss-mythic ss-grad"></i>
        </Button>
      )}
    </div>
  );
};
