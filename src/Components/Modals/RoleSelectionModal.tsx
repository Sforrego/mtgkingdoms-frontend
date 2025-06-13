import React from 'react';
import { Modal, Button, Tabs } from 'antd';
import { Role } from '../../Types/Role';
import { RoleCard } from '../RoleCard';

type RoleSelectionModalProps = {
  isOpen: boolean;
  onOk: (selected: Role) => void;
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
  const handleSelect = (role: Role) => {
    // Emit role and then update local state
    onOk(role);
    setSelectedRole(role);
  };

  return (
    <Modal
      title="Select Your Role"
      open={isOpen}
      closable={false}
      footer={null} // no OK/Cancel buttons
      centered
    >
      <Tabs
        centered
        items={potentialRoles.map((role, index) => ({
          label: role.name,
          key: String(index),
          children: (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <RoleCard role={role} />
              <Button
                onClick={() => handleSelect(role)}
                type={selectedRole?.name === role.name ? 'primary' : 'default'}
                style={{ marginTop: '1rem' }}
              >
                {selectedRole?.name === role.name ? 'Selected' : 'Select'}
              </Button>
            </div>
          ),
        }))}
      />
    </Modal>
  );
};