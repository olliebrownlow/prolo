import styles from "./addForm.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import AddButton from "./add-button";

const CorrectForm = (props) => {
  const { handleFormSubmit, investmentItem, label, isShown } = props;

  const [form, setForm] = useState(investmentItem);
  const [select, setSelect] = useState(
    `${investmentItem.currencyName} [${investmentItem.currencyCode}]`
  );
  const [isShown2, setIsShown2] = useState(!isShown);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const formatDate = () => {
    const array = investmentItem.date.split("-");
    array[2] = `20${array[2]}`;
    return array.join("/");
  };

  const formatDateForComparison = () => {
    const array = investmentItem.date.split("-");
    array[2] = `20${array[2]}`;
    return array.reverse().join("-");
  };

  const handleChange = (event) => {
    const target = event.target;
    // set the amount and type
    if (target.name === "amount" || target.name === "type") {
      if (target.value === "-- select a type --") {
        setForm({
          ...form,
          [target.name]: investmentItem.type,
        });
      } else if (target.value === "") {
        setForm({
          ...form,
          [target.name]: investmentItem.amount,
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
        var unFormattedDate = investmentItem.date;
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
      toast.error("did you want to delete this item?", {
        id: "zeroCorrection",
      });
    } else if (
      form.amount === investmentItem.amount &&
      (form.date === formatDateForComparison() ||
        form.date === investmentItem.date) &&
      form.type === investmentItem.type
    ) {
      toast.error("change at least one field to trigger an update", {
        id: "blankCorrection",
      });
    } else {
      setIsButtonDisabled(true);
      handleFormSubmit(form);
      setIsShown2(true);
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
              {investmentItem.currencyName} [{investmentItem.currencyCode}]
            </option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="currentAmount">current values</label>
          <input
            disabled
            value={investmentItem.amount}
            className={styles.disabledFormControl}
            id="currentAmount"
          />
          <input
            disabled
            value={investmentItem.type}
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
        isShown={isShown2}
        isButtonDisabled={isButtonDisabled}
      />
    </>
  );
};

export default CorrectForm;
