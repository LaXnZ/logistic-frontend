import { render, fireEvent } from "@testing-library/react";
import FileUpload from "../../src/components/FileUpload";
import * as apiHook from "../../src/api/apiClient";
import { useAuth } from "react-oidc-context";

jest.mock("../../src/api/apiClient");
jest.mock("react-oidc-context");

describe("FileUpload Functional", () => {
  it("uploads a file when selected", async () => {
    const mockUploadFile = jest.fn().mockResolvedValue({});
    const file = new File(["content"], "test.csv", { type: "text/csv" });

    apiHook.useApiClient.mockReturnValue({ uploadFile: mockUploadFile });
    useAuth.mockReturnValue({
      user: { profile: { email: "test@company.com" } },
    });

    const { getByText, getByLabelText } = render(
      <FileUpload companyId="company-a" />
    );
    const input = getByLabelText(/file/i);
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(getByText("Upload"));

    expect(mockUploadFile).toHaveBeenCalledWith(
      file,
      "company-a",
      "test@company.com"
    );
  });
});
