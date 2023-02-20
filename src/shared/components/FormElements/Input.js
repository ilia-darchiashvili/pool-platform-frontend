import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        checked: action.check,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      };
    }
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    checked: props.initialValue || false,
    isTouched: false,
    isValid: props.initialValid || false
  });

  const { id, onInput } = props;
  const { value, checked, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, checked, isValid);
  }, [id, value, checked, isValid, onInput]);

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      check: event.target.checked,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  let element;
  switch (props.element) {
    case 'input':
      element = <input
                  id={props.id}
                  type={props.type}
                  placeholder={props.placeholder}
                  onChange={changeHandler}
                  onBlur={touchHandler}
                  value={inputState.value}
                  checked={inputState.checked}
                  min={props.min}
                  max={props.max}
                  disabled={props.disabled}
                />;
      break;
    case 'select':
      element = <select
                  id={props.id}
                  onChange={changeHandler}
                  onBlur={touchHandler}
                  value={inputState.value}
                  disabled={props.disabled}
                >
                  {props.placeholder && <option key={"null-value"} value={null} style={{display: 'none'}}>{props.placeholder}</option>}
                  {props.selectData?.map(item => (
                    <option key={item.id} value={item.id ? (item.id + '/' + item.displayName + '/' + item.isFemale) : item.displayName}>{item.displayName}</option>
                  ))}
                </select>;
      break;
    default:
      element = <textarea
                  id={props.id}
                  rows={props.rows || 3}
                  onChange={changeHandler}
                  onBlur={touchHandler}
                  value={inputState.value}
                />;
  }
  // const element =
  //   props.element === 'input' ? (
  //     <input
  //       id={props.id}
  //       type={props.type}
  //       placeholder={props.placeholder}
  //       onChange={changeHandler}
  //       onBlur={touchHandler}
  //       value={inputState.value}
  //       checked={inputState.checked}
  //       min={props.min}
  //       max={props.max}
  //       disabled={props.disabled}
  //     />
  //   ) : (
  //     <textarea
  //       id={props.id}
  //       rows={props.rows || 3}
  //       onChange={changeHandler}
  //       onBlur={touchHandler}
  //       value={inputState.value}
  //     />
  //   );

  return (
    <div
      className={`form-control ${!inputState.isValid &&
        inputState.isTouched &&
        'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
