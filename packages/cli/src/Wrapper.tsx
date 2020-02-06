import React from 'react';

export interface WrapperProps {
  foo?: string;
}

export interface WrapperState {
  error: Error | null;
}

export default class Wrapper extends React.Component<WrapperProps, WrapperState> {
  state: WrapperState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    console.log({ error });

    return { error };
  }

  render() {
    if (this.state.error) {
      return this.state.error.message;
    }

    return this.props.children;
  }
}
