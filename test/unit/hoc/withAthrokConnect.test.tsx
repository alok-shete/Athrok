import { describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { withAthrokConnect } from "./../../../src/hoc/withAthrokConnect";
import { forwardRef } from "react";
import React from "react";

// Sample wrapped component
const SampleComponent = forwardRef<
  HTMLDivElement,
  { prop1: string; stateProp: string }
>(({ prop1, stateProp }, ref) => (
  <div ref={ref}>
    <span data-testid="prop1">{prop1}</span>
    <span data-testid="stateProp">{stateProp}</span>
  </div>
));

// Sample state mapping function
const stateMap = (props: { prop1: string }) => ({
  stateProp: `${props.prop1}-mapped`,
});

// HOC wrapping the SampleComponent
const ConnectedComponent = withAthrokConnect(SampleComponent, stateMap);

describe("withAthrokConnect HOC", () => {
  it("renders the wrapped component", () => {
    render(<ConnectedComponent prop1="test" />);
    expect(screen.queryByTestId("prop1")).toBeTruthy();
    expect(screen.queryByTestId("stateProp")).toBeTruthy();
  });

  it("passes the original props to the wrapped component", () => {
    render(<ConnectedComponent prop1="test" />);
    expect(screen.queryByTestId("prop1")?.textContent).toBe("test");
  });

  it("passes the mapped state to the wrapped component", () => {
    render(<ConnectedComponent prop1="test" />);
    expect(screen.queryByTestId("stateProp")?.textContent).toBe("test-mapped");
  });

  it("forwards the ref to the wrapped component", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ConnectedComponent prop1="test" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.nodeName).toBe("DIV");
  });
});
