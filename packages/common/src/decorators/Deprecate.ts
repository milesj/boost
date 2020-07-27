/* eslint-disable no-console */

import isClass from './isClass';
import isMethod from './isMethod';
import isProperty from './isProperty';
import isParam from './isParam';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CustomDescriptor extends TypedPropertyDescriptor<any> {
  initializer?: Function;
}

export default function Deprecate(message?: string) {
  return (
    target: Object | Function,
    property?: string,
    descriptor?: CustomDescriptor | number,
  ): void => {
    const isProtoOrStatic = typeof target === 'function';
    const className = isProtoOrStatic ? (target as Function).name : target.constructor.name;
    const accessSymbol = isProtoOrStatic ? '.' : '#';

    // Class
    if (isClass(target, property, descriptor)) {
      console.debug(message || `Class \`${className}\` has been deprecated.`);

      // Method
    } else if (isMethod(target, property, descriptor)) {
      console.debug(
        message || `Method \`${className + accessSymbol + property}()\` has been deprecated.`,
      );

      // Property
    } else if (isProperty(target, property, descriptor)) {
      console.debug(
        message || `Property \`${className + accessSymbol + property}\` has been deprecated.`,
      );

      // Param
    } else if (isParam(target, property, descriptor)) {
      console.debug(
        message ||
          `Parameter ${descriptor} for \`${
            className + accessSymbol + property
          }()\` has been deprecated.`,
      );
    }
  };
}
