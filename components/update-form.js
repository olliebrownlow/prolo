import styles from "./addForm.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import AddButton from "./add-button";

const UpdateForm = (props) => {
  const { code, name, handleFormSubmit, amount, label, isShown } = props;
  const [form, setForm] = useState("");
  const [select, setSelect] = useState(`${name} [${code}]`);
  const [isShown2, setIsShown2] = useState(!isShown);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (event) => {
    const target = event.target;
    // set the new amount
    if (target.name === "amount") {
      setForm(target.value);
    }
  };

  const submitForm = () => {
    if (form === "") {
      toast.error("please add an amount to trigger an update", {
        id: "zeroAmountAdded",
      });
    } else if (form == 0) {
      toast.error("did you want to delete this currency?", {
        id: "noNewAmount",
      });
    } else if (form === amount) {
      toast.error("new amount must differ from current amount", {
        id: "noNewAmount",
      });
    } else {
      setIsButtonDisabled(true);
      setIsShown2(true);
      handleFormSubmit(form);
    }
  };

  return (
    <>
      <h1 className={styles.heading}>update {label}</h1>
      <hr className={styles.solidDivider} />
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="name">{label}</label>
          <select
            name={name}
            defaultValue={select}
            className={styles.disabledFormControl}
            id={name}
          >
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
            className={styles.disabledFormControl}
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
        isShown={isShown2}
        isButtonDisabled={isButtonDisabled}
      />
    </>
  );
};

export default UpdateForm;
