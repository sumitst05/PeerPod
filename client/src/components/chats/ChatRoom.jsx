import React from "react";
import { useParams } from "react-router-dom";
import { useRoom } from "../../hooks/useRoom";
import { Chat } from "./Chat";
import { useAuth } from "../../hooks/useAuth";
import { NoAccess } from "./NoAccess";

export const ChatRoom = () => {
  const { roomId } = useParams();
  const { rooms } = useRoom();
  const { role } = useAuth();

  console.log("role when room", role);

  const room = rooms[roomId];

  if (
    !room ||
    !room.allowedRoles.includes(role.toLowerCase()) ||
    !role.toLowerCase() === "faculty"
  ) {
    return <NoAccess roomName={room.name} />;
  }

  return <Chat roomId={roomId} />;
};

export default ChatRoom;
