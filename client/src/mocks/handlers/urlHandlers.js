import { http, HttpResponse } from 'msw';

export const urlHandlers = [
  http.get('http://localhost:3000/user/urls', () => {
    return HttpResponse.json({
      urls: [
        {
          shortId: "abc123",
          redirectURL: "https://google.com",
          totalClicks: 42,
        },
      ],
    });
  }),

  http.post('http://localhost:3000/url', async ({ request }) => {
    const body = await request.json();
    if (!body.url) {
      return HttpResponse.json({ error: "Missing URL" }, { status: 400 });
    }
    return HttpResponse.json({ id: "xyz789" });
  }),
];
