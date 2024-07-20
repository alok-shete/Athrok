# Store

The `createStore` function in Athrok allows you to create a store with state and actions. This is useful for managing more complex state logic in your application. The `useAStore` hook is then used to access the state and actions of the store in your components.

## createStore

The `createStore` function takes three arguments:

1. **initialState**: The initial state of the store.
2. **actionsCreator**: A function that takes `setState` and `getState` as arguments and returns an object of actions.
3. **config**: An optional configuration object for persistence and other settings.

### Example

```tsx
import { createStore } from "athrok";

// Define initial state
const initialState = {
  count: 0,
};

// Define actions
const actionsCreator = (setState, getState) => ({
  increment: () => setState((pre) => ({ count: pre.count + 1 })),
  decrement: () => setState((pre) => ({ count: pre.count - 1 })),
});

// Create a store
const counterStore = createStore(initialState, actionsCreator);
```

## useAStore

The `useAStore` hook allows you to access the state and actions of the store in your components. It takes two arguments:

1. **store**: The store created by `createStore`.
2. **selector**: An optional selector function to select specific parts of the state.

### Example

```tsx
import React from "react";
import { useAStore } from "athrok";
import { counterStore } from "./path-to-your-store";

// Component without selector
const CounterComponent = () => {
  const { count, increment, decrement } = useAStore(counterStore);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

// Component with state selector
const CountDisplayComponent = () => {
  const { count } = useAStore(counterStore, (state) => ({
    count: state.count,
  }));

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  );
};

// Component with actions selector
const CountActionsComponent = () => {
  const { increment, decrement } = useAStore(counterStore, (state) => ({
    increment: state.increment,
    decrement: state.decrement,
  }));

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};
```

### React Native Example

For React Native, you can use similar components but with React Native elements:

```tsx
import React from "react";
import { View, Text, Button } from "react-native";
import { useAStore } from "athrok";
import { counterStore } from "./path-to-your-store";

// Component without selector
const CounterComponentNative = () => {
  const { count, increment, decrement } = useAStore(counterStore);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={increment} />
      <Button title="Decrement" onPress={decrement} />
    </View>
  );
};

// Component with state selector
const CountDisplayComponentNative = () => {
  const { count } = useAStore(counterStore, (state) => ({
    count: state.count,
  }));

  return (
    <View>
      <Text>Count: {count}</Text>
    </View>
  );
};

// Component with actions selector
const CountActionsComponentNative = () => {
  const { increment, decrement } = useAStore(counterStore, (state) => ({
    increment: state.increment,
    decrement: state.decrement,
  }));

  return (
    <View>
      <Button title="Increment" onPress={increment} />
      <Button title="Decrement" onPress={decrement} />
    </View>
  );
};
```

### Configuration Object (IAthrokStoreConfig)

The `config` parameter in `createStore` allows you to configure persistence and other settings:

```tsx
export type IAthrokStoreConfig<T> =
  | { persist?: undefined; name?: string }
  | { persist: IAthrokPersistConfig<T>; name: string };

export interface IAthrokPersistConfig<T> {
  enable: boolean;
  debounceTime?: number; // Optional debounce time in milliseconds (default is 200ms)
  version?: number; // Optional version number for migration
  migrate?: (storedValue: any, version?: number) => any; // Function to migrate persisted state
  partial?: (state: T) => Partial<T>; // Function to create a partial state from the current state
  merge?: (initialValue: T, storedValue: any) => any; // Function to merge initial and stored state
}
```

Use the `config` parameter to enable persistence, specify a debounce time, handle state migration, create partial states, and merge states.
