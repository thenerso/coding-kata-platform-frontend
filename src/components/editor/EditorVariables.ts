export const fontSizeOptions = [14, 16, 18, 20, 24, 28, 32, 40];
export const themeOptions = [
  "monokai",
  "github",
  "solarized_light",
  "terminal",
];

interface ILanguageOptions {
  [key: string]: string;
  javascript: string;
  python: string;
  java: string;
}

export const languagePlaceholders: ILanguageOptions = {
  java: "public class Main {\n//write your solution here\n\n}",
  javascript: "// write your solution here",
  python: "# write your solution here",
};

export const languageOptions: ILanguageOptions = {
  javascript: "js",
  python: "py",
  java: "java",
};
