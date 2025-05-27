import { render, screen } from '@testing-library/react';
import Dashboard from '../../src/pages/Dashboard';
import { AuthProvider } from 'react-oidc-context';

test('renders dashboard navigation buttons', () => {
  render(<Dashboard />, { wrapper: AuthProvider });
  expect(screen.getByText(/upload file/i)).toBeInTheDocument();
  expect(screen.getByText(/admin analytics/i)).toBeInTheDocument();
});
