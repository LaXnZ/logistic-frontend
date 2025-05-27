
import { renderHook } from '@testing-library/react';
import { useApiClient } from '../../src/api/apiClient';
import { AuthContext } from 'react-oidc-context';

const mockUser = {
  id_token: 'mocked-token',
  profile: { email: 'test@example.com' },
};

const wrapper = ({ children }) => (
  <AuthContext.Provider value={{ user: mockUser }}>
    {children}
  </AuthContext.Provider>
);

describe('useApiClient', () => {
  it('returns auth header with token', () => {
    const { result } = renderHook(() => useApiClient(), { wrapper });
    const headers = result.current.fetchRecords('company-id').config.headers;
    expect(headers.Authorization).toBe('Bearer mocked-token');
  });

  it('defines required methods', () => {
    const { result } = renderHook(() => useApiClient(), { wrapper });
    expect(typeof result.current.uploadFile).toBe('function');
    expect(typeof result.current.fetchStatus).toBe('function');
    expect(typeof result.current.fetchCompanies).toBe('function');
  });
});
