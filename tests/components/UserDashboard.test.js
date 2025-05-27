import { render, screen } from "@testing-library/react";
import UserDashboard from "../../src/components/UserDashboard";
import * as apiHook from "../../src/api/apiClient";

jest.mock("../../src/api/apiClient");

describe("UserDashboard Functional", () => {
  it("loads and displays the correct dashboard title", async () => {
    apiHook.useApiClient.mockReturnValue({
      fetchRecords: jest
        .fn()
        .mockResolvedValue({ data: { body: JSON.stringify({ records: [] }) } }),
    });

    render(<UserDashboard email="lanzbutsmurf@gmail.com" />);
    expect(screen.getByText(/COMPANY B DASHBOARD/i)).toBeInTheDocument();
  });
});
