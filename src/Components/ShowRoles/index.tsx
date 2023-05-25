import React, { useState } from 'react';
import { Carousel, Input } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { RoleCard } from "../../Components/RoleCard";
import { Role } from "../../Types/Role";

type ShowRolesProps = {
    roles: Role[];
  };

const ShowRoles = ({ roles }: ShowRolesProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Input 
        placeholder="Search for a role" 
        onChange={handleSearch} 
        style={{ marginBottom: '20px' }} 
      />

      <Carousel
        autoplay
        arrows
        nextArrow={<ArrowRightOutlined/>}
        prevArrow={<ArrowLeftOutlined />}
      >
        {filteredRoles.map((role) => (
          <RoleCard key={role.name} role={role} />
        ))}
      </Carousel>
    </div>
  );
};

export default ShowRoles;
