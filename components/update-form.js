import styles from "./addForm.module.scss";
import { useState } from "react";
import AddButton from "./add-button";

const UpdateForm = (props) => {
  const { code, name, closeModal, handleFormSubmit, amount } = props;
  const [form, setForm] = useState(amount);
  const [select, setSelect] = useState(`${name} [${code}]`);

  const handleChange = (event) => {
    const target = event.target;
    // set the new amount
    if (target.name === "amount") {
      setForm(target.value);
    }
  };

  const submitForm = () => {
    if (form === amount) {
      alert("new amount must differ from current amount");
      closeModal;
    } else if (form === "0") {
      alert("did you want to delete this coin?");
      closeModal;
    } else {
      handleFormSubmit(form);
    }
  };

  return (
    <>
      <h1 className={styles.heading}>update coin</h1>
      <hr className={styles.solidDivider} />
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="name">coin</label>
          <select name={name} defaultValue={select} className={styles.formControl} id={name}>
            <option key={"option"} disabled hidden>
              {name} [{code}]
            </option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="currentAmount">current amount</label>
          <input
            disabled
            value={amount}
            name="currentAmount"
            className={styles.formControl}
            id="currentAmount"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="amount">new amount</label>
          <input
            onChange={handleChange}
            name="amount"
            type="tel"
            required
            className={styles.formControl}
            id="amount"
            placeholder="2.7865..."
            maxLength="12"
          />
        </div>
      </form>
      <AddButton
        buttonText={"update"}
        showLogo={false}
        submitForm={submitForm}
      />
    </>
  );
};

export default UpdateForm;
