import React from "react";
import { Form, FormControlProps } from "react-bootstrap";

interface LabelControlProps extends FormControlProps {
  label: string;
}
export const LabelControl: React.FC<LabelControlProps> = ({
  label,
  children,
  ...opts
}) => {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control {...opts} />
      {children}
    </Form.Group>
  );
};
