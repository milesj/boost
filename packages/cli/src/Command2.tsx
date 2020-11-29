import React from 'react';
import { Help } from './components/Help2';

export default class Command {
  renderHelp(): React.ReactElement {
    const metadata = this.getMetadata();

    return (
      <Help
        categories={metadata.categories}
        config={metadata}
        header={metadata.path}
        options={metadata.options}
        params={metadata.params}
      />
    );
  }
}
