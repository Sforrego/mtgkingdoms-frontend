import React from 'react';
import { Modal, Tabs } from 'antd';
import { User } from '../../Types/User';
import { RoleCard } from '../RoleCard';

type TeamOverviewModalProps = {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  team: User[];
};

export const TeamOverviewModal: React.FC<TeamOverviewModalProps> = ({
  isOpen,
  onOk,
  onCancel,
  team
}) => {

  return (
    <Modal
      title="Team Overview"
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      centered
      >
      <Tabs
        defaultActiveKey="0"
        centered
        items={team.map((user, index) => ({
          label: user.username,
          key: String(index),
          children: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <RoleCard role={user.role} />
            </div>
          ),
        }))}
      />
    </Modal>
  );
};