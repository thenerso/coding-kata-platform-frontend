import styled from "@emotion/styled";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {
  fontSizeOptions,
  languageOptions,
  themeOptions,
} from "./EditorVariables";

const StyledFormControl = styled(FormControl)`
  flex: 2;
`;

const OptionsWrapper = styled("div")`
  display: flex;
  & div:first-of-type {
    flex: 1;
    margin-right: 10px;
  }
  margin-bottom: 10px;
`;
interface IEditorTools {
  language: string;
  setLanguage?: (param: string) => void;
  theme: string;
  setTheme: (param: string) => void;
  fontSize: number;
  setFontSize: (param: number) => void;
}

const EditorTools: React.FC<IEditorTools> = ({
  language,
  setLanguage,
  theme,
  setTheme,
  fontSize,
  setFontSize,
}) => {
  return (
    <OptionsWrapper>
      <StyledFormControl fullWidth>
        <InputLabel id="font-size-label">Font Size</InputLabel>
        <Select
          labelId="font-size-label"
          value={fontSize}
          label="Font Size"
          onChange={(e) => setFontSize(parseInt(e.target.value as string))}
        >
          {fontSizeOptions.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
      <StyledFormControl fullWidth>
        <InputLabel id="theme-label">Theme</InputLabel>
        <Select
          labelId="theme-label"
          value={theme}
          label="Theme"
          onChange={(e) => setTheme(e.target.value)}
        >
          {themeOptions.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
      <StyledFormControl fullWidth>
        <InputLabel id="language-label">Language</InputLabel>
        <Select
          labelId="language-label"
          value={language}
          label="Language"
          disabled={!setLanguage}
          onChange={(e) =>
            setLanguage ? setLanguage(e.target.value) : () => {}
          }
        >
          {Object.keys(languageOptions).map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
    </OptionsWrapper>
  );
};

export default EditorTools;
