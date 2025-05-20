import React from 'react';
import { Modal, Tabs } from 'antd';
import { Role } from '../../Types/Role';
import { RoleCard } from '../RoleCard';

type NoblesModalProps = {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  nobles: Role[];
};

export const NoblesModal: React.FC<NoblesModalProps> = ({
  isOpen,
  onOk,
  onCancel,
  nobles
}) => {
  return (
    <Modal
      title="Noble Roles"
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      centered
    >
      <Tabs centered>
        {nobles.map((noble, index) => (
          <Tabs.TabPane tab={noble.name} key={index}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <RoleCard role={noble} />
            </div>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Modal>
  );
};