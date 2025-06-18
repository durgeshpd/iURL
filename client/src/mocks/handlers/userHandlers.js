import { http, HttpResponse } from 'msw';

export const userHandlers = [
  http.get('http://localhost:3000/user/profile', () => {
    return HttpResponse.json({ name: "Durgesh", email: "test@demo.com" });
  }),
];
