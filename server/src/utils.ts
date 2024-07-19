import db from './db';
import { Message } from './db/models/message';
import { User } from './db/models/user';
import { Socket } from 'socket.io';

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
function hasType(str) {
  // valid message needs a type property at least
  const obj = JSON.parse(str);
  if (obj.type) {
    return true;
  }
  return false;
}
export function divideStringDataToObjects(data: string) {
  const array = data.split('\n'); // because socket.io package concats some messages
  return array.map((item) => {
    if (isJson(item) && hasType(item)) {
      return JSON.parse(item);
    }
  });
}
export function objectToString(obj) {
  return JSON.stringify(obj) + '\n';
}
export function multiUnicast(message: Message) {
  const stringMessage = JSON.stringify(message) + '\n';
  db.users.forEach((user) => {
    user.socket.write(stringMessage);
  });
}
export function unicastToUser(message: Message, user: User) {
  const stringMessage = JSON.stringify(message) + '\n';
  user.socket.write(stringMessage);
}
export function unicast(message: Message, socket: Socket) {
  const stringMessage = JSON.stringify(message) + '\n';
  socket.write(stringMessage);
}
