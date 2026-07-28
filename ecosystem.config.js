module.exports = {
  apps: [
    {
      name: "be.kendrickheller.com",
      cwd: "./be.kendrickheller.com/apps/api",
      script: "npm.cmd",
      args: "run start",
      env: {
        PORT: 3000
      }
    },
    {
      name: "admin.kendrickheller.com",
      cwd: "./admin.kenrickheller.com",
      script: "npm.cmd",
      args: "start",
      env: {
        PORT: 3001,
        REACT_APP_API_URL: "http://localhost:3000/api",
        REACT_APP_SERVER_URL: "http://localhost:3000"
      }
    },
    {
      name: "kendrickheller.com",
      cwd: "./kendrickheller.com",
      script: "npm",
      args: "start",
      env: {
        PORT: 3002,
        REACT_APP_API_URL: "http://localhost:3000/api",
        REACT_APP_SERVER_URL: "http://localhost:3000"
      }
    }
  ]
};
