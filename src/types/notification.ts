export enum MessageOrigin {
  rlc = 1,
  support = 2,
  admin = 3,
  tedan = 4,
  codal = 5,
}

export interface Notification {
  type: 'Administrative' | 'Accounting';
  params: {
    origin: number,
    messagesCount: MessageOrigin
  };
}
