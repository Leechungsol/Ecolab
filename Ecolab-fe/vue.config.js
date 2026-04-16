module.exports = {
  productionSourceMap: false,
  pages: {
    index: {
      entry: "src/main.js",
      title: "식품위생점검",
    },
  },
  devServer: {
    allowedHosts: "all",
    client: {
      overlay: false,
    },
  },
};
