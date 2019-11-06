import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

/**
 * A generic form component for text-only forms.
 * @param fields A list `[{ name, label, type }]` describing form fields.
 * @param data A mapping such that `data[field[i].name]` is the current
 * state of the field
 * @param onSubmit a callback for form submission of the form `(event) => { ... }`
 * @param changeField a function called on field change `(fieldName, newValue)`.
 * @param state an `asyncState` as defined in "utils/asyncStates"
 */
export default function SimpleForm({
  fields, data, onSubmit, changeField, state,
}) {
  // create each field in the form from the `fields` prop
  const formFields = fields.map(({ type, name, label }) => (
    <Form.Group key={name} controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        value={data[name]}
        onChange={(e) => changeField(name, e.target.value)}
        type={type} />
    </Form.Group>
  ));

  return (
    <div>
      <Form onSubmit={onSubmit}>
        {formFields}
        {state.isError
          ? <Alert variant="danger">
            {state.error}
          </Alert>
          : ''}
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    </div>
  );
}