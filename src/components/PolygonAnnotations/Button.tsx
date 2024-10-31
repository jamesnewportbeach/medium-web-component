import { FC } from "react";

export interface IButtonProps {
  name?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: FC<IButtonProps> = ({ name, onClick }: IButtonProps) => {
  return (
    <button
      style={{
        margin: 8,
        padding: "10px 16px",
        color: "white",
        backgroundColor: "#FF019A",
        border: "none",
        borderRadius: ".4rem",
      }}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;
