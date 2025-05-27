import { render, screen } from "@testing-library/react";
import RecordsViewer from "../../src/components/RecordsViewer";
import * as apiHook from "../../src/api/apiClient";

jest.mock("../../src/api/apiClient");

describe("RecordsViewer Functional", () => {
  it("displays message when no company is selected", () => {
    apiHook.useApiClient.mockReturnValue({
      fetchRecords: jest.fn(),
      fetchCompanies: jest
        .fn()
        .mockResolvedValue({
          data: { body: JSON.stringify({ companies: [] }) },
        }),
    });

    render(<RecordsViewer />);
    expect(screen.getByText(/select a company/i)).toBeInTheDocument();
  });
});
