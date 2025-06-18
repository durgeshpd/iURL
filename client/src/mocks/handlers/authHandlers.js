import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.post('http://localhost:3000/user/login', async ({ request }) => {
    const body = await request.json();
    if (body.email === "test@example.com" && body.password === "password123") {
      return HttpResponse.json({ token: "mock-token" });
    }
    return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }),
];
