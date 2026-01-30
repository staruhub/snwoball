import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const webpack = require("webpack");
import path from "path";

const nextConfig: NextConfig = {
  // 告诉 Next.js 转译 ratel-mind-web 目录下的代码
  transpilePackages: ["ratel-mind-web"],

  // 禁用静态页面生成，全部使用动态渲染
  output: "standalone",

  // Webpack 配置
  webpack: (config) => {
    // 让 webpack 不解析符号链接，确保 alias 正确工作
    config.resolve.symlinks = false;

    // 确保 webpack 正确解析 package.json exports 字段
    // 这对于 React Router 7+ 的子路径导出（如 react-router/dom）是必需的
    config.resolve.conditionNames = [
      "import",
      "module",
      "require",
      "node",
      "default",
    ];

    // 使用 resolve.alias 确保依赖解析到正确的路径
    // 解决 ratel-mind-web 有自己的 node_modules 导致的多实例问题
    const nodeModulesPath = path.resolve(__dirname, "node_modules");
    const reactRouterPath = path.join(nodeModulesPath, "react-router");

    // 根据环境选择 React Router 的构建版本
    const reactRouterBuildType =
      process.env.NODE_ENV === "production" ? "production" : "development";

    // ratel-mind-web 源代码路径
    const ratelSrcPath = path.resolve(__dirname, "ratel-mind-web/src");

    config.resolve.alias = {
      ...config.resolve.alias,
      // @ratel 别名指向 ratel-mind-web/src
      "@ratel": ratelSrcPath,
      // 精确匹配 react 和 react-dom，避免影响子路径
      "react$": path.join(nodeModulesPath, "react"),
      "react-dom$": path.join(nodeModulesPath, "react-dom"),
      // react-router-dom 指向主应用的依赖
      "react-router-dom": path.join(nodeModulesPath, "react-router-dom"),
      // react-router 子路径导出需要显式配置
      "react-router/dom": path.join(
        reactRouterPath,
        `dist/${reactRouterBuildType}/dom-export.mjs`
      ),
      "react-router": reactRouterPath,
    };

    // 为 import.meta.env 提供 polyfill
    config.plugins.push(
      new webpack.DefinePlugin({
        "import.meta.env": JSON.stringify({
          DEV: process.env.NODE_ENV === "development",
          PROD: process.env.NODE_ENV === "production",
          MODE: process.env.NODE_ENV,
          VITE_API_BASE_URL:
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8003",
          VITE_SNOWBALL_URL:
            process.env.NEXT_PUBLIC_SNOWBALL_URL || "http://localhost:3000",
        }),
      })
    );

    return config;
  },
};

export default nextConfig;
