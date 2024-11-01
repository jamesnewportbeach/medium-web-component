import { FC } from "react";

export interface IButtonProps {
  name?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: FC<IButtonProps> = ({ name, onClick }: IButtonProps) => {
  return <button onClick={onClick}>{name}</button>;
};

export default Button;
