import { render, screen } from "@testing-library/react";
import AdminDashboard from "../../src/components/AdminDashboard";
import * as apiHook from "../../src/api/apiClient";

jest.mock("../../src/api/apiClient");

describe("AdminDashboard Functional", () => {
  it("loads company list and records on mount", async () => {
    const mockFetchCompanies = jest.fn().mockResolvedValue({
      data: { body: JSON.stringify({ companies: ["company-a", "company-b"] }) },
    });
    const mockFetchRecords = jest.fn().mockResolvedValue({
      data: {
        body: JSON.stringify({
          records: [
            {
              DeliveryStatus: "Completed",
              CompanyName: "company-a",
              DriverID: "D001",
              DeliveryDate: "2024-05-01",
              Route: "A1",
            },
          ],
        }),
      },
    });

    apiHook.useApiClient.mockReturnValue({
      fetchCompanies: mockFetchCompanies,
      fetchRecords: mockFetchRecords,
    });

    render(<AdminDashboard />);
    expect(await screen.findByText("Total Companies")).toBeInTheDocument();
  });
});
