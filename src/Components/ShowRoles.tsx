import React, { useState } from 'react';
import { Carousel, Input } from 'antd';
import { RoleCard } from "./RoleCard";
import { Role } from "../Types/Role";

type ShowRolesProps = {
    roles: Role[];
  };

export const ShowRoles = ({ roles }: ShowRolesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const carouselRef = React.useRef<any>(null);

  const handleSlideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const slideNumber = event.target.value;
    if (carouselRef.current) {
      carouselRef.current.goTo(slideNumber);
    }
  }
  
  const filteredRoles = roles.filter(role => 
    role.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Input 
        placeholder="Search for a role" 
        onChange={handleSearch} 
        style={{ marginBottom: '20px' }} 
      />

      <Carousel
        ref={carouselRef}
        dots={false}
        beforeChange={(current, next) => setCurrentSlide(next)}
      >
        {filteredRoles.map((role) => (
          <RoleCard key={role.name} role={role} />
        ))}
      </Carousel>
      <input 
        type="range" 
        min="0" 
        max={filteredRoles.length - 1} 
        value={currentSlide} 
        onChange={handleSlideChange}
        style={{
          width: '100%',
          marginTop: '2vmin',
        }}
      />
    </div>
  );
};
