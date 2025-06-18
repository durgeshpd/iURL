import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../components/Login";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import axios from "axios";

// 🔁 Mock AuthContext
const loginMock = vi.fn();
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

// 🔁 Mock Axios
vi.mock("axios");

describe("Login Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderLogin = () =>
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

  test("renders login form fields correctly", () => {
    renderLogin();

    expect(screen.getByRole("heading", { name: /login/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });

  test("submits form with valid credentials and calls login", async () => {
    axios.post.mockResolvedValueOnce({ data: { token: "mock-token" } });

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText(/password/i), "password123");

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/user/login"),
        {
          email: "test@example.com",
          password: "password123",
        }
      );
      expect(loginMock).toHaveBeenCalledWith("mock-token");
    });
  });

  test("displays error on login failure", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "Invalid credentials" } },
    });

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText(/email/i), "fail@example.com");
    await userEvent.type(screen.getByPlaceholderText(/password/i), "wrongpass");

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      expect(loginMock).not.toHaveBeenCalled();
    });
  });
});
