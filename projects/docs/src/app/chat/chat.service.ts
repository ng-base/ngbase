import { Injectable } from '@angular/core';

interface ChatData {
  id: number;
  message: string;
  type: 'sent' | 'received';
}

@Injectable()
export class ChatService {
  data: ChatData[] = [
    { id: 1, message: 'Hello', type: 'sent' },
    { id: 2, message: 'Hi', type: 'received' },
    { id: 3, message: 'How are you?', type: 'sent' },
    { id: 4, message: 'I am fine', type: 'received' },
    { id: 5, message: 'What about you?', type: 'received' },
    { id: 6, message: 'I am also fine', type: 'sent' },
    { id: 7, message: 'Bye', type: 'sent' },
    { id: 8, message: 'Goodbye', type: 'received' },
  ];
  constructor() {}
}
