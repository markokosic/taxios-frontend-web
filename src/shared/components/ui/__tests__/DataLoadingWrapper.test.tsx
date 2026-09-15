import { render, screen } from '@testing-library/react';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { DataLoadingWrapper } from '../DataLoadingWrapper';

describe('DataLoadingWrapper Component', () => {
  const defaultProps = {
    isLoading: false,
    error: null,
    isEmpty: false,
    skeleton: <div data-testid="skeleton">Loading...</div>,
  };

  it('renders skeleton when isLoading is true', () => {
    const { Wrapper } = createTestAppWrapper();

    render(
      <DataLoadingWrapper {...defaultProps} isLoading>
        <div>Data Content</div>
      </DataLoadingWrapper>,
      { wrapper: Wrapper }
    );

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Data Content')).not.toBeInTheDocument();
  });

  it('renders error message when error is provided', () => {
    const { Wrapper } = createTestAppWrapper();
    const testError = new Error('Netzwerkfehler');

    render(
      <DataLoadingWrapper {...defaultProps} error={testError}>
        <div>Data Content</div>
      </DataLoadingWrapper>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText('Netzwerkfehler')).toBeInTheDocument();
    expect(screen.queryByText('Data Content')).not.toBeInTheDocument();
  });

  it('renders custom error fallback when error and errorFallback are provided', () => {
    const { Wrapper } = createTestAppWrapper();
    const testError = new Error('Fehler');

    render(
      <DataLoadingWrapper
        {...defaultProps}
        error={testError}
        errorFallback={<div>Eigener Fehlertext</div>}
      >
        <div>Data Content</div>
      </DataLoadingWrapper>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText('Eigener Fehlertext')).toBeInTheDocument();
    expect(screen.queryByText('Fehler')).not.toBeInTheDocument();
  });

  it('renders empty fallback when isEmpty is true', () => {
    const { Wrapper } = createTestAppWrapper();

    render(
      <DataLoadingWrapper {...defaultProps} isEmpty>
        <div>Data Content</div>
      </DataLoadingWrapper>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText('No data available.')).toBeInTheDocument();
    expect(screen.queryByText('Data Content')).not.toBeInTheDocument();
  });

  it('renders children when data is loaded without errors', () => {
    const { Wrapper } = createTestAppWrapper();

    render(
      <DataLoadingWrapper {...defaultProps}>
        <div>Data Content</div>
      </DataLoadingWrapper>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText('Data Content')).toBeInTheDocument();
  });
});
