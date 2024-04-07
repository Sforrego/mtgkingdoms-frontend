import React, { useState } from 'react';
import { Modal, Checkbox, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Role } from '../../Types/Role';
import { RoleTypes } from '../../Types/RoleType';
import { RoleCard } from '../RoleCard';
import './RoleSelectionModal.css';

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
  const [selectedRoleForDetails, setSelectedRoleForDetails] = useState<Role | null>(null);

  const handleCheckboxChange = (role: Role, checked: boolean) => {
    const updatedSelectedRoles = checked
      ? [...selectedRolesPool, role]
      : selectedRolesPool.filter((selectedRole) => selectedRole.name !== role.name);
    setSelectedRolesPool(updatedSelectedRoles);
  };

  const openRoleDetails = (role: Role) => {
    setSelectedRoleForDetails(role);
  };

  let lastRoleType: string | null = null;

  return (
    <>
      <Modal
        title="Select Roles Pool"
        open={isOpen}
        onOk={onOk}
        onCancel={onCancel}
        centered
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {roles
          .filter((role) => role.type !== RoleTypes.SubRole)
          .map((role, index) => {
            const isNewSection = lastRoleType !== role.type;
            const sectionKey = isNewSection ? `header-${role.type}` : `role-${role.type}-${index}`;

            // If it's a new section, update lastRoleType for the next iteration
            if (isNewSection) lastRoleType = role.type;

            return (
              // Wrap the returning JSX in one fragment with a unique key
              <React.Fragment key={sectionKey}>
                {isNewSection && (
                  <div className="role-type-header" style={{ gridColumn: '1 / -1' }}>
                    <h3>{role.type}s</h3>
                  </div>
                )}
                <div className="role-item">
                  <Checkbox
                    checked={selectedRolesPool.some((selectedRole) => selectedRole.name === role.name)}
                    onChange={(e) => handleCheckboxChange(role, e.target.checked)}
                  >
                    {role.name}
                  </Checkbox>
                  <Button 
                    icon={<EyeOutlined />} 
                    size="small" 
                    onClick={() => openRoleDetails(role)}
                    style={{ marginLeft: 'auto', marginRight: '8px', flexShrink: 0 }} 
                  />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Modal>

      {selectedRoleForDetails && (
        <Modal
          open={!!selectedRoleForDetails}
          onCancel={() => setSelectedRoleForDetails(null)}
          footer={null}
        >
          <RoleCard role={selectedRoleForDetails} />
        </Modal>
      )}
    </>
  );
};