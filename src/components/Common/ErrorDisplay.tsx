import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message = 'Something went wrong',
  onRetry,
  fullScreen = false 
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Error</h3>
        <p className="text-gray-500 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-red-100">
      {content}
    </div>
  );
};

// API Error display with specific messages
interface APIErrorDisplayProps {
  error: any;
  onRetry?: () => void;
}

export const APIErrorDisplay: React.FC<APIErrorDisplayProps> = ({ error, onRetry }) => {
  let message = 'An unexpected error occurred';
  let isAuthError = false;

  if (error?.response) {
    const status = error.response.status;
    
    switch (status) {
      case 403:
        message = 'API authentication failed. Please check your API token configuration.';
        isAuthError = true;
        break;
      case 404:
        message = 'The requested resource was not found.';
        break;
      case 429:
        message = 'Rate limit exceeded. Please wait a moment before trying again.';
        break;
      case 503:
        message = 'Clash of Clans API is temporarily unavailable. Please try again later.';
        break;
      default:
        message = `API Error (${status}): ${error.response.data?.message || 'Unknown error'}`;
    }
  } else if (error?.request) {
    message = 'Network error. Please check your internet connection.';
  } else if (error?.message) {
    message = error.message;
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isAuthError ? 'bg-yellow-100' : 'bg-red-100'}`}>
          <AlertCircle className={`w-8 h-8 ${isAuthError ? 'text-yellow-500' : 'text-red-500'}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {isAuthError ? 'Authentication Error' : 'Error'}
          </h3>
          <p className="text-gray-500 max-w-md">{message}</p>
        </div>
        {isAuthError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md text-left">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>To fix this:</strong>
            </p>
            <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
              <li>Go to <a href="https://developer.clashofclans.com" target="_blank" rel="noopener noreferrer" className="underline">developer.clashofclans.com</a></li>
              <li>Create an account and log in</li>
              <li>Create a new API key</li>
              <li>Add your IP address</li>
              <li>Update the API_TOKEN in src/api/cocClient.ts</li>
            </ol>
          </div>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
