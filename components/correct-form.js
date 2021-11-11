import styles from "./addForm.module.scss";
import { useState } from "react";
import AddButton from "./add-button";

const CorrectForm = (props) => {
  const {
    closeModal,
    handleFormSubmit,
    id,
    currencyName,
    currencyCode,
    currencySign,
    amount,
    type,
    date,
    label,
  } = props;

  const defaultData = {
    id: id,
    currencyName: currencyName,
    currencyCode: currencyCode,
    currencySign: currencySign,
    amount: amount,
    type: type,
    date: date,
  };
  const [form, setForm] = useState(defaultData);
  const [select, setSelect] = useState(`${currencyName} [${currencyCode}]`);

  const formatDate = () => {
    const array = date.split("-");
    array[2] = "2021";
    return array.join("/");
  };

  const handleChange = (event) => {
    const target = event.target;
    // set the amount and type
    if (target.name === "amount" || target.name === "type") {
      if (target.value === "-- select a type --") {
        setForm({
          ...form,
          [target.name]: type,
        });
      } else if (target.value === "") {
        setForm({
          ...form,
          [target.name]: amount,
        });
      } else {
        setForm({
          ...form,
          [target.name]: target.value,
        });
      }
    }
    // set the date
    if (target.name === "date") {
      if (target.value === "") {
        var unFormattedDate = date;
      } else {
        var unFormattedDate = target.value;
      }
      const formattedDate = unFormattedDate.replace(/\//g, "-");
      setForm({
        ...form,
        [target.name]: formattedDate,
      });
    }
  };

  const submitForm = () => {
    if (form.amount == 0) {
      alert("did you want to delete this item?");
      closeModal;
    } else {
      handleFormSubmit(form);
    }
  };

  return (
    <>
      <h1 className={styles.heading}>correct {label}</h1>
      <hr className={styles.solidDivider} />
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="name">currency</label>
          <select
            name={name}
            defaultValue={select}
            className={styles.disabledFormControl}
            id={name}
          >
            <option key={"option"} disabled hidden>
              {currencyName} [{currencyCode}]
            </option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="currentAmount">current settings</label>
          <input
            disabled
            value={amount}
            className={styles.disabledFormControl}
            id="currentAmount"
          />
          <input
            disabled
            value={type}
            className={styles.disabledFormControl}
            id="currentType"
          />
          <input
            disabled
            value={formatDate()}
            className={styles.disabledFormControl}
            id="currentDate"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="amount">corrections</label>
          <input
            onChange={handleChange}
            name="amount"
            type="tel"
            className={styles.formControl}
            id="amount"
            placeholder="adjusted amount.."
            maxLength="12"
          />
          <select
            onChange={handleChange}
            name="type"
            className={styles.formControl}
            id="type"
          >
            <option key={"no option"} selected>
              -- select a type --
            </option>
            <option key="1">investment</option>
            <option key="2">withdrawal</option>
          </select>
          <input
            className={styles.formControl}
            onChange={handleChange}
            type="date"
            placeholder="dd/mm/yyyy"
            id="date"
            name="date"
            required
          ></input>
        </div>
      </form>
      <AddButton
        buttonText={"correct"}
        showLogo={false}
        submitForm={submitForm}
      />
    </>
  );
};

export default CorrectForm;
