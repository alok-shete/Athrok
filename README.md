# Athrok

Athrok is a lightweight and flexible state management library for React applications, providing both synchronous and asynchronous storage solutions with an intuitive API. It offers efficient data persistence and seamless integration with various storage mechanisms.

## Features

- Simple API: Athrok provides a straightforward API for managing state in React applications, making it easy to integrate and use.
- Synchronous & Asynchronous Storage: Choose between synchronous and asynchronous storage options based on your application's requirements.
- Efficient Data Persistence: Athrok offers efficient data persistence, ensuring that your application state is reliably stored across sessions.
- Customizable Configuration: Customize storage and persistence options to suit your application's needs.
- Seamless Integration: Athrok seamlessly integrates with various storage mechanisms, providing flexibility and compatibility.

## Installation

You can install Athrok via npm or yarn:

```
npm install athrok
```

or

```
yarn add athrok
```

## Usage

```
import React from 'react';
import { useAStore, createStore } from 'athrok';

// Create a new instance of the store with initial state and actions

const counterStore = createStore(
  { count: 0 }, // Initial state
  (setState, getState) => ({
    // Callback function to generate actions
    increment: () => setState({ count: getState().count + 1 }), // Action to increment count
    decrement: () => setState({ count: getState().count - 1 }), // Action to decrement count
  })
);

//without selector
const CounterComponent = () => {
  const { count, decrement, increment } = useAStore(counterStore);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

//with selector get state
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

//with selector get actions
const CountActionsComponent = () => {
  const { decrement, increment } = useAStore(counterStore, (state) => ({
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

## Documentation

For detailed documentation and usage examples, please visit the Athrok GitHub repository.

Contributing
We welcome contributions from the community! If you encounter any issues or have suggestions for improvement, please feel free to open an issue or submit a pull request on the Athrok GitHub repository.

License
This project is licensed under the MIT License - see the LICENSE file for details.
