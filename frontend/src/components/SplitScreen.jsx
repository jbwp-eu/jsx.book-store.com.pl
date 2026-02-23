

export const Panel = ({ children, flexBasis }) => {
  return (
    <div
      className="split-screen__panel"
      style={flexBasis != null ? { "--flex-basis": flexBasis } : undefined}
    >
      {children}
    </div>
  );
};

export const Wrapper = ({ children, className }) => {
  return (
    <div className={`wrapper ${className}`}>
      {children}
    </div>
  )
}

const SplitScreen = ({ children, className, flexBasis_1, flexBasis_2, flexBasis_3, exists }) => {
  const [left = <></>, middle = <></>, right = <></>] = children;
  return (
    <Wrapper className={className}>
      <Panel flexBasis={flexBasis_1}>
        {left}
      </Panel>
      <Panel flexBasis={flexBasis_2}>
        {middle}
      </Panel>
      {exists && <Panel flexBasis={flexBasis_3}>
        {right}
      </Panel>}
    </Wrapper>
  );
}

export default SplitScreen;