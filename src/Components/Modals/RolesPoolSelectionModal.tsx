import React from 'react';
import { Modal, Checkbox } from 'antd';
import { Role } from '../../Types/Role';

type RoleSelectionModalProps = {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  roles: Role[];
  selectedRolesPool: Role[];
  setSelectedRolesPool: (roles: Role[]) => void;
};

export const RolesPoolSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onOk,
  onCancel,
  roles,
  selectedRolesPool,
  setSelectedRolesPool,
}) => {
  const handleChange = (selectedRoleNames: string[]) => {
    const updatedSelectedRoles = roles.filter((role) =>
      selectedRoleNames.includes(role.name!)
    );
    setSelectedRolesPool(updatedSelectedRoles);
  };

  return (
    <Modal
      title="Select Roles Pool"
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      centered
    >
      <Checkbox.Group
        value={selectedRolesPool.map((role) => role.name)}
        onChange={handleChange}
        style={{ width: '100%', flexDirection: 'column' }}
      >
        {roles.map((role, index) => (
          <Checkbox key={index} value={role.name}>
            {role.name}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Modal>
  );
};