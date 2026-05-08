import React from "react";

const Error = ({ error }: { error: any }) => {
  const err = error.toString();
  return <div>{err}</div>;
};

export default Error;
