const checkConnectionStatus = async () => {
  return new Promise((res) => {
    require("dns").resolve("www.google.com", (err: Error) => {
      !err ? res(true) : res(false);
    });
  });
};

export default checkConnectionStatus;
