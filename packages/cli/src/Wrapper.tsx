import React from 'react';
import Failure from './Failure';

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
    return { error };
  }

  render() {
    const { error } = this.state;

    if (error) {
      return <Failure error={error} />;
    }

    return this.props.children;
  }
}
