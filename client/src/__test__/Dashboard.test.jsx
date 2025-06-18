import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../components/Dashboard";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { vi } from "vitest";

// 🔁 Mock AuthContext
const logoutMock = vi.fn();
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    token: "mock-token",
    logout: logoutMock,
  }),
}));

// 🔁 Mock Axios
vi.mock("axios");

const mockProfile = { name: "Durgesh", email: "durgesh@example.com" };
const mockUrls = {
  urls: [{ shortId: "abc123", redirectURL: "https://google.com", totalClicks: 42 }],
};

const renderDashboard = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </QueryClientProvider>
  );

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    axios.get.mockImplementation((url) => {
      if (url.includes("/user/profile")) return Promise.resolve({ data: mockProfile });
      if (url.includes("/user/urls")) return Promise.resolve({ data: mockUrls });
      return Promise.reject(new Error("Unhandled GET: " + url));
    });

    axios.post.mockImplementation((url) => {
      if (url.includes("/url")) return Promise.resolve({ data: { id: "xyz789" } });
      return Promise.reject(new Error("Unhandled POST: " + url));
    });
  });

  test("renders profile and URL data", async () => {
    renderDashboard();

    expect(await screen.findByText(/name:/i)).toBeInTheDocument();
    expect(screen.getByText("Durgesh")).toBeInTheDocument();
    expect(screen.getByText("durgesh@example.com")).toBeInTheDocument();

    expect(await screen.findByText("https://google.com")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();

    // Optional: check short URL element
    expect(
      screen.getByText((content, element) =>
        element?.tagName.toLowerCase() === "a" && content.includes("abc123")
      )
    ).toBeInTheDocument();
  });

  test("generates new short URL", async () => {
    renderDashboard();

    const input = await screen.findByPlaceholderText(/paste a long url/i);
    const button = screen.getByRole("button", { name: /generate/i });

    await userEvent.type(input, "https://test.com");
    await userEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/url"),
        { url: "https://test.com" },
        { headers: { Authorization: "Bearer mock-token" } }
      );
      expect(screen.getByText(/new short url/i)).toBeInTheDocument();
      expect(input).toHaveValue("");
    });
  });

  test("shows validation error if input is empty", async () => {
    renderDashboard();

    const button = await screen.findByRole("button", { name: /generate/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/enter a valid url/i)).toBeInTheDocument();
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  test("handles API error when generating URL", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "URL generation failed" } },
    });

    renderDashboard();

    const input = await screen.findByPlaceholderText(/paste a long url/i);
    await userEvent.type(input, "https://badurl.com");

    const button = screen.getByRole("button", { name: /generate/i });
    await userEvent.click(button);

    expect(await screen.findByText(/url generation failed/i)).toBeInTheDocument();
  });

  test("logout button calls logout function", async () => {
    renderDashboard();

    const logoutBtn = await screen.findByRole("button", { name: /logout/i });
    await userEvent.click(logoutBtn);

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });
  });
});
