import React, { forwardRef } from "react";

/**
 * Higher-order component that enhances a component by mapping state props using a state mapping function.
 * @param WrappedComponent The component to be wrapped with state props.
 * @param stateMap A function that maps props to state props.
 * @returns A component with enhanced props from stateMap.
 */
export const withAthrokConnect = <T extends Record<any, any>, R, S>(
  WrappedComponent: React.ComponentType<T>,
  stateMap: (props: Omit<T, keyof R>) => R
) =>
  forwardRef<S, Omit<T, keyof R>>((props, ref) => (
    <WrappedComponent {...(props as T)} ref={ref} {...stateMap(props)} />
  ));
