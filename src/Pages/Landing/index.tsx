type LandingProps =
  | {
      roomCode: string;
      setRoomCode: (roomCode: string) => void;
      joinRoom: () => void;
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
    <button className="button" onClick={props?.handleLogin}>
      Get Started
    </button>
  ) : (
    <div className="form-container">
      <input
        className="input-field"
        type="text"
        value={props.roomCode}
        onChange={(e) => props.setRoomCode(e.target.value)}
        placeholder="Enter room code"
      />
      <button className="button" onClick={props.joinRoom}>
        Join Room
      </button>
      <button className="button" onClick={props.createRoom}>
        Create Room
      </button>
    </div>
  );
};
