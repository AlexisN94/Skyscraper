const AssertRecordType = <T>() => {
  return <K extends { [key: string]: T }>(arg: K): K => arg;
};

export default AssertRecordType;
