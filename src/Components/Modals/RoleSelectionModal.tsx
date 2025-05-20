import React from 'react';
import { Modal, Button, Tabs } from 'antd';
import { Role } from '../../Types/Role';
import { RoleCard } from '../RoleCard';

type RoleSelectionModalProps = {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  potentialRoles: Role[];
  selectedRole: Role | null;
  setSelectedRole: (role: Role) => void;
};

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onOk,
  onCancel,
  potentialRoles,
  selectedRole,
  setSelectedRole,
}) => {
  return (
    <Modal
      title="Select Your Role"
      open={isOpen}
      closable={false}
      onOk={onOk}
      onCancel={onCancel}
      centered
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onOk}
          disabled={!selectedRole}
        >
          OK
        </Button>,
      ]}
    >
      <Tabs centered>
        {potentialRoles.map((role, index) => (
          <Tabs.TabPane tab={role.name} key={index}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <RoleCard role={role} />
              <Button
                onClick={() => setSelectedRole(role)}
                type={selectedRole === role ? 'primary' : 'default'}
                style={{ marginTop: '1rem' }}
              >
                {selectedRole === role ? 'Selected' : 'Select'}
              </Button>
            </div>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Modal>
  );
};