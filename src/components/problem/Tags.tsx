import { Chip } from "@mui/material";

interface ITagChip {
  tags: string[] | undefined;
}
const Tags = ({ tags }: ITagChip) => {
  return (
    <>
      {tags?.map((tag, i) => (
        <Chip label={tag} key={`${i}-${tag}`} />
      ))}
    </>
  );
};

export default Tags;
