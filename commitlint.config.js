module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // You can customize rules here if needed
    "body-max-line-length": [0, "always"], // Disable line length restrictions
    "footer-max-line-length": [0, "always"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "ci",
        "chore",
        "docs",
        "ticket",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
      ],
    ],
  },
};
