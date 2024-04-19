import { Button } from "antd";
import React from 'react';

type LandingProps =
  | {
      roomCode: string;
      setRoomCode: (roomCode: string) => void;
      joinRoom: (roomCode: string) => void;
      createRoom: () => void;
      handleLogin?: never;
    }
  | {
      handleLogin: () => void;
      roomCode?: never;
      setRoomCode?: never;
      joinRoom?: never;
      createRoom?: never;
    };

export const Landing = (props: LandingProps) => {  
  return "handleLogin" in props ? (
    <Button onClick={props.handleLogin}>
      Get Started
    </Button>
  ) : (
    <div key="formContainer" className="form-container">
      <input
        className="input-field"
        type="text"
        value={props.roomCode}
        onChange={(e) => props.setRoomCode(e.target.value)}
        placeholder="Enter room code"
      />
      {/* <Button onClick={() => props.roomCode ? props.joinRoom(props.roomCode) : props.joinRoom("690420")}> */}
      <Button onClick={() => props.joinRoom(props.roomCode)}>
        Join Room
      </Button>
      <Button onClick={props.createRoom}>
        Create Room
      </Button>
    </div>
  );
};